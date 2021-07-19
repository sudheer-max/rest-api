

class CustomErrorHandler extends Error {
    constructor(status, msg){
        super();
        this.status = status;
        this.message = msg;
    }

    static emailExists(message = "Email is already exist, please try different email id!"){
        return new CustomErrorHandler('401', message);
    }


    static credentialError(message = "Email or password is wrong!"){
        return new CustomErrorHandler('440', message);
    }

    static notFound(message = "User not found!"){
        return new CustomErrorHandler('440', message);
    }

    static unAuthorization(message = "User not authorized!"){
        return new CustomErrorHandler('440', message);
    }
}

export default CustomErrorHandler;