import Joi from 'joi';
import { User, RefreshToken } from '../models';
import CustomErrorHandler from './../services/CustomErrorHandler';
import bcrypt from 'bcrypt';
import JwtServices from './../services/JwtServices';
import {JWT_REFRESH_TOKEN} from '../config';

const loginController = {
    async login(req, res, next){
        // check login Credential with Joi

        const loginSchema = Joi.object({
            email : Joi.string().email().required(),
            password : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,10}$')),

        });

        const { error } = loginSchema.validate(req.body);

        if(error){
            return next(error);
        }

        // check email is present or not 

        try {
            const user = await User.findOne({email : req.body.email});

            if(!user){
                return next(CustomErrorHandler.credentialError())
            }

            // then check password correct or not 
            const password = await bcrypt.compare(req.body.password, user.password);

            if(!password){
                return next(CustomErrorHandler.credentialError());
            }

            // generate new jwt token 

            let access_token = JwtServices.sign({_id : user._id, role : user.role});
            let refresh_token = JwtServices.sign({_id : user._id, roel : user.role}, '1y', JWT_REFRESH_TOKEN);

            await RefreshToken.create({token : refresh_token});

            res.json({access_token, refresh_token});



        } catch (err) {
            return next(err);
        }

        


    },
    async logout(req, res, next){
        // validate refresh_token using Joi 

        const logoutSchema = Joi.object({
            refresh_token : Joi.string().required()
        });

        const { error } = logoutSchema.validate(req.body);

        if(error){
            return next(error);
        }

        try {
            const refreshtoken = await RefreshToken.deleteOne({token : req.body.refresh_token});

        } catch (err) {
            return next(err);
        }

        res.json({status : '200 OK'});
    }
}

export default loginController;