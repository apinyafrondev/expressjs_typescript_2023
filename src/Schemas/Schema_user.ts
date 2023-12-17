import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {type: String, required: true},
    email: {type: String, required: true},
    password:{type:String,required:true},
    prefix:{type:String,required:false},
    firstname:{type:String,required:false},
    lastname:{type:String,required:false},
    gender:{type:String,required:false},
    birthday:{type:String,required:false},
    createdate:{type:String,required:true}
  },
);

export type Users = mongoose.InferSchemaType<typeof userSchema>;
export const Users = mongoose.model('userdatas', userSchema);