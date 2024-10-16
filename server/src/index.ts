import express, {Request, Response} from "express"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import cors from 'cors';
import pg from 'pg';
import { body, validationResult } from 'express-validator'

const app = express();
app.use(cors());
app.use(express.json());

// const pool = new pg.Pool({
//     user: "my_user",
//     database: "twtc",
//     password: "root",
//     port: 5432,
//     host: "localhost"
// });
// pool.connect







/*
// hashing and jwt stuff
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
*/






app.post("/", (req: Request, res: Response)=>{
    console.log(req.body);
    res.send("resp");
})


// app.post("/login", async (req: Request, res: Response)=>{

    // const jwtResult: string = jwt.sign(req.body, "hellothisismysecrret");
    // console.log(req.body);
    // res.send({"token":jwtResult});
    // try {

        // const client: pg.PoolClient = await pool.connect();
        // const queryResult = await client.query("select * from users");
        // console.log(queryResult);
        // res.send({"rows":queryResult.rows});
    
        // get login and password from request body
        // query db for user with given username
        // if not found send not found
        // if found compare passwords
        // if same send jwt
    
    
//     } catch(err) {
//         console.log("db error ", err);
//     }
// })


app.post("/register", 
    // body("username").notEmpty().withMessage("Username field is empty")
    //                 .isLength({max:20}).withMessage("Username is too long"),

    // body("password").notEmpty().withMessage("Password field is empty")
    //                 .isLength({max:20}).withMessage("Username is too long"),


    body("username")
        .matches(/^[a-zA-Z0-9]{1,20}$/)
        .withMessage("Username must only contain letters and numbers and be 1-20 characters long"),
    body("password")
        .matches(/^[a-zA-Z0-9!@#$%&*]{6,20}$/)
        .withMessage("Password must only contain letters, numbers, special characters: !@#$%&*, and be 6-20 characters long"),

    
    async (req: Request, res: Response)=>{


    const valRes = validationResult(req);
    console.log(valRes);

    if (!valRes.isEmpty()) {
        res.status(400).send({result:valRes});
        return; // otherwise    Error: Cannot set headers after they are sent to the client
    }

    res.status(200).send({result:valRes});

    // validate the data
    // if bad send response
    // if ok check if user exists in db
    // if yes send response
    // if no generate salt, incrypt the password, store the data
    // if error send response
    // if ok send user data and go through login stuff automatically and give jwt

    
    // try {
    //     const salt: string = await bcrypt.genSalt(10);
    //     const hashedPassword: string = await bcrypt.hash(req.body.password, salt);
    //     // const hashedUsername: string = await bcrypt.hash(req.body.username, salt);
    //     const comparisonResult: boolean = await bcrypt.compare("letmein", hashedPassword);
    //     if (comparisonResult) {
    //         res.send({res:"same"});
    //     } else {
    //         // res.send({res:hashedPassword});
    //         res.send({res:"notsame"});
    //     }
    // } catch (err) {
    //     console.log("salt error ", err);
    //     res.send({
    //         err:"errorrrr"
    //     });
    // }
    
    // console.log(req.body);
    // res.send("resp");
})







app.listen(3000, ()=>console.log("working"));