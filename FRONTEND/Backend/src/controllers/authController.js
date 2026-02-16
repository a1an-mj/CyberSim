import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const userExist = await pool.query(
            "SELECT * from users where email=$1 ",
            [email]
        );

        if(userExist.rows.length > 0){
            return res.status(400).json({message: "User already exsist with this email"})
        }

        // Hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashedPassword]
        );

        res.status(201).json({ user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const login = async (req,res) => {
    try{
        const {email,password} = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const userExist = await pool.query(
            "SELECT * from users where email=$1",
            [email]
        )
        if(userExist.rows.length === 0){
            return res.status(400).json({message: "No User Found with this email"})
        }

        const user = userExist.rows[0];

        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid){
            return res.status(400).json({message: "Invalid Email or Password"})
        }

        //JWT Token
        const token = generateToken(user.id, res)

        res.status(201).json({jwtToken: token})

    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const logout = async (req,res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({
        status: "success",
        message: "Logged out successfully"
    })
}

export { register, login, logout };
