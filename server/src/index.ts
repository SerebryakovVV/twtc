import express, {Request, Response, NextFunction} from "express"
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken';
import cors from 'cors';
import pg from 'pg';
import { body, validationResult } from 'express-validator'
import fs from 'fs';
import multer from 'multer';


const upload = multer({ dest: 'uploads/' });

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




// ADD JWT
// ADD LOGIN AFTER REGISTRATION AND REDIRECT 
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
					// console.log("wrong password");
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
                "secret", // JWT SECRET
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
})



// multer and images https://chatgpt.com/c/67422857-082c-8008-8782-0c68431e4d7a
// change to async file read
// change to for ... of ... loop https://chatgpt.com/c/674230a0-71d4-8008-acd5-f4bd0e2721ad
app.post("/post", upload.array('images'), async (req, res)=>{
	// validation here
    const { text, authorID } = req.body;
	let images: Express.Multer.File[] = [];
	let bufferArray: Buffer[] = [];
	// console.log(req.files);
	
	if (req.files && req.files.length !== 0) {
		images = req.files as Express.Multer.File[];
		for (const image of images) {
            const buffer = await fs.promises.readFile(image.path);
            bufferArray.push(buffer);
        }
	}
	const client = await pool.connect();
	// console.log(bufferArray);
	// console.log(bufferArray.entries());
	try {
		await client.query("BEGIN");
		const postInsertResult = await client.query("INSERT INTO posts (author_id, content) values ($1, $2) RETURNING id", [authorID, text]);
		const postID = postInsertResult.rows[0].id;
		if (bufferArray.length !== 0) {
			for (const [index, image] of bufferArray.entries()) {
				await client.query("INSERT INTO post_image (post_id, image, position) values ($1, $2, $3)", [postID, image, index]);
			}
		}
		await client.query("COMMIT");
	} catch(e) {
		console.log(e);
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
		await client.release();
	}   
})
// https://chatgpt.com/c/6733afd6-4cd8-8008-8f87-0b721e199f0f







// subscription posts
// liked posts








// images get duplicated, rewrite counting of likes and comments as subqueries

app.get("/user_posts", async (req, res)=>{
  	const { id, viewer_id } = req.query;
	// console.log(id, viewer_id);
  	try {
		const queryResult = await pool.query(
			`SELECT
				posts.id,
				posts.content,
				posts.created_at,
				(SELECT COUNT(id) FROM comments WHERE comments.post_id = posts.id) as comments_count,
				(SELECT COUNT(id) FROM post_like WHERE post_like.post_id = posts.id) as likes_count,
				EXISTS (
					SELECT 1 
					FROM post_like 
					WHERE post_like.post_id = posts.id 
					AND post_like.user_id = $1
				) AS liked_by_user,
				COALESCE(
					JSON_AGG(
						JSON_BUILD_OBJECT(
							'image_id', post_image.id,
							'image', post_image.image,
							'position', post_image.position
						) ORDER BY post_image.position
					) FILTER (WHERE post_image.id IS NOT NULL)
				, '[]'
				) AS images
			FROM
				posts
			LEFT JOIN
				post_image ON posts.id = post_image.post_id
			WHERE
				posts.author_id = $2
			GROUP BY
				posts.id,
				posts.content,
				posts.created_at
			ORDER BY
				posts.created_at desc`, 
			[viewer_id, id]);

		// console.log(queryResult.rows);
      	res.status(200).send(queryResult.rows);
  	} catch(e) {
      	console.log(e);
      	res.status(500).send("db failed");
  	}
})


app.get("/user_profile", async (req, res)=>{
	const { follower_id, username } = req.query;
	try {
		const queryResult = await pool.query(
			`SELECT 
				users.id, 
				users.pf_pic,
				COUNT(DISTINCT posts.id) as post_count,
				COUNT(DISTINCT subscriptions.id) as sub_count,
				EXISTS(
					SELECT 1 FROM subscriptions where follower_id = $1 and followed_id = users.id
				) as is_following
			FROM 
				users 
			LEFT JOIN 
				posts on users.id = posts.author_id
			LEFT JOIN
				subscriptions on users.id = subscriptions.followed_id
			WHERE users.name = $2
			GROUP BY users.id;`
		, [follower_id, username]);
		res.status(200).send(queryResult.rows);
	} catch(e) {
		console.log(e);
		res.status(500).send('Query failed');
	}
})





// ADD USERNAME AND USER PROFILE PICTURE
// get rid of id, probably
// ADD THE NUMBER OF LIKES AND IF THE USER QUERYING HAS ALREADY LIKED IT
app.get("/post", async (req, res) => {
	const { id, viewerId } = req.query;
 	// console.log(id);
	try {
		const queryResult = await pool.query(
			`SELECT 
				author_id, 
				content, 
				created_at, 
				users.name,
				users.pf_pic,
				EXISTS (
					SELECT 1 
					FROM post_like 
					WHERE post_like.post_id = posts.id 
					AND post_like.user_id = $2
				) AS liked_by_user,
				(SELECT COUNT(id) FROM post_like WHERE post_like.post_id = posts.id) as likes_count,
				coalesce(
					json_agg(
						json_build_object(
							'id', post_image.id,
							'image', image
						) ORDER BY position
					) FILTER(WHERE post_image.id IS NOT NULL), '[]'
				) as images
			FROM 
				posts 
			LEFT JOIN 
				post_image
			ON post_image.post_id = posts.id
			LEFT JOIN 
				users
			ON users.id = author_id
			WHERE 
				posts.id = $1
			GROUP BY
				author_id,
				content,
				created_at,
				users.name,
				users.pf_pic,
				posts.id`
				, [id, viewerId]);

		// old one
		// const queryResult = await pool.query(
		// 	`SELECT 
		// 		author_id, 
		// 		content, 
		// 		created_at, 
		// 		users.name,
		// 		users.pf_pic,
		// 		coalesce(
		// 			json_agg(
		// 				json_build_object(
		// 					'id', post_image.id,
		// 					'image', image
		// 				) ORDER BY position
		// 			) FILTER(WHERE post_image.id IS NOT NULL), '[]'
		// 		) as images
		// 	FROM 
		// 		posts 
		// 	LEFT JOIN 
		// 		post_image
		// 	ON post_image.post_id = posts.id
		// 	LEFT JOIN 
		// 		users
		// 	ON users.id = author_id
		// 	WHERE 
		// 		posts.id = $1
		// 	GROUP BY
		// 		author_id,
		// 		content,
		// 		created_at,
		// 		users.name,
		// 		users.pf_pic
		// 	`
		// , [id]);
		// old one



		console.log("===here===")
		console.log(queryResult.rows);
		console.log("===here===")
		res.status(200).send(queryResult.rows);
	} catch(e) {
		console.log(e);
		res.status(500).send();
	}
})










app.post("/comment", async (req, res) => {
	const { authorID, postID, reply, parentCommentID } = req.body;
  	// console.log(authorID, postID, reply, parentCommentID);
	try {
		await pool.query("INSERT INTO comments (author_id, post_id, content, parent_comment_id) values ($1, $2, $3, $4)", [authorID, postID, reply, parentCommentID]);
		res.status(200).send();
	} catch(e) {
		console.log(e);
		res.status(500).send("db error on comment add");
	}
})

// this needs to return the root comments so i should add ...and parent_comment_id = null
app.get("/comments", async(req, res) => {
	const { post_id } = req.query; // this is get, retard
	try {
		const queryResult = await pool.query(
			`SELECT 
				comments.id,
				comments.content,
				comments.created_at,
				users.name,
				users.pf_pic
			FROM
				comments
			LEFT JOIN
				users
			ON comments.author_id = users.id
			WHERE
				post_id = $1;`
		, [post_id]);
		// console.log(queryResult.rows);
		res.status(200).send(queryResult.rows);

	} catch(e) {
		console.log(e);
		res.status(500).send("db error getting comments");
	}
});




app.get("/comment_replies", async (req, res) => {
	const { comment_id} = req.query;
	try {
		// const queryResponse = await pool.query();
	} catch(e) {
		console.log(e);
		res.status(500).send();
	}
})





app.get("/user", async (req, res) => {

});


// it will throw an error because of constraints
// rewrite with body and add an action field
app.post("/like_post", async (req, res) => {
	const {id, userId} = req.body;
	try {
		const queryResult = await pool.query("INSERT INTO post_like (post_id, user_id) values ($1, $2)", [id, userId]);
		// console.log("like added");
		res.status(200).send("success");
	} catch(e) {
		console.log(e);
		res.status(500).send("failed like deletion");
	}
})


app.delete("/like_post", async (req, res) => {
	const { id, userId } = req.body;
	try {
		const queryResult = await pool.query("DELETE FROM post_like WHERE post_id = $1 AND user_id = $2", [id, userId]);
		// console.log("like deleted");
		res.status(200).send("success");
	} catch(e) {
		console.log(e);
		res.status(500).send("failed like deletion");
	}
})





app.post("/subscription", async (req, res) => {
	const {followedId, authID, isFollowed} = req.body;
	// console.log(followedId, authID, isFollowed);
	try {
		if (isFollowed) {
			const queryResult = await pool.query("DELETE FROM subscriptions WHERE follower_id = $1 AND followed_id = $2", [authID, followedId]);
			res.status(200).send("deleted");
			return;
		} else {
			const queryResult = await pool.query("INSERT INTO subscriptions (follower_id, followed_id) values ($1, $2)", [authID, followedId]);
			res.status(200).send("added");
			return;
		}
	} catch(e) {
		console.log(e);
		res.status(500).send();
	}
})









app.post("/like_comment", async (req, res) => {
	const {comment_id, user_id} = req.body;
	try {
		const queryResult = await pool.query("INSERT INTO comment_like (comment_id, user_id) values ($1, $2)", [comment_id, user_id]);
		res.send()
	} catch(e) {
		res.send()
	}

})





app.post("/pfp", upload.single("pfp"), async (req, res) => {
	const { id } = req.body;
	const file = req.file;
	if (!file) {res.status(400).send(); return;}  
	const buffer = await fs.promises.readFile(file.path);
	try {
		const queryResult = await pool.query("UPDATE users SET pf_pic = $1 WHERE id = $2", [buffer, id]);
		console.log("pfp added")
		res.status(200).send();
	} catch(e) {
		console.log(e);
		res.status(500).send();
	} finally {
		// this can error btw
		await fs.promises.unlink(file.path)
	}
})





process.on('exit', () => {
    pool.end();
});

app.listen(3000, ()=>console.log("working"));







