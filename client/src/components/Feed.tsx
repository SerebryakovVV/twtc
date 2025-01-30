import { useState, useEffect } from "react";
import { imgResToObjUrl } from "../utils";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import FeedPost from "./FeedPost";

export default function Feed() {
    const [posts, setPosts] = useState<any[]>([]);
    
        const userId = useSelector((state: RootState) => state.auth.id);
    
        useEffect(()=>{
    
            const getSubPosts = async () => {
                try {
                    const response = await fetch("http://localhost:3000/subscriptions_posts?user_id=" + userId);
                    const responseJson = await response.json();
                    setPosts(responseJson);
                    console.log(responseJson);
                } catch(e) {
                    console.log(e);
                    // handle the error
                }
            }
    
            getSubPosts();
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








