import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN } from '../config';


class JwtServices {

    static sign(payload, expiry = '180s', secret = JWT_ACCESS_TOKEN){
        return jwt.sign(payload, secret, {expiresIn : expiry});
    }


    static verify(token, secret = JWT_ACCESS_TOKEN){
        return jwt.verify(token, secret);
    }
}

export default JwtServices;