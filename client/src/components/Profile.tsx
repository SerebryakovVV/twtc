import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from 'react-router-dom'
import { RootState } from "../store"
import ProfileHeader from "./ProfileHeader"
import NewPost from "./NewPost"
import FeedPost from './FeedPost.tsx'
import { imgResToObjUrl } from "../utils.ts"


// IF NO USER FOUND ADD HANDLING


type profilePageError = "User doesn't exist" | "Something went wrong";


export default function Profile() {
    const reduxUsername = useSelector((state: RootState) => state.auth.username);
    const reduxId = useSelector((state: RootState) => state.auth.id);
    const { queryUsername } = useParams();
    const [posts, setPosts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<profilePageError | null>(null);
    const [pfp, setPfp] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null)
    const [subCount, setSubCount] = useState<number | null>(null);
    const [postCount, setPostCount] = useState<number | null>(null);
    const [isFollowing, setIsFollowing] = useState<boolean>();

    useEffect(()=>{

        const getPosts = async (id) => {
            try {
                // ALL OF THAT SHOULD BE REWRITTEN WITH QUERY RETURNING ONE ID AND AN ARRAY OF POSTS, BUT FIRST THE GETUSER QUERY
                const queryResult = await fetch("http://localhost:3000/user_posts?id=" + id + "&viewer_id=" + reduxId);
                if (!queryResult.ok) throw new Error("Error fetching the posts");
                const queryResultJson = await queryResult.json();
                if (queryResultJson.length === 0) {
                    // exit the function, state would be empty, conditional rendering will handle
                    // or map will just pass
                }
                // PROBABLY DONT EVEN NEED TO REWRITE STUFF, IT STILL RETURNS AN ARRAY
                setPosts(queryResultJson);
                console.log(queryResultJson);
            } catch(e) {
                console.log(e);
                // different error state for posts
                // setError("Something went wrong");
            }
        }

        const getUser = async () => {
            try {
                const queryResult = await fetch("http://localhost:3000/user_profile?username=" + queryUsername + "&follower_id=" + reduxId);
                if (!queryResult.ok) throw new Error("Query failed");
                const queryResultJson = await queryResult.json();
                console.log("user:", queryResultJson);
                if (queryResultJson.length === 0) {
                    // add it to the ui
                    setError("User doesn't exist");
                } else {
                    console.log(queryResultJson)
                    setUserId(queryResultJson[0].id);
                    setSubCount(queryResultJson[0].sub_count);
                    setPostCount(queryResultJson[0].post_count);
                    // will need to check this, for now - no profile pics; can be wrong field
                    setPfp(queryResultJson[0].pf_pic && imgResToObjUrl(queryResultJson[0].pf_pic.data));
                    setIsFollowing(queryResultJson[0].is_following)
                    getPosts(queryResultJson[0].id);
                }
            } catch(e) {
                console.log(e);
                // add it to the ui
                setError("Something went wrong");
            }
        }
        getUser();
        // return imageObjects.forEach(i => URL.revokeObjectURL(i));
    }, [queryUsername])



    


    // NEED TO REWRITE THE SQL QUERY SO IT WOULD SEND ID ONE TIME
    // ALSO IT SHOUD SEND EMPTY ARRAY IF NO POSTS
    // https://chatgpt.com/c/67672196-8308-8008-991f-1d5b291ab3b6
    // i probably don't need to send id, will write separate endpoint for feed page and for profile page, the navigation already uses username only
    // so i send request with id and get back only array of post, either empty or not

    return(
        <div className="">
            <ProfileHeader 
                followedId={userId}
                isFollowing={isFollowing}
                pfp={pfp} 
                username={queryUsername} 
                subCount={Number(subCount)}
                postCount={postCount} 
            />
        {reduxUsername === queryUsername ? <NewPost/> : null}
        
        {posts.map((p)=>{
            return(<FeedPost 
                        pfp={pfp}
                        key={p.id}
                        id={p.id}
                        username={queryUsername as string}
                        timestamp={p.created_at}
                        text={p.content}
                        images={p.images}
                        likesNum={Number(p.likes_count)}
                        commentsNum={Number(p.comments_count)}
                        isLikedByUser={p.liked_by_user}
        />)})}
        </div>
    );
}