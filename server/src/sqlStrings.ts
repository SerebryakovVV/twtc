export const getUser = `SELECT id, name, password_hash FROM users WHERE name = $1`;


export const checkUserExists = `SELECT 1 FROM users WHERE name = $1`;


export const addUser = `INSERT INTO users (name, password_hash) VALUES ($1, $2)`;


export const addPostBase = `INSERT INTO posts (author_id, content) VALUES ($1, $2) RETURNING id`;


export const addPostImg = `INSERT INTO post_image (post_id, image, position) VALUES ($1, $2, $3)`;


export const getUserPosts = 
    `SELECT 
        posts.id,
		posts.content,
		posts.created_at,
		(SELECT COUNT(id) FROM comments WHERE comments.post_id = posts.id) AS comments_count,
		(SELECT COUNT(id) FROM post_like WHERE post_like.post_id = posts.id) AS likes_count,
		EXISTS(SELECT 1 FROM post_like WHERE post_like.post_id = posts.id AND post_like.user_id = $1) AS liked_by_user,
		COALESCE(
			JSON_AGG(
				JSON_BUILD_OBJECT(
					'image_id', post_image.id,
					'image', post_image.image,
					'position', post_image.position
				) ORDER BY post_image.position
			) FILTER (WHERE post_image.id IS NOT NULL)
		, '[]') AS images
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
        posts.created_at DESC		
	LIMIT 10
    OFFSET $3`;


export const getUserProfile = 
    `SELECT 
		users.id, 
		users.pf_pic,
		COUNT(DISTINCT posts.id) AS post_count,
		COUNT(DISTINCT subscriptions.id) AS sub_count,
		EXISTS(SELECT 1 FROM subscriptions where follower_id = $1 and followed_id = users.id) AS is_following
	FROM 
		users 
	LEFT JOIN 
		posts ON users.id = posts.author_id
	LEFT JOIN
		subscriptions ON users.id = subscriptions.followed_id
	WHERE 
        users.name = $2
	GROUP BY 
        users.id`;


export const getPost = 
    `SELECT 
        author_id, 
        content, 
        created_at, 
        users.name,
        users.pf_pic,
        EXISTS(SELECT 1 FROM post_like WHERE post_like.post_id = posts.id AND post_like.user_id = $2) AS liked_by_user,
        (SELECT COUNT(id) FROM post_like WHERE post_like.post_id = posts.id) as likes_count,
        coalesce(
            json_agg(
                json_build_object(
                    'image_id', post_image.id,
                    'image', image
                ) ORDER BY position
            ) FILTER(WHERE post_image.id IS NOT NULL), '[]'
        ) as images
    FROM 
        posts 
    LEFT JOIN 
        post_image ON post_image.post_id = posts.id
    LEFT JOIN 
        users ON users.id = author_id
    WHERE 
        posts.id = $1
    GROUP BY
        author_id,
        content,
        created_at,
        users.name,
        users.pf_pic,
        posts.id`;


export const addComment = `INSERT INTO comments (author_id, post_id, content, parent_comment_id) VALUES ($1, $2, $3, $4)`;


export const getRootComments = 
    `SELECT 
        users.name,
        users.pf_pic,
        comments.id, 
        comments.created_at,
        comments.content,
        (SELECT COUNT(*) FROM comments c WHERE c.parent_comment_id = comments.id) AS reply_num,
        (EXISTS(SELECT 1 FROM comment_like cl WHERE cl.comment_id = comments.id AND cl.user_id = $1)) AS liked_by_user,
        COUNT(comment_like.id) as likes_num
    FROM 
        comments 
    JOIN 
        posts ON comments.post_id = posts.id
    JOIN 
        users ON users.id = comments.author_id
    LEFT JOIN 
        comment_like ON comment_like.comment_id = comments.id
    WHERE 
        posts.id = $2 AND comments.parent_comment_id IS NULL
    GROUP BY 
        users.name,
        users.pf_pic,
        comments.id, 
        comments.created_at,
        comments.content
    ORDER BY 
        comments.created_at DESC
    LIMIT 10 
    OFFSET $3`;


export const getCommentReplies =
    `SELECT 
	    users.name,
	    users.pf_pic,
	    comments.id, 
	    comments.created_at,
	    comments.content,
	    (EXISTS(SELECT 1 FROM comment_like cl WHERE cl.comment_id = comments.id AND cl.user_id = $1)) AS liked_by_user,
	    COUNT(comment_like.id) AS likes_num
    FROM 
        comments 
    JOIN 
        users ON comments.author_id = users.id
    LEFT JOIN 
        comment_like ON comment_like.comment_id = comments.id
    WHERE 
        comments.parent_comment_id = $2
    GROUP BY
	    users.name,
	    users.pf_pic,
	    comments.id, 
	    comments.created_at,
	    comments.content
	ORDER BY 
        comments.created_at`;


export const likePost = `INSERT INTO post_like (post_id, user_id) values ($1, $2)`;


export const unlikePost = `DELETE FROM post_like WHERE post_id = $1 AND user_id = $2`;


export const likeComment = `INSERT INTO comment_like (comment_id, user_id) values ($1, $2)`;


export const unlikeComment = `DELETE FROM comment_like WHERE comment_id = $1 AND user_id = $2`


export const addPfp = `UPDATE users SET pf_pic = $1 WHERE id = $2`;


export const getLikedPosts = 
    `SELECT
	    users.name, 
        users.pf_pic,
        posts.id,
        posts.content,
        posts.created_at,
        (SELECT COUNT(id) FROM comments WHERE comments.post_id = posts.id) as comments_count,
        (SELECT COUNT(id) FROM post_like WHERE post_like.post_id = posts.id) as likes_count,
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
	JOIN 
        users on posts.author_id = users.id
	JOIN 
		post_like ON posts.id = post_like.post_id 
	LEFT JOIN 
		post_image ON posts.id = post_image.post_id
	WHERE 
		post_like.user_id = $1
	GROUP BY
		posts.id,
	    posts.content,
		posts.created_at, 
        users.name, 
        users.pf_pic
	ORDER BY
		posts.created_at desc
	LIMIT 10 
    OFFSET $2`;


export const getSubPosts = 
    `SELECT 
        users.name, 
        users.pf_pic,
        posts.id,
        posts.content,
        posts.created_at,
        (SELECT COUNT(id) FROM comments WHERE comments.post_id = posts.id) as comments_count,
        (SELECT COUNT(id) FROM post_like WHERE post_like.post_id = posts.id) as likes_count,
        COALESCE(
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'image_id', post_image.id,
                    'image', post_image.image,
                    'position', post_image.position
                ) ORDER BY post_image.position
            ) FILTER (WHERE post_image.id IS NOT NULL)
        , '[]'
        ) AS images,
        (EXISTS(SELECT 1 FROM post_like pl WHERE pl.post_id = posts.id AND pl.user_id = $1)) AS liked_by_user
	FROM
		posts 
	JOIN 
        users on posts.author_id = users.id
	JOIN 
		subscriptions ON posts.author_id = subscriptions.followed_id 
	LEFT JOIN 
		post_image ON posts.id = post_image.post_id
	WHERE 
		subscriptions.follower_id = $1
	GROUP BY
		posts.id,
		posts.content,
		posts.created_at, 
        users.name, 
        users.pf_pic
	ORDER BY
		posts.created_at desc  
	LIMIT 10 
    OFFSET $2`;


export const getSubscriptions = 
    `SELECT 
        users.name, 
        users.pf_pic, 
        users.id
    FROM 
        subscriptions 
    JOIN 
        users ON subscriptions.followed_id = users.id 
    WHERE 
        subscriptions.follower_id = $1 
    ORDER BY 
        users.name`;


export const unsubscribe = `DELETE FROM subscriptions WHERE follower_id = $1 AND followed_id = $2`;


export const subscribe = `INSERT INTO subscriptions (follower_id, followed_id) values ($1, $2)`;













