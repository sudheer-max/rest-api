
import Joi from "joi";
import CustomErrorHandler from './../services/CustomErrorHandler';
import JwtServices from './../services/JwtServices';
import {JWT_REFRESH_TOKEN} from '../config';

const refreshController = {
    async refresh(req, res, next){
        // validate token with joi 
        const refreshSchema = Joi.object({
            refresh_token : Joi.string().required(),
        });

        const { error } = refreshSchema.validate(req.body);

        if(error){
            return next(error);
        }

        // check into our database refresh token available or not  

        try {
            const refreshToken = await RefreshToken.findOne({token : req.body.refresh_token});
            
            if(!refreshToken){
                return next(CustomErrorHandler.unAuthorization());
            }

            let userId;
            try {
                const {_id, role } = await JwtServices.verify(refreshToken.token, JWT_REFRESH_TOKEN);
                userId = _id;

            } catch (err) {
                return next(err);
            }

            // check user is present into our database or not 

            const user = await User.findOne({_id : userId});

            if(!user){
                return next(CustomErrorHandler.unAuthorization());
            }

            // generate new access_token and refresh_token 

            let access_token = JwtServices.sign({_id : user._id, role : user.role});
            let refresh_token = JwtServices.sign({_id : user._id, role : user.role}, '1y', JWT_REFRESH_TOKEN);

            await RefreshToken.create({token : refresh_token});

            res.json({access_token, refresh_token});

        } catch (err) {
            return next(err);
        }
    }
}

export default refreshController;