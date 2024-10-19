import express, {Request, Response} from "express"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import cors from 'cors';
import pg from 'pg';
import { body, validationResult } from 'express-validator'

const app = express();
app.use(cors());
app.use(express.json());

const pool = new pg.Pool({
    user: "my_user",
    database: "twtc",
    password: "root",
    port: 5432,
    host: "localhost"
});
// pool.connect







app.post("/", (req: Request, res: Response)=>{
    console.log(req.body);
    res.send("resp");
})




// https://chatgpt.com/c/6713eb44-3b00-8008-8933-5231d3533978       validation logic reusability
app.post(
    "/login",
    body("username")
        .matches(/^[a-zA-Z0-9]{1,20}$/)
        .withMessage("Username must only contain letters and numbers and be 1-20 characters long")
        .isString()
        .withMessage("Username should be a string"),
    body("password")
        .matches(/^[a-zA-Z0-9!@#$%&*]{6,20}$/)
        .withMessage("Password must only contain letters, numbers, special characters: !@#$%&*, and be 6-20 characters long")
        .isString()
        .withMessage("Password should be a string"),
    async (req: Request, res: Response)=>{
        const valRes = validationResult(req);
        if (!valRes.isEmpty()) {
            res.status(422).send("Validation error!");
            return;
        }
        const {username, password} = req.body; 
        const client = await pool.connect();
        let userRequesResult;
        try {
            userRequesResult = await client.query("SELECT * FROM users WHERE name = $1", [username]);
            if (userRequesResult.rows.length === 0) {
                res.status(404).send("User not found!");
                return;
            }
            try {
                const comparisonResult = await bcrypt.compare(password, userRequesResult.rows[0].password_hash);
                if (!comparisonResult) {
                    res.status(401).send("Wrong password!");
                    return;
                }
            } catch(err) {
                console.log(err);
                res.status(500).send("Hash comparison error!");
                return;
            }
            res.status(200).send({
                username: userRequesResult.rows[0].name,
                id: userRequesResult.rows[0].id
            });
        } catch(err) {
            console.log(err);
            res.send("DB error!");
        } finally {
            client.release();
        }
    ///////////////
   //           //
  //    JWT    //
 //           //
///////////////
})













app.post(
    "/register", 
    body("username")
        .matches(/^[a-zA-Z0-9]{1,20}$/)
        .withMessage("Username must only contain letters and numbers and be 1-20 characters long")
        .isString()
        .withMessage("Username should be a string"),
    body("password")
        .matches(/^[a-zA-Z0-9!@#$%&*]{6,20}$/)
        .withMessage("Password must only contain letters, numbers, special characters: !@#$%&*, and be 6-20 characters long")
        .isString()
        .withMessage("Password should be a string"),
    async (req: Request, res: Response)=>{
        const valRes = validationResult(req);
        if (!valRes.isEmpty()) {
            res.status(422).send("Validation error!");
            return;
        }
        const {username, password} = req.body; 
        const client = await pool.connect();
        try {
            try {
                const userExists = await client.query("SELECT 1 FROM users WHERE name = $1", [username]);
                if (userExists.rows.length !== 0) {
                    res.status(409).send("User already exists!");
                    return;
                }
            } catch (err) {
                console.log(err);
                res.status(500).send("DB error, while checking existence!");
                return;
            }
            let hashedPassword: string;
            try {
                const salt: string = await bcrypt.genSalt(10);
                hashedPassword = await bcrypt.hash(password, salt);
            } catch (err) {
                console.log(err);
                res.status(500).send("Hashing error");
                return;
            }
            const queryResult = await client.query("INSERT INTO users (name, password_hash) values ($1, $2)", [username, hashedPassword]);
            res.status(200).send(queryResult);
        } catch(err) {
            console.log(err);
            res.status(500).send("DB error, while inserting");
        } finally {
            client.release();
        }
     /////////////////////////////////////////////////////////////////////////////////////
    //                                                                                 //
   //   if ok send user data and go through login stuff automatically and give jwt    //
  //                                                                                 //
 /////////////////////////////////////////////////////////////////////////////////////
})





process.on('exit', () => {
    pool.end();
});

app.listen(3000, ()=>console.log("working"));