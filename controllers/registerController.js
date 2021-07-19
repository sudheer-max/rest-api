import Joi from "joi";
import CustomErrorHandler from './../services/CustomErrorHandler';
import bcrypt from 'bcrypt';
import JwtServices from './../services/JwtServices';
import {JWT_REFRESH_TOKEN} from '../config';
import {User, RefreshToken} from '../models';   

const registerController = {
    async register(req, res, next){

        // validate from Joi
        const registerSchema = Joi.object({
            name : Joi.string().min(8).max(30).required(),
            email : Joi.string().email().required(),
            password : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            repeat_password : Joi.ref('password')
        });

        const { error } = registerSchema.validate(req.body);

        if(error){
            return next(error);
        }

        try {
            const exists = await User.exists({email : req.body.email});

            if(exists){
                return next(CustomErrorHandler.emailExists());
            }
        } catch (err) {
            return next(err);
        }

        // hashed password 
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        // save users into database 
        const user = new User({
            name, 
            email,
            password : hashedPassword
        });

        let access_token;
        let refresh_token;

        try {
            const result = await user.save();

            // generate token  
            access_token = JwtServices.sign({_id : result._id, role : result.role});
            refresh_token = JwtServices.sign({_id : result._id, role : result.role}, '1y', JWT_REFRESH_TOKEN);

            // whitelist into database 
            await RefreshToken.create({token : refresh_token});

        } catch (err) {
            return next(err);
        }

        res.json({access_token, refresh_token});
    }
}

export default registerController;