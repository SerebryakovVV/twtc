import { useEffect, useState, useRef } from "react";
import NewReply from "./NewReply";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { FaReply } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { timestampTransform } from "../utils";
import { imgResToObjUrl } from "../utils";
import { useJwtFetch } from "../utils";


export default function Comment({postId, id, root, username, timestamp, text, isLiked, replyCount, likesNum, parentCommentIdToPass, pfp}:{pfp:any, parentCommentIdToPass:number,likesNum:number, replyCount:number, postId:string | undefined, id:number, root:boolean, username:string, timestamp:string, text:string, isLiked:boolean}) {
    const [isReplyActive, setIsReplyActive] = useState<boolean>(false);
    const [isLikedState, setIsLikedState] = useState<boolean>(isLiked);
    const [isLikeLoading, setIsLikeLoading] = useState<boolean>(false);
    const [showReplies, setShowReplies] = useState<boolean>(false);
    const [likesCount, setLikesCount] = useState<number>(Number(likesNum));
    const [commentReplies, setCommentReplies] = useState<any[]>([]);
    const navigate = useNavigate();
    const jwtFetch = useJwtFetch();
    const accessToken = useSelector((state: RootState) => state.auth.jwt);
    const accessTokenRef = useRef(accessToken);
    
    useEffect(()=>{
        setIsLikedState(isLiked);
        console.log(isLiked);
    }, [isLiked])

    useEffect(()=>{
        accessTokenRef.current = accessToken;
    }, [accessToken])

    const handleLike = async () => {
        if (!isLikeLoading) {
            setIsLikeLoading(true);
            const response = await jwtFetch("http://localhost:3000/like_comment", {
                method: isLikedState ? "DELETE" : "POST",
                credentials:"include",
                headers:{"Content-Type": "application/json", "authorization":"Bearer " + accessTokenRef.current},
                body:JSON.stringify({
                    id
                })
            });
            if (response.ok) {
                setIsLikedState(!isLikedState);
                setLikesCount((l)=>isLikedState ? l - 1 : l + 1);
            }
            setIsLikeLoading(false);
        }
    }


    const loadCommentReplies = async () => {
        setShowReplies(true);
        try {
            const response = await jwtFetch("http://localhost:3000/comment_replies?comment_id=" + id, {
                credentials:"include",
                headers:{"authorization":"Bearer " + accessTokenRef.current}
            });
            if (!response.ok) throw new Error("error loading replies");
            const responseJson = await response.json();
            setCommentReplies(responseJson);
        } catch(e) {
            console.log(e);
            setShowReplies(false);
        }
    }


    return(
        <div className={`${!root && "pl-[30px] "} pt-2 border-b border-zinc-300`}>
            <div className="flex mx-2">
                <div className="w-[40px] h-[40px] shrink-0 rounded-full overflow-hidden mr-2 cursor-pointer" onClick={()=>navigate("/profile/" + username)}>
                    <img src={pfp ?? "/default_pfp.jpg"} className="object-cover object-center w-full h-full" />
                </div>
                <div>
                    <div className="cursor-pointer" onClick={()=>navigate("/profile/" + username)}>
                        {username}
                    </div>
                    <div className="text-xs">
                        {timestamp}
                    </div>
                </div>
            </div>
            <div className="px-2 py-1">
                {text}
            </div>
            <div className={`${showReplies && !isReplyActive ? " border-b border-zinc-300 " : ""} pl-2 flex`}>
                <span className="pt-[2px]" onClick={handleLike}>{isLikedState ? <IoIosHeart /> : <IoIosHeartEmpty />}</span>
                <span className="text-sm mr-1">{likesCount}</span>
                <span className="pt-[2px]" onClick={()=>setIsReplyActive(!isReplyActive)}>{isReplyActive ? <IoCloseSharp /> : <FaReply  />}</span>
            </div>

            {isReplyActive && <NewReply 
                                    toRoot={root}
                                    replyToName={username} 
                                    hideReplyWhenSent={setIsReplyActive} 
                                    postID={postId} 
                                    parentCommentID={parentCommentIdToPass}/>}

            {(!showReplies && replyCount != 0) &&
                <div className="ml-1 text-sm underline cursor-pointer mb-1" onClick={loadCommentReplies}>
                    Show replies({replyCount})
                </div>
            }
            {commentReplies.map((c)=>{
                return(<Comment 
                            pfp={c.pf_pic && imgResToObjUrl(c.pf_pic.data)}
                            parentCommentIdToPass={parentCommentIdToPass}
                            key={c.id} 
                            postId={postId}
                            id={c.id} 
                            root={false} 
                            username={c.name} 
                            timestamp={timestampTransform(c.created_at)} 
                            text={c.content} 
                            isLiked={c.liked_by_user}
                            replyCount={0 as number}
                            likesNum={Number(c.likes_num)}
            />)})}
        </div>
    ); 
}