import { error } from 'console';
import mongoonse from 'mongoose';
require('dotenv').config();

const dbURL:string=process.env.DB_URL || '';

const connectDB = async () =>{
    try{
        await mongoonse.connect("mongodb+srv://jnaikar62:kZapQzciZrl9fokK@lms.crrc8.mongodb.net/Lms").then((data:any) =>{
            console.log(`Database connected with ${data.connection.host}`)
        })
    } catch (error:any){
        console.log(error.message);
        setTimeout(connectDB,5000);
    }
}

export default connectDB;
