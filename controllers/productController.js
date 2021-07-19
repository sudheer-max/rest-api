
import Joi from 'joi';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import CustomErrorHandler from '../services/CustomErrorHandler';
import productSchema from '../validators/productValidators';

const storage = multer.diskStorage({
    destination : (req, file, cb) => cb(null, '/uploads'),
    filename : (req, file, cb) => {
        uniqueFileName = `${Date.now()}-${Math.round(Math.random * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueFileName);
    }
});

const data = multer({storage, limits : {fileSize : 1000 * 5} }).single('image');



const productController = {
    async store(req, res, next){

        data(req, res, async(err)=> {
            if(err){
                return next(err);
            }

            const filePath = req.file.path;

            // validate data with joi 

    
            const { error } = productSchema.validate(req.body);
    
            if(error){
                // if error comes through in validation error then image will remove 

                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if(err){
                        return next(CustomErrorHandler.notFound());
                    }
                })
                return next(error);
            }

            const { name, disc, qty, price, image } = req.body;

            let document;
            try {
                document = await Product.create({
                    name,
                    disc,
                    price,
                    qty,
                    image : filePath
                });

            } catch (err) {
                return next(err);
            }

            res.json(document);
        });


    },
    async update(req, res, next){
        data(req, res, async(err)=> {
            if(err){
                return next(err);
            }

            let filePath;

            if(req.file){
                filePath = req.file.path;
            }

            // validate data with joi 

    
            const { error } = productSchema.validate(req.body);
    
            if(error){
                // if error comes through in validation error then image will remove 

                if(req.file){

                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if(err){
                            return next(CustomErrorHandler.notFound());
                        }
                    });
                }

                return next(error);
            }

            const { name, disc, qty, price, image } = req.body;

            let document;
            try {
                document = await Product.findOneAndUpdate({_id : req.params.id }, {
                    name,
                    disc,
                    price,
                    qty,
                    ...(req.file && {image : filePath}),
                }, { new : true });

            } catch (err) {
                return next(err);
            }

            res.json(document);
        });
    },
    async destroy(req, res, next){
        try {
            let document = await Product.findOneAndRemove({_id : req.params.id});

            if(!document){
                return next(new Error("Product not found"));
            }

            // remove image from server 

            const imagePath = document._doc.image;

            fs.unlink(`${appRoot}/${imagePath}`, (err) => {
                if(err){
                    return next(CustomErrorHandler.notFound());
                }
            });

            res.status(200).json(document);

        } catch (err) {
            return next(err);
        }
    },
    async index(req, res, next){

        let document;
        try {
            document = await Product.find().select('-updatedAt -__v').sort({_id : -1});
        } catch (err) {
            return next(err);
        }

        res.json(document);
    },
    async show(req, res, next){
        let document;
        try {
            document = await Product.findOne({_id : req.params.id}).select('-updatedAt -__v').sort({_id : -1});
        } catch (err) {
            return next(err);
        }
        res.json(document);
    }
}

export default productController;