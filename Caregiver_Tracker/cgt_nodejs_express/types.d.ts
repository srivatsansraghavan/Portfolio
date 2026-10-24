import { IUserSchema } from "./dto/schema.dto.ts";

declare global {
    namespace Express {
        interface Request {
            user?: IUserSchema;
        }
    }
}