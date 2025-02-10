import { useState, useEffect, useRef } from "react";
import { imgResToObjUrl } from "../utils";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import FeedPost from "./FeedPost";

import { useJwtFetch } from "../utils";

export default function Likes() {
    const [posts, setPosts] = useState<any[]>([]);

    ////
    const [offset, setOffset] = useState(0); 
    const offsetRef = useRef(offset); 
    const postsAreLeftRef = useRef(true);
    const loadingRef = useRef(false);
    const initilPostsLoadedRef = useRef(false);
    ////

    const userId = useSelector((state: RootState) => state.auth.id);

    ////
    useEffect(()=>{
        offsetRef.current = offset;
    }, [offset])
    /////

 const jwtFetch = useJwtFetch();
    const accessToken = useSelector((state: RootState) => state.auth.jwt);
    
       
    
        const accessTokenRef = useRef(accessToken);

    useEffect(()=>{
        accessTokenRef.current = accessToken;
    }, [accessToken])


    ////
    const getNextPosts = async () => {
        try {
            loadingRef.current = true;
            const response = await jwtFetch("http://localhost:3000/liked_posts?offset=" + offsetRef.current, 

                {credentials:"include", headers:{"authorization":"Bearer " + accessTokenRef.current}} 

            );
            if (!response.ok) {throw new Error("error likes loading")}
            const responseJson = await response.json();
            if (responseJson.length == 0) postsAreLeftRef.current = false;
            setPosts((p)=>[...p, ...responseJson]);
            console.log(responseJson);
            setOffset((o)=>o+10)
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
        document.addEventListener("scroll", scrollHandler);
        if (!initilPostsLoadedRef.current) {
            getNextPosts();
            initilPostsLoadedRef.current = true;
        }
        return () => document.removeEventListener("scroll", scrollHandler);
    }, [])
    ////



    // useEffect(()=>{

    //     const getLikedPosts = async () => {
    //         try {
    //             const response = await fetch("http://localhost:3000/liked_posts?user_id=" + userId);
    //             const responseJson = await response.json();
    //             setPosts(responseJson);
    //             console.log(responseJson);
    //         } catch(e) {
    //             console.log(e);
    //             // handle the error
    //         }
    //     }

    //     getLikedPosts();
    // }, [])
    
    
    return(
        <div className="">
            {posts.map((p)=>{
                return(
                    <FeedPost 
                    pfp={p.pf_pic && imgResToObjUrl(p.pf_pic.data)}
                        id={p.id}
                        commentsNum={p.comments_count}
                        images={p.images}
                        isLikedByUser={true}
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