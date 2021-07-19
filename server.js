import express from 'express';
import { APP_PORT, DB_URL } from './config';
import mongoose from 'mongoose';
import errorHandler from './middlewares/errorHandler';
const app = express();
import router from './routes';
import path from 'path';

global.appRoot = path.resolve(__dirname);

// middlewares 
app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.use('/api', router);

app.use('/uploads', express.static('uploads'));

// db connection 

mongoose.connect(DB_URL, {useNewUrlParser : true, useUnifiedTopology : true, useFindAndModify : false});

const db = mongoose.connection;

db.on('error', console.error.bind('Connection error...'));

db.once('open', () => {
    console.log('Db connected..');
})



app.use(errorHandler);

app.listen(APP_PORT,  () => {
    console.log(`Server is running on ${APP_PORT}`);
});