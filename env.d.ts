declare module "jsonwebtoken" {
    import { sign, decode, verify } from "jsonwebtoken";
    declare const jwt = { sign, decode, verify }
    export default jwt
}

export {}