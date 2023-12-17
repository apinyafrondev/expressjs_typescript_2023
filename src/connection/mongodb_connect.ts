import * as mongoose from 'mongoose';
// connect to database
require('dotenv').config();
export const MongoDBConnection = async() =>{
    const ConnectString:any = process.env.MONGODB_URL;
    try{
        await mongoose.connect(ConnectString);
        console.log("connected!")
    }catch(err){
        console.log("can't connect")
    }
}