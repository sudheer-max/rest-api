import mongoose from 'mongoose';
import {APP_URL } from '../config';

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    disc : {
        type : String,
        required : true
    },
    qty : {
        type : Number,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    image : {
        type : String,
        required : true,
        get : (image) => {
            return `${APP_URL}/${image}`;
        }
    }
    
}, {timestamps : true, toJSON : {getters : true }});

export default mongoose.model('Product', productSchema, 'products');