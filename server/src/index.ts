import express, {Request, Response, NextFunction} from "express"
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken';
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


// https://chatgpt.com/c/671401fb-7b5c-8008-b457-3db97d2ac1e6
// declare global {
//     namespace Express {
//         interface Request {
//             user?: string | JwtPayload; 
//         }
//     }
// }

/*

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // const token = req.auth

    const token = req.header("Authorization")?.replace('Bearer ', '');

    if (!token) {
        res.status(400).send("no token");
        return;
    }

    // if (req.body.name === "valya") {
    //     res.send("middleware triggered");
    //     return;
    // }

    jwt.verify(token, "qwertyuiopasdfghjklzxcvbnm123456", (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired. Please log in again.' });
            }
            return res.status(401).json({ message: 'Token is not valid.' });
        }

        // Attach the user to req object on a custom property (req.tokenUser)
        // (req as any).tokenUser = decoded;
        res.send({resp:decoded});
        return;
        next();
    });

    // req.user = "dd";
    // next();


}

*/



// CSRF 
// https://chatgpt.com/c/6716b463-6b7c-8008-adf1-91ed234e43f8





// app.post("/", authMiddleware, (req: Request, res: Response)=>{
//     console.log(req.body);
//     res.send("resp");
// })

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



             // https://chatgpt.com/c/671401fb-7b5c-8008-b457-3db97d2ac1e6
             // https://dvmhn07.medium.com/jwt-authentication-in-node-js-a-practical-guide-c8ab1b432a49
            const token = jwt.sign(
                {
                    username: userRequesResult.rows[0].name,
                    id: userRequesResult.rows[0].id
                }, 
                "secret",
// JWT SECRET
                {
                    expiresIn:"15m"
                }
            );





            res.status(200).send({
                token,
                username,
                id: userRequesResult.rows[0].id
            });



        } catch(err) {
            console.log(err);
            res.status(500).send("DB error!");
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