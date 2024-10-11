import express, {Request, Response} from "express"
const cors = require('cors')
const app = express();
app.use(cors());
app.use(express.json());


// added scripts to package.json

app.post("/", (req: Request, res: Response)=>{
    console.log(req.body);
    res.send("resp");
})

/*



login form, register form html and tailwind
api for adding users and jwt
react router setup
redux setup
user profile html
api for querying user data
adding posts
subscriptions
search for users
timeline






















I should probably start with creating data base with 6 tables
then i will make frontend
and will continue with api and all of that



on the server side i should have

login and registration with jwt
data validation, video in watch later
postgres connection



https://chatgpt.com/c/66f87c6f-97cc-8008-833b-03a5a5ff28e0
Final Summary of Tables
users - Stores user information (username, email, password).
posts - Stores user posts (content, user who posted, timestamp).
comments - Stores comments on posts and replies to comments (content, user who commented, parent comment if any, timestamp).
post_likes - Tracks users who like posts.
comment_likes - Tracks users who like comments.
subscriptions - Tracks which users are following others.
By updating the comments table to include a parent_comment_id, you can efficiently manage both comments and their replies without the need for additional tables. This design is scalable and aligns well with relational database best practices.



routes for
user timeline
user and his posts
post and all info




----------------------------------------------------------------
user -                                  done
    id
    name
    password
    profile picture

create table users (
    id serial primary key,
    name varchar(40) unique not null, 
    password_hash varchar(40) not null, 
    pf_pic bytea
);
----------------------------------------------------------------
posts -                                 done
    id
    author
    content - text
    created at

create table posts (
	id serial primary key, 
	author INT REFERENCES users(id) ON DELETE CASCADE not null,
	content text not null,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
----------------------------------------------------------------
comments -                              done
    id
    author
    post - where was commented
    content
    parent comment - may be null
    created at

create table comments (
	id serial primary key, 
	author_id INT REFERENCES users(id) ON DELETE CASCADE not null,
	post_id int references posts(id) on delete cascade not null,
	content text not null,
	parent_comment_id INT REFERENCES comments(id) ON DELETE CASCADE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
----------------------------------------------------------------
post_like -                             done
    id
    user
    post
        ==============
        unique keyword
        ==============

create table post_like (
	id serial primary key, 
	post_id int references posts(id) on delete cascade not null,
	user_id int references users(id) on delete cascade not null,
	CONSTRAINT unique_post_like UNIQUE (post_id, user_id)
);
----------------------------------------------------------------
comment_like - 
    id
    user
    post
    created at

create table comment_like (
	id serial primary key, 
	comment_id int references comments(id) on delete cascade not null,
	user_id int references users(id) on delete cascade not null,
	CONSTRAINT unique_comment_like UNIQUE (comment_id, user_id)
);
----------------------------------------------------------------
subscriptions -                         done
    id
    follower
    followed

create table subscriptions (
	id serial primary key, 
	followed_id int references users(id) on delete cascade not null,
	follower_id int references users(id) on delete cascade not null,
	CONSTRAINT unique_subscription UNIQUE (followed_id, follower_id)
);
----------------------------------------------------------------
posts_images -
    id
    post
    image data

create table post_image (
	id serial primary key, 
	post_id int references posts(id) on delete cascade not null,
	image bytea not null
);
----------------------------------------------------------------





----------------------------------------------------------------
ALTER TABLE post_like
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE comment_like
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
----------------------------------------------------------------











fetch(): This fetches the image as binary data from the server.

response.blob() converts the response to a Blob.
URL.createObjectURL(blob): This creates a temporary URL for the Blob in the browser's memory. You can use this URL directly as the src of an image.

URL.revokeObjectURL(): When the component unmounts, we clean up the Blob URL using URL.revokeObjectURL(). This ensures that memory is released once the Blob URL is no longer needed.
*/


app.listen(3000, ()=>console.log("working"));