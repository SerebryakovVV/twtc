import { useEffect, useState, useRef } from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";
import { FaReply } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import PostImages from "./PostImages";
import { useParams } from "react-router-dom";
import { timestampTransform, imgResToObjUrl } from "../utils";
import { Link } from "react-router-dom";
import NewReply from "./NewReply";
import Comment from "./Comment";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useJwtFetch } from "../utils";

import PageStateMessage from "./PageStateMessage";

// the query for getting all the comment as array of arrays https://chatgpt.com/c/6750a6e8-dda4-8008-941c-576f561606fc
// also cte, recursive queries and postgres functions


type PostPageState = "Loading" | "Post doesn't exist" | "Something went wrong" | "Done";

export default function Post() {
    // when going from the feed to here, use state inside navigate
    // also check if state empty, so if user gets here from the search bar, the query would be sent
    const [text, setText] = useState("");
    const [username, setUsername] = useState("");
    const [timestamp, setTimestamp] = useState<string>("");
    const [images, setImages] = useState([]);
    const [pfp, setPfp] = useState<string | null>();
    const [likesNum, setLikesNum] = useState(0)
    const [commentsNum, setCommentsNum] = useState()
    const [comments, setComments] = useState<any[]>([]);
    const [isLikeLoading, setIsLikeLoading] = useState<boolean>(false);
    const userId = useSelector((state: RootState) => state.auth.id);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const { id } = useParams();
    const navigate = useNavigate();


    const [pageState, setPageState] = useState<PostPageState>("Loading")


    
    const [postLoaded, setPostLoaded] = useState(false);
    const [offset, setOffset] = useState(0); 
    const offsetRef = useRef(offset); 
    const commentsAreLeftRef = useRef(true);
    const loadingRef = useRef(false);
    const initilCommentsLoadedRef = useRef(false);


    const jwtFetch = useJwtFetch();
            const accessToken = useSelector((state: RootState) => state.auth.jwt);
            const accessTokenRef = useRef(accessToken);
            useEffect(()=>{
                accessTokenRef.current = accessToken;
            }, [accessToken])



    useEffect(()=>{
        offsetRef.current = offset;
    }, [offset])


    const scrollHandler = () => {
        const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
        if (scrollTop + clientHeight > scrollHeight - 50 && commentsAreLeftRef.current && !loadingRef.current) {
            getNextRootComments();
        }
    }

    useEffect(()=>{
        if (!postLoaded) return;
        document.addEventListener("scroll", scrollHandler);
        if (!initilCommentsLoadedRef.current) {
            getNextRootComments();
            initilCommentsLoadedRef.current = true;
        }
        return () => document.removeEventListener("scroll", scrollHandler);
    }, [postLoaded])


    const getNextRootComments = async () => {
        try {
            loadingRef.current = true;
            const response = await jwtFetch("http://localhost:3000/root_comments?post_id=" + id + "&offset=" + offsetRef.current,
                {credentials:"include", headers:{"authorization":"Bearer " + accessTokenRef.current}}
            );
            // const response = await fetch("http://localhost:3000/root_comments?post_id=" + id);
            const responseJson = await response.json();
            // console.log(responseJson, id);
            console.log(responseJson);
            if (responseJson.length == 0) commentsAreLeftRef.current = false;
            setComments((c)=>[...c, ...responseJson]);
            setOffset((o)=>o+10);
        } catch(e) {
            console.log(e);
        } finally {
            loadingRef.current = false;
        }
    }
    




    

    useEffect(()=>{
        const getPost = async () => {
            try {
                const response = await jwtFetch("http://localhost:3000/post?id=" + id, {
                    credentials: "include", headers:{"authorization":"Bearer " + accessTokenRef.current}
                });

                if (!response.ok) throw new Error("post loading failed");

                

                const responseJson = await response.json();

                if (responseJson.length === 0) {
                    setPageState("Post doesn't exist");
                    return;
                }
                
                console.log("post:", responseJson);
                setText(responseJson[0].content);
                setUsername(responseJson[0].name);
                setTimestamp(timestampTransform(responseJson[0].created_at));
                setPfp(responseJson[0].pf_pic && imgResToObjUrl(responseJson[0].pf_pic.data));
                setImages(responseJson[0].images);
                setIsLiked(responseJson[0].liked_by_user);
                setLikesNum(responseJson[0].likes_count);
            
                setPostLoaded(true);
                setPageState("Done");

            } catch(e) {
                console.log(e);
                setPageState("Something went wrong")
            }
        }
        getPost();
    }, []);



    const handleLike = async () => {
        if (!isLikeLoading) {
            setIsLikeLoading(true);
            console.log("one");
            console.log(id, userId);
            const response = await jwtFetch("http://localhost:3000/like_post", {
                method: isLiked ? "DELETE" : "POST",
                credentials: "include",
                headers:{"Content-Type": "application/json", "authorization":"Bearer " + accessTokenRef.current},
                body:JSON.stringify({
                    id,
                    userId,
                })
            });
            console.log("two");
            if (response.ok) {
                setIsLiked(!isLiked);
                setLikesNum((l)=>isLiked ? l - 1 : l + 1);
            }
            setIsLikeLoading(false);
            console.log("three");
        }
    }


    switch(pageState) {
        case "Done":
            return(
        
                <div>
        
                            {/* change links inside surname and pfp, make default pfp */}
                            <div className="w-full border-b border-zinc-300 ">
                                <div className="flex pl-3 pt-2">
                                    <div className="flex items-center mr-2 cursor-pointer" >
                                        <img src={pfp ?? "/default_pfp.jpg"} className="rounded-full w-[40px] h-[40px]" onClick={()=>{navigate("/profile/" + username)}}/>
                                    </div>
                                    <div>
                                        <div className="cursor-pointer" onClick={()=>{navigate("/profile/" + username)}}>{username}</div>
                                        <div>{timestamp}</div>
                                    </div>
                                </div>
                                <div className="px-3 mb-2 mt-1">
                                    {text}
                                </div>
        
        
        
                                <PostImages images={images}/>
                    
                                 <div className="my-1 h-[30px] flex justify-center">
                                    <div className="flex cursor-pointer" onClick={handleLike}>
                                        <span className="pt-[5px] pr-1">{isLiked ? <IoIosHeart /> : <IoIosHeartEmpty />}</span>
                                        <span>{likesNum}</span>
                                    </div>
                                </div> 
                            </div>
        
        
                    
        
        
        
                   
                   
                    <NewReply toRoot={false} replyToName={null} hideReplyWhenSent={null} postID={id} parentCommentID={null}/>
        
        
                    
        
                    <div className="text-lg pl-3 border-t border-zinc-300">Comments</div>
        
                    {comments.map((c)=>{
                        return(
                            <Comment 
                            pfp={c.pf_pic && imgResToObjUrl(c.pf_pic.data)}
                                parentCommentIdToPass={c.id}
                                key={c.id} 
                                postId={id}
                                id={c.id} 
                                root={true} 
                                username={c.name} 
                                timestamp={timestampTransform(c.created_at)} 
                                text={c.content} 
                                isLiked={c.liked_by_user}
                                replyCount={c.reply_num as number}
                                likesNum={c.likes_num as number}
                            />
                        )
                    })} 
        
        
                    </div>
                );
        case "Loading":
            return(<PageStateMessage message="Loading"/>);
        case "Post doesn't exist":
            return(<PageStateMessage message="Post doesn't exist"/>);
        case "Something went wrong":
            return(<PageStateMessage message="Something went wrong"/>)
    }
   

    
}





