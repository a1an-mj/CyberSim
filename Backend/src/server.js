import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import pool from "./config/db.js"

dotenv.config();

const app = express() ;
const port = process.env.PORT || 3001;

//Middlewares
app.use(express.json());
app.use(cors());

//Import Routes
import authRoutes from "./routes/authRoutes.js"

app.use("/auth",authRoutes);



app.listen(port,() => {
    console.log("PORT from env:", process.env.PORT);
    console.log(`Server running on PORT ${port}`)
});