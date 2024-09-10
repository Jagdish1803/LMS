require('dotenv').config();
import { Request, Response, NextFunction } from "express";
import userModel from "../modules/user.modules";
import ErrorHandlerfr from "../utils/ErrorHandler";
import { catchAsyncError } from "../middleware/catchAsyncError";
import { create } from "domain";
import { env } from "process";
import jwt, { Secret } from "jsonwebtoken";
import ejs, { Template } from "ejs";
import path from "path";
import { error } from "console";
import sendMail from "../utils/sendMail";
import { subscribe } from "diagnostics_channel";


//register user
interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export const registrationUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {
            return next(new ErrorHandlerfr("Email already exist", 400))
        };
        const user: IRegistrationBody = {
            name,
            email,
            password,
        };
        const activationToken = createActivationToken(user);

        const activationcode = activationToken.activationcode;

        const data = { user: { name: user.name }, activationcode };
        const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mails.ejs"), data);
        try {
            await sendMail({
                email: user.email,
                subject: "Activate your account",
                template: "activation-mail.ejs",
                data,
            });

            res.status(201).json({
                success: true,
                message: `Please check your email : $(user,email) to activate yoru account`,
                activationToken: activationToken.token,

            });
        } catch { error } {

        }
    }
    catch (error: any) {
        return next(new ErrorHandlerfr(error.message, 400))
    }
});
interface IActivationToken {
    token: string;
    activationcode: string;
}
export const createActivationToken = (user: any): IActivationToken => {
    const activationcode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign({
        user, activationcode
    }, process.env.ACTIVATION_SECRET as Secret, {
        expiresIn: "5m",
    });

    return { token, activationcode };
}