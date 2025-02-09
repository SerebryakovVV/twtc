import express, {Request, Response, NextFunction} from "express"
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken';
import cors from 'cors';
import pg from 'pg';
import { body, validationResult } from 'express-validator'
import fs from 'fs';
import multer from 'multer';
const cookieParser = require("cookie-parser");
import * as sqlStrings from "./sqlStrings";




const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true, 
		allowedHeaders: ["authorization", "Content-Type"] 
    })
);
app.use(express.json());
app.use(cookieParser());


const pool = new pg.Pool({
    user: "my_user",
    database: "twtc",
    password: "root",
    port: 5432,
    host: "localhost"
});

interface RequestProtected extends Request {
	id?: string,
	username?: string
}



const JWT_ACCESS_SECRET = "accSec";
const JWT_REFRESH_SECRET = "refSec";
const generateAccessJwt = (data: {username:string, id:string}) => jwt.sign(data, JWT_ACCESS_SECRET, {expiresIn:"15m"});
const generateRefreshJwt = (data: {username:string, id:string}) => jwt.sign(data, JWT_REFRESH_SECRET, {expiresIn:"15d"});





app.get("/refresh", (req, res) => {
	const refreshToken = req.cookies.refreshToken;
	if (!refreshToken) {
		res.status(401).send();
		return;
	}
	jwt.verify(refreshToken, JWT_REFRESH_SECRET, (e:any, d:any) => {
		if (e) {
			res.status(403).send();
			return;
		} else {
			const newAccessToken = generateAccessJwt({username:d.username, id:d.id}); // can be not correct object, error handling needed
			res.status(200).send(newAccessToken);
			return;
		}
	})
}) 


// need to get the id and name from the token, otherwise everybody would be able to change any data with any token
// vvv this will check the access on every request and either pass or block, triggering refresh request on the frontend
const validateJwt = (req: RequestProtected, res: Response, next: NextFunction) => {
	const authHeader = req.headers["authorization"];
	if (!authHeader) {
		res.status(401).send("no auth headers");
		return;
	}
	const accessToken =  Array.isArray(authHeader) 
						? authHeader[0].split(" ")[1] 
						: authHeader.split(" ")[1];
	jwt.verify(accessToken, JWT_ACCESS_SECRET, (err:any, data:any) => {
		if (err) {  
			// if (err.name === "TokenExpiredError") // check if error is expired tho
			res.status(403).send();
			return;
		} else {
			req.id = data.id;
			req.username = data.username;
			next();
		}
	})
}






// https://chatgpt.com/c/6713eb44-3b00-8008-8933-5231d3533978       validation logic reusability
app.post("/login", 
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
            userRequesResult = await client.query(sqlStrings.getUser, [username]);
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

			
			

			////////////////////////////// THE JWT PART
			const accessToken = generateAccessJwt({
				username: userRequesResult.rows[0].name,
				id: userRequesResult.rows[0].id
			})
			const refreshToken = generateRefreshJwt({
				username: userRequesResult.rows[0].name,
				id: userRequesResult.rows[0].id
			})
			res.cookie("refreshToken", refreshToken, {"httpOnly":true}); // set expiration date
			res.status(200).send({
                accessToken,
                username,
                id: userRequesResult.rows[0].id
            });

			////////////////////////////////


            





        } catch(err) {
            console.log("login error", err);
            res.status(500).send("DB error!");
        } finally {
            client.release();
        }
})


app.post("/register", 
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
                const userExists = await client.query(sqlStrings.checkUserExists, [username]);
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
            const queryResult = await client.query(sqlStrings.addUser, [username, hashedPassword]);
            res.status(200).send(queryResult);
        } catch(err) {
            console.log("register error", err);
            res.status(500).send("DB error, while inserting");
        } finally {
            client.release();
        }
})


// multer and images https://chatgpt.com/c/67422857-082c-8008-8782-0c68431e4d7a
// change to async file read
// change to for ... of ... loop https://chatgpt.com/c/674230a0-71d4-8008-acd5-f4bd0e2721ad
// I DONT NEED TO USE UPLOAD FOLDER, USE MEMORY, REWRITE EVERYTHING
// RECONFIGURE THE MULTER, REWRITE PFP ENDPOINT TO USE MEMORY
app.post("/post", upload.array('images'), async (req, res)=>{
    const { text, authorID } = req.body;
	let images: Express.Multer.File[] = [];
	let bufferArray: Buffer[] = [];
	if (req.files && req.files.length !== 0) {
		images = req.files as Express.Multer.File[];
		for (const image of images) {
            const buffer = await fs.promises.readFile(image.path);
            bufferArray.push(buffer);
        }
	}
	const client = await pool.connect();
	try {
		await client.query("BEGIN");
		const postInsertResult = await client.query(sqlStrings.addPostBase, [authorID, text]);
		const postID = postInsertResult.rows[0].id;
		if (bufferArray.length !== 0) {
			for (const [index, image] of bufferArray.entries()) {
				await client.query(sqlStrings.addPostImg, [postID, image, index]);
			}
		}
		await client.query("COMMIT");
	} catch(e) {
		console.log("post creation error", text, authorID, e);
		await client.query("ROLLBACK");
		res.status(500).send("post creation db fail");
	} finally {
		if (images && images.length !== 0) {
			for (const image of images) {
				try {
					await fs.promises.unlink(image.path);
				} catch(e) {
					console.log("error deleting the file", image);
				}
			}
		}
		client.release();
	}   
})
// https://chatgpt.com/c/6733afd6-4cd8-8008-8f87-0b721e199f0f


app.get("/user_posts", async (req, res)=>{
  	const { id, viewer_id, offset } = req.query;
  	try {
		const queryResult = await pool.query(sqlStrings.getUserPosts, [viewer_id, id, offset]);
      	res.status(200).send(queryResult.rows);
  	} catch(e) {
      	console.log("get user post error", e);
      	res.status(500).send("db failed");
  	}
})


app.get("/user_profile", async (req, res)=>{
	const { follower_id, username } = req.query;
	try {
		const queryResult = await pool.query(sqlStrings.getUserProfile, [follower_id, username]);
		res.status(200).send(queryResult.rows);
	} catch(e) {
		console.log("get user profile error", e);
		res.status(500).send('Query failed');
	}
})


// ADD USERNAME AND USER PROFILE PICTURE
// get rid of id, probably
// ADD THE NUMBER OF LIKES AND IF THE USER QUERYING HAS ALREADY LIKED IT
app.get("/post", async (req, res) => {
	const { id, viewerId } = req.query;
	try {
		const queryResult = await pool.query(sqlStrings.getPost, [id, viewerId]);
		res.status(200).send(queryResult.rows);
	} catch(e) {
		console.log("get post error", e);
		res.status(500).send();
	}
})


app.post("/comment", async (req, res) => {
	const { authorID, postID, reply, parentCommentID } = req.body;
	try {
		await pool.query(sqlStrings.addComment, [authorID, postID, reply, parentCommentID]);
		res.status(200).send();
	} catch(e) {
		console.log("post comment error", e);
		res.status(500).send("db error on comment add");
	}
})


// maybe add distinct
app.get("/root_comments", async(req, res) => {
	const { post_id, user_id, offset } = req.query; 
	try {
		const queryResult = await pool.query(sqlStrings.getRootComments, [user_id, post_id, offset]);
		res.status(200).send(queryResult.rows);
	} catch(e) {
		console.log("get root comments error", e);
		res.status(500).send("db error getting comments");
	}
});


// if i send text in 500 response, frontend needs to check if response.ok, or parsing breaks
app.get("/comment_replies", async (req, res) => {
	const { comment_id, user_id } = req.query;
	try {
		const queryResponse = await pool.query(sqlStrings.getCommentReplies, [user_id, comment_id]);
		res.status(200).send(queryResponse.rows);
	} catch(e) {
		console.log("get comment replies error", e);
		res.status(500).send();
	}
})


// it will throw an error because of constraints
// rewrite with body and add an action field
app.post("/like_post", async (req, res) => {
	const {id, userId} = req.body;
	try {
		const queryResult = await pool.query(sqlStrings.likePost, [id, userId]);
		res.status(200).send("success");
	} catch(e) {
		console.log("post like post error", e);
		res.status(500).send("failed like deletion");
	}
})


app.delete("/like_post", async (req, res) => {
	const { id, userId } = req.body;
	try {
		const queryResult = await pool.query(sqlStrings.unlikePost, [id, userId]);
		res.status(200).send("success");
	} catch(e) {
		console.log("delete like post error", e);
		res.status(500).send("failed like deletion");
	}
})


app.post("/like_comment", async (req, res) => {
	const {id, userId} = req.body;
	try {
		const queryResult = await pool.query(sqlStrings.likeComment, [id, userId]);
		res.status(200).send("success");
	} catch(e) {
		console.log(e);
		res.status(500).send("failed comment like deletion");
	}
})


app.delete("/like_comment", async (req, res) => {
	const { id, userId } = req.body;
	try {
		const queryResult = await pool.query(sqlStrings.unlikeComment, [id, userId]);
		res.status(200).send("success");
	} catch(e) {
		console.log(e);
		res.status(500).send("failed like deletion");
	}
})


// change to in memory
app.post("/pfp", upload.single("pfp"), async (req, res) => {
	const { id } = req.body;
	const file = req.file;
	if (!file) {res.status(400).send(); return;}  
	const buffer = await fs.promises.readFile(file.path);
	try {
		const queryResult = await pool.query(sqlStrings.addPfp, [buffer, id]);
		res.status(200).send();
	} catch(e) {
		console.log(e);
		res.status(500).send();
	} finally {
		await fs.promises.unlink(file.path)		// this can error btw
	}
})


app.get("/liked_posts", async (req, res)=>{
	const { user_id, offset } = req.query;
	try {
	  	const queryResult = await pool.query(sqlStrings.getLikedPosts, [user_id, offset]);
		res.status(200).send(queryResult.rows);
	} catch(e) {
		console.log("get liked posts error", e);
		res.status(500).send("db failed");
	}
})

///////////////////////////////////////////////////////////////////////////////////////////////
app.get(
	"/subscriptions_posts", 
	validateJwt,
	async (req:RequestProtected, res)=>{
		// const { user_id, offset } = req.query;
		const user_id = req.id;
		const { offset } = req.query
		try {
			const queryResult = await pool.query(sqlStrings.getSubPosts, [user_id, offset]);
			res.status(200).send(queryResult.rows);
		} catch(e) {
			console.log("get subscriptions posts error", e);
			res.status(500).send("db failed");
		}
})


app.get("/subscriptions", async (req, res)=>{
	const { user_id } = req.query;
	try {
	  const queryResult = await pool.query(sqlStrings.getSubscriptions, [user_id]);
		res.status(200).send(queryResult.rows);
	} catch(e) {
		console.log("get subscriptions error", e);
		res.status(500).send("db failed");
	}
})


app.post("/subscription", async (req, res) => {
	const {followedId, authID, isFollowed} = req.body;
	try {
		if (isFollowed) {
			const queryResult = await pool.query(sqlStrings.unsubscribe, [authID, followedId]);
			res.status(200).send("deleted");
		} else {
			const queryResult = await pool.query(sqlStrings.subscribe, [authID, followedId]);
			res.status(200).send("added");
		}
	} catch(e) {
		console.log("post subscriptions error", e);
		res.status(500).send();
	}
})


process.on('exit', () => {
    pool.end();
});


app.listen(3000, ()=>console.log("working"));







