import { useState, useEffect, useRef } from "react";
import { imgResToObjUrl } from "../utils";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import FeedPost from "./FeedPost";

export default function Feed() {
    const [posts, setPosts] = useState<any[]>([]);

    ////
    const [offset, setOffset] = useState(0); // probably only need this one for the rerender
    const [postsAreLeft, setPostsAreLeft] = useState(true);
    const [loading, setLoading] = useState(false);
    
    const offsetRef = useRef(offset); 
    const postsAreLeftRef = useRef(postsAreLeft);
    const loadingRef = useRef(loading);


    ////
    
    const userId = useSelector((state: RootState) => state.auth.id);

    
    // const offsetRef = useRef(0);

    useEffect(()=>{
        offsetRef.current = offset;
    }, [offset])

    useEffect(()=>{
        postsAreLeftRef.current = postsAreLeft;
    }, [postsAreLeft])

    useEffect(()=>{
        loadingRef.current = loading;
    }, [loading])


    const getNextPosts = async () => {
        
        // console.log(offset);
        // setOffset((o)=>o+1)

        // console.log(offsetRef.current);
        // offsetRef.current += 1;
        
        // console.log(loading, postsAreLeft, offset)
        if (loadingRef.current || !postsAreLeftRef.current) return;
        try {
            // setLoading(true);
            loadingRef.current = true;
            const response = await fetch("http://localhost:3000/subscriptions_posts?user_id=" + userId + "&offset=" + offsetRef.current);
            const responseJson = await response.json();
            if (responseJson.length == 0) {
                // setPostsAreLeft(false);
                postsAreLeftRef.current = false;
            }
            setPosts((p)=>[...p, ...responseJson]);
            console.log(responseJson);
            setOffset((o)=>o+10)
        } catch(e) {
            console.log(e);
        } finally {
            // setLoading(false);
            loadingRef.current = false;
        }
    }
    

    useEffect(()=>{
        document.addEventListener("mousedown", getNextPosts);
        return () => window.removeEventListener("mousedown", getNextPosts);
    }, [])

    
    return(
        <div className="">
            {posts.map((p)=>{
                return(
                    <FeedPost 
                    pfp={p.pf_pic && imgResToObjUrl(p.pf_pic.data)}
                        id={p.id}
                        commentsNum={p.comments_count}
                        images={p.images}
                        isLikedByUser={p.liked_by_user}
                        likesNum={p.likes_count}
                        text={p.content}
                        timestamp={p.created_at}
                        username={p.name}
                        key={p.id}
                    />
                )
            })}
        </div>
    );
}





