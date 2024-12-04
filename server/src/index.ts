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
	console.log(req.files);
	
	if (req.files && req.files.length !== 0) {
		images = req.files as Express.Multer.File[];
		for (const image of images) {
            const buffer = await fs.promises.readFile(image.path);
            bufferArray.push(buffer);
        }
	}
	const client = await pool.connect();
	console.log(bufferArray);
	console.log(bufferArray.entries());
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




// added second s to the postss
// all posts from a user
// one query
// https://chatgpt.com/c/674237cc-6d40-8008-ac63-bfdd762aa6dd




// gpt prompt
// i have two tables, the first one is "posts" with columns "id", "author_id", "content", "created_at". the second one is "post_image" with columns "id", "post_id", "image" - bytes, "position". i have the username and need to get id of the user with that username to then get all his posts and all the images to each post. write an endpoint for this in expess, pg, postgres

// EVEN HARDER SQL STUFF https://chatgpt.com/c/6748c4f2-52a0-8008-ab0a-718ba6fc6b02
// WILL USE BASE64 EVEN THOUGH IT SUCKS, WOULD NEED TO RESTRICT UPLOAD TO ONLY PNG'S

// GET THE USERNAME FROM REQUEST
// GET THE ID FROM THE USERNAME
//
// optimise into one query
// https://chatgpt.com/c/67422390-9e14-8008-a106-49e6cef8289d
app.get("/posts", async (req, res)=>{
  	const username = req.query.username;
  	console.log(username);
  	const client = await pool.connect();
  	try {

    	// const idFromUsernameQueryResult = await client.query("SELECT id FROM users WHERE name = $1", [username]);
      	// const postsQueryResult = await client.query("SELECT * FROM posts WHERE author_id = $1", [idFromUsernameQueryResult.rows[0].id]);

		// GETTING IMAGES
		// client.query(`
		// 	SELECT
		// 		p.id AS post_id,
		// 		p.text AS post_text,
		// 		p.author_id,
		// 		array_agg(
		// 			json_build_object(
		// 				'position', pi.position,
		// 				'image', encode(pi.image, 'base64')  -- Convert bytea image to base64 string for display
		// 			)
		// 		) AS images
		// 	FROM
		// 		posts p
		// 	LEFT JOIN
		// 		post_image pi ON p.id = pi.post_id
		// 	WHERE
		// 		p.author_id = $1  -- Use $1 as a placeholder for the author's ID in parameterized queries
		// 	GROUP BY
		// 		p.id, p.text, p.author_id;	
		// `);

		// ADD ENCODING!!!!!!!!!!!
		const queryResult = await client.query(`
			SELECT 
			u.id AS user_id,
			p.id AS post_id,
			p.content,
			p.created_at,
			COALESCE(
				JSON_AGG(
				JSON_BUILD_OBJECT(
					'image_id', pi.id,
					'image', encode(pi.image, 'base64'),
					'position', pi.position
				)
				ORDER BY pi.position ASC
				) FILTER (WHERE pi.id IS NOT NULL),
				'[]'
			) AS images
			FROM users u
			LEFT JOIN posts p ON u.id = p.author_id
			LEFT JOIN post_image pi ON p.id = pi.post_id
			WHERE u.name = $1
			GROUP BY u.id, p.id, p.content, p.created_at
			ORDER BY p.created_at DESC;
		`, [username]);


      console.log(queryResult.rows);

      	// res.status(200).send(postsQueryResult.rows);
      	res.status(200).send(queryResult.rows);
      	// res.status(200).send("good");
  	} catch(e) {
      	console.log(e);
      	res.status(500).send("db failed");
  	} finally {
    	  client.release();
  	}
})





app.post("/comment", async(req, res) => {
	const { authorID, postID, text, parentCommentID } = req.body;
	// author id and all of that stuff
	// const client = await pool.connect();

  	console.log('comm');

	// try {
	// 	await client.query("INSERT INTO comments (author_id, post_id, content, parent_comment_id) values ($1, $2, $3, $4)", [authorID, postID, text, parentCommentID]);
	// } catch(e) {
	// 	console.log(e);
	// 	res.status(500).send("db error on comment add");
	// } finally {
	// 	client.release();
	// }
  	res.status(500).send("db error on comment add");
})


app.get("/comments", async(req, res) => {
	
	const { id } = req.body;
	const client = await pool.connect(); 

	try {
		client.query("SELECT * FROM comments WHERE post_id = $1", [id]);
		// select all rows from post_comment with given post id
		// then group them so there is a list of root comment and replies to them
	} catch(e) {
		console.log(e);
		res.status(500).send("db error getting comment");
	} finally {
		client.release();
	}


});



process.on('exit', () => {
    pool.end();
});

app.listen(3000, ()=>console.log("working"));




	

    
    // https://chatgpt.com/c/673cf29a-7588-8008-bf38-f567e37ad2be
    // USE MULTER INSTEAD OF TRYING TO WRITE THIS RETARDED GARBAGE
    // https://chatgpt.com/c/673cf29a-7588-8008-bf38-f567e37ad2be


    




    {/*
        Access the Uploaded File in Code Multer provides metadata about the uploaded file in req.file (for single-file uploads) or req.files (for multiple files). Here's an example of what req.file contains:

{
  "fieldname": "image",
  "originalname": "example.jpg",
  "encoding": "7bit",
  "mimetype": "image/jpeg",
  "destination": "uploads/",
  "filename": "29f40c91b98b1341",
  "path": "uploads/29f40c91b98b1341",
  "size": 102394
}
        */}



{/*

app.get('/post/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT image FROM posts WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const imageBuffer = result.rows[0].image;

    // Set appropriate headers for the image and send it
    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': imageBuffer.length,
    });
    res.end(imageBuffer);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


*/}






{/*
    app.get('/post/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT image FROM posts WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const imageBuffer = result.rows[0].image;

    // Set appropriate headers for the image and send it
    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': imageBuffer.length,
    });
    res.end(imageBuffer);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
    */}

{/*
    
    
    
const express = require("express");
const { Pool } = require("pg");

const app = express();
const pool = new Pool({
  user: "your_db_user",
  host: "localhost",
  database: "your_db_name",
  password: "your_db_password",
  port: 5432,
});

// Route to fetch an image by ID
app.get("/images/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the image data from the database
    const result = await pool.query("SELECT image FROM posts WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).send("Image not found");
    }

    const imageBuffer = result.rows[0].image;

    // Set appropriate headers and send the image data
    res.set("Content-Type", "image/jpeg"); // Adjust Content-Type based on your stored images
    res.send(imageBuffer);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send("Server error");
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});









import React, { useEffect, useState } from "react";

const ImageDisplay = ({ imageId }) => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`http://localhost:5000/images/${imageId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }

        // Convert the binary data to a Blob and create an object URL
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, [imageId]);

  return (
    <div>
      {imageSrc ? (
        <img src={imageSrc} alt="Fetched from server" style={{ width: "300px" }} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ImageDisplay;











app.get("/images", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, image FROM posts");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).send("Server error");
  }
});











import React, { useEffect, useState } from "react";

const ImageGallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("http://localhost:5000/images");
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }

        const data = await response.json();

        // Map over each image row to convert binary to object URLs
        const imageUrls = data.map((row) => ({
          id: row.id,
          src: URL.createObjectURL(new Blob([row.image])),
        }));

        setImages(imageUrls);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      {images.length > 0 ? (
        images.map((image) => (
          <img
            key={image.id}
            src={image.src}
            alt={`Image ${image.id}`}
            style={{ width: "300px", margin: "10px" }}
          />
        ))
      ) : (
        <p>Loading images...</p>
      )}
    </div>
  );
};

export default ImageGallery;









*/}

























// ADDING FIELDS TO THE TYPES
// https://chatgpt.com/c/671401fb-7b5c-8008-b457-3db97d2ac1e6
// declare global {
//     namespace Express {
//         interface Request {
//             user?: string | JwtPayload; 
//         }
//     }
// }
// https://chatgpt.com/c/6744d1db-6074-8008-839c-e71e4574650b
// declare global {
// 	namespace Express {
//     	interface Request {
//     		file?: Express.Multer.File; // For single file uploads
//       		files?: Express.Multer.File[]; // For multiple file uploads
//     	}
//   	}
// }


// CSRF 
// https://chatgpt.com/c/6716b463-6b7c-8008-adf1-91ed234e43f8


// AUTH MIDDLEWARE
{/*
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
*/}


// QUERIES TO DO
/*
// user search
client.query("select * from users where name = $1", []);
// user posts on the profile page
// queryString +=  " ORDER BY id LIMIT 10 OFFSET " + (page-1)*10;
client.query("select * from posts where author_id = $1", []);
// user liked posts page
// get likes of the user
client.query("select * from post_like where user_id = $1", [])
// get posts from those likes
client.query("select * from posts where id = $1", []) // = post_id
// user subscriptions
client.query("select * from subscriptions where follower_id = $1", [])
client.query("select * from users where id = $1", [])
// new comment like 
client.query("insert into comment_like () values", [])
// new post like 
client.query("insert into post_like () values", [])
// new comment
client.query("insert into comments", [])
// new post
client.query("insert into posts", [])
// user feed
client.query("select * from posts where ", [])
*/