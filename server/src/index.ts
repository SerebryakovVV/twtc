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





app.post(
    "/login", 
    
    // VALIDATION HERE
    
    async (req: Request, res: Response)=>{

        const client = await pool.connect();
        let queryResult;
        try {
            queryResult = await client.query("SELECT * FROM users WHERE name = $1", [req.body.username]);
            console.log(queryResult);
            // res.status(200).send({res:queryResult});
        } catch(e) {
            console.log(e);
            res.status(500).send("DB error");
            return;
        } finally {
            client.release();
        }


        const comparisonResult = await bcrypt.compare(req.body.password, queryResult.rows[0].password_hash);
        console.log(comparisonResult);
       
        res.status(200).send("All good");

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
    

        ////////////

        // const comparisonResult: boolean = await bcrypt.compare("letmein", hashedPassword);
        //     if (comparisonResult) {
        //         res.send({res:"same"});
        //     } else {
        //         // res.send({res:hashedPassword});
        //         res.send({res:"notsame"});
        //     }

        ///////////


        // JWT STUFF HERE

})













app.post(
    "/register", 
    body("username")
        .matches(/^[a-zA-Z0-9]{1,20}$/)
        .withMessage("Username must only contain letters and numbers and be 1-20 characters long"),
    body("password")
        .matches(/^[a-zA-Z0-9!@#$%&*]{6,20}$/)
        .withMessage("Password must only contain letters, numbers, special characters: !@#$%&*, and be 6-20 characters long"),
    async (req: Request, res: Response)=>{
        const valRes = validationResult(req);
        if (!valRes.isEmpty()) {
            res.status(403).send({result:valRes});
            return;
        }
        /*
        
        CHECK IF THE USER ALREADY EXISTS
        
        */
        let hashedPassword: string;
        try {
            const salt: string = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
            res.status(500).send("Hashing error");
            return;
        }
        const client = await pool.connect();
        try {   
            const queryResult = await client.query("INSERT INTO users (name, password_hash) values ($1, $2)", [req.body.username, hashedPassword]);
            res.status(200).send(queryResult);

        } catch(e) {
            console.log(e);
            res.status(500).send("DB error");
        } finally {
            client.release();
        }
        // validate the data
        // if bad send response
        // if ok check if user exists in db
        // if yes send response
        // if no generate salt, incrypt the password, store the data
        // if error send response
        // if ok send user data and go through login stuff automatically and give jwt
})





process.on('exit', () => {
    pool.end();
});

app.listen(3000, ()=>console.log("working"));