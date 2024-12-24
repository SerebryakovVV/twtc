import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from 'react-router-dom'
import { RootState } from "../store"
import ProfileHeader from "./ProfileHeader"
import NewPost from "./NewPost"
import FeedPost from './FeedPost.tsx'
import { imgResToObjUrl } from "../utils.ts"


type profilePageError = "User doesn't exist" | "Something went wrong";


export default function Profile() {
    const reduxUsername = useSelector((state: RootState) => state.auth.username);
    const { queryUsername } = useParams();
    const [posts, setPosts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<profilePageError | null>(null);
    const [pfp, setPfp] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null)
    const [subCount, setSubCount] = useState<number | null>(null);
    const [postCount, setPostCount] = useState<number | null>(null);

    useEffect(()=>{

        const getPosts = async (id) => {
            try {
                const queryResult = await fetch(`http://localhost:3000/posts?id=${id}`);
                if (!queryResult.ok) throw new Error("Error fetching the posts");
                const queryResultJson = await queryResult.json();
                if (queryResultJson.length === 0) {
                    // exit the function, state would be empty, conditional rendering will handle
                    // or map will just pass
                }
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
                const queryResult = await fetch("http://localhost:3000/user_profile?username=" + queryUsername);
                if (!queryResult.ok) throw new Error("Query failed");
                const queryResultJson = await queryResult.json();
                if (queryResultJson.length === 0) {
                    setError("User doesn't exist");
                } else {
                    setUserId(queryResultJson[0].id);
                    setSubCount(queryResultJson[0].sub_count);
                    setPostCount(queryResultJson[0].post_count);
                    // will need to check this, for now - no profile pics; can be wrong field
                    setPfp(queryResultJson[0].pf_pic && imgResToObjUrl(queryResultJson[0].pf_pic.data))
                    getPosts(queryResultJson[0].id);
                }
            } catch(e) {
                console.log(e);
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
                pfp={pfp} 
                username={queryUsername} 
                subCount={subCount}
                postCount={postCount} 
            />
        {reduxUsername === queryUsername ? <NewPost/> : null}
        {
         posts.map((p)=>{
            return(<FeedPost 
                        id={p.post_id}
                        username={queryUsername as string}
                        timestamp={p.created_at}
                        text={p.content}
                        images={p.images}
                        likesNum={10}
                        commentsNum={12}
                    />)})
                    }
        </div>
    );
}