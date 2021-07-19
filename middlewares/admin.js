
import CustomErrorHandler from './../services/CustomErrorHandler';
import { User } from '../models';

const admin = async(req, res, next) => {
    try {
        const user = User.findOne({_id : req.user._id });

        if(user === 'admin'){
            next();
        } else {
            return next(CustomErrorHandler.notFound());
        }
    } catch (err) {
        return next(err);
    }
}

export default admin;