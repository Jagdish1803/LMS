import mongoose, { Document, model, Schema } from "mongoose";
import brcrypt from "bcryptjs";
import { url } from "inspector";
import { timeStamp } from "console";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;

    avatar: {
        public_id: string;
        url: string;
    },
    role: string;
    isVerifed: boolean;
    courses: Array<{ CoursesID: string }>;
    comparePassword: (password:string) => Promise<Boolean>;
};

const userSchema : Schema<IUser> = new mongoose.Schema({
    name:{
        type:String,
        required:[true , "please enter your name"],
    },
    email:{
        type:String,
        required:[true , "please enter your email"],
        validate:{
            validator:function(value:string){
                return emailRegexPattern.test(value);
            },
            message:"please enter a valid email"
        },
        unique:true,
    },
    password:{
        type:String,
        required:[true , "please enter your password"],
        mainlength:[6 , "password must be atleast 6 character"],
        select:false,
    },
        avatar:{
            public_id: String,
            url:String,
        },
        role:{
            type:String,
            default:"user",
        },
        isVerifed:{
            type:Boolean,
            default:false,
        },
        courses:[
            {
                CoursesID:String,

            }
        ],

},{timestamps:true});

//Hash our password before saving

userSchema.pre<IUser>('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
}
