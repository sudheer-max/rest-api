
import CustomErrorHandler from './../services/CustomErrorHandler';
import JwtServices from './../services/JwtServices';

const auth = async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return next(CustomErrorHandler.unAuthorization());
        }

        const token = authHeader.split(' ')[1];

        try {
            const { _id, role } = await JwtServices.verify(token);

            const user = {
                _id,
                role
            } 

            req.user = user;

            next();


        } catch (err) {
            return next(err);
        }
    } catch (err) {
        return next(err);
    }

}

export default auth;