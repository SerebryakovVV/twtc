import { useEffect, useState, useRef } from "react"
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
    const [error, setError] = useState<profilePageError | null>(null);
    const [pfp, setPfp] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null)
    const [subCount, setSubCount] = useState<number | null>(null);
    const [postCount, setPostCount] = useState<number | null>(null);
    const [isFollowing, setIsFollowing] = useState<boolean>();
    
    ////
    const [headerIsLoaded, setHeaderIsLoaded] = useState<boolean>(false);
    const [offset, setOffset] = useState(0); 
    const offsetRef = useRef(offset); 
    const postsAreLeftRef = useRef(true);
    const loadingRef = useRef(false);
    const initilPostsLoadedRef = useRef(false);
    const userIdRef = useRef(userId);

    useEffect(()=>{
        offsetRef.current = offset;
    }, [offset])

    useEffect(()=>{
        userIdRef.current = userId;
    }, [userId])

    const getNextPosts = async () => {
        try {
            loadingRef.current = true;
            console.log(userIdRef.current, reduxId, offsetRef.current);
            const queryResult = await fetch("http://localhost:3000/user_posts?id=" + userIdRef.current + "&viewer_id=" + reduxId + "&offset=" + offsetRef.current);
            if (!queryResult.ok) throw new Error("Error fetching the posts");
            const queryResultJson = await queryResult.json();
            if (queryResultJson.length == 0) postsAreLeftRef.current = false;
            setPosts((p)=>[...p, ...queryResultJson]);
            setOffset((o)=>o+10)
            console.log(queryResultJson);
        } catch(e) {
            console.log(e);
        } finally {
            loadingRef.current = false;
        }
    }

    const scrollHandler = () => {
        const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
        if (scrollTop + clientHeight > scrollHeight - 50 && postsAreLeftRef.current && !loadingRef.current) {
            getNextPosts();
        }
    }

    useEffect(()=>{
        if (!userId) return;
        document.addEventListener("scroll", scrollHandler);
        if (!initilPostsLoadedRef.current) {
            getNextPosts();
            initilPostsLoadedRef.current = true;
        }
        return () => document.removeEventListener("scroll", scrollHandler);
    }, [userId])


    useEffect(()=>{
        const getUser = async () => {
            try {
                const queryResult = await fetch("http://localhost:3000/user_profile?username=" + queryUsername + "&follower_id=" + reduxId);
                if (!queryResult.ok) throw new Error("Query failed");
                const queryResultJson = await queryResult.json();
                console.log("user:", queryResultJson);
                if (queryResultJson.length === 0) {
                    setError("User doesn't exist");
                } else {
                    console.log(queryResultJson)
                    setUserId(queryResultJson[0].id);
                    setSubCount(queryResultJson[0].sub_count);
                    setPostCount(queryResultJson[0].post_count);
                    setPfp(queryResultJson[0].pf_pic && imgResToObjUrl(queryResultJson[0].pf_pic.data));
                    setIsFollowing(queryResultJson[0].is_following)
                }
            } catch(e) {
                console.log(e);
                setError("Something went wrong");
            }
        }
        setPosts([]);
        initilPostsLoadedRef.current = false;
        postsAreLeftRef.current = true;
        setOffset(0);
        getUser();
    }, [queryUsername])



    


  
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