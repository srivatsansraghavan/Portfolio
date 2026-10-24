import type { NextFunction, Request, Response } from "express";
export declare function addUser(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function loginUser(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function logoutUser(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function isLoggedInUser(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=userController.d.ts.map