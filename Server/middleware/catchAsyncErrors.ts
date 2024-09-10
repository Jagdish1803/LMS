import { NextFunction, Request } from "express";

export const catchAsyncError = (theFunc: any) => (res: Response, req: Request, next: NextFunction) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);

};