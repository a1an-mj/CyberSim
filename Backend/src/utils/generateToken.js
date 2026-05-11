import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const generateToken = (userId, res) => {
    const payLoad = {id: userId};
    const token = jwt.sign(payLoad,process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN || "7d", 
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: (1000 * 60 * 60 * 24) * 7
    })
    return token
};