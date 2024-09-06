require('dotenv').config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import CookieParser from "cookie-parser";


//body parser
app.use(express.json({limit: "50mb"}));

//cookieParser
app.use(CookieParser());

//cors
app.use(cors({
    origin:process.env.ORIGIN
}));

//testing API

app.get("/test", (req:Request, res:Response, next:NextFunction) => {
res.status(200).json({
    success:true,
    message:"Api is working",
});
});

//unknown route
app.all("*",(req:Request, res:Response, next:NextFunction) => {
    const err = new Error('Route ${req.originalUrl} not found') as any;
    err.statuscode=404;
    next(err);
});