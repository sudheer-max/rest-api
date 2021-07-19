import Joi from 'joi';

const productSchema = Joi.object({
    name : Joi.string().required(),
    disc : Joi.string().required(),
    qty : Joi.number().required(),
    price : Joi.string().required(),
    image : Joi.string().required()
});

export default productSchema;