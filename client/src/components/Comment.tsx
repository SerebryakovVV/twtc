import { useEffect, useState } from "react";
import NewReply from "./NewReply";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { FaReply } from "react-icons/fa";
// import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { DiVim } from "react-icons/di";
import { timestampTransform } from "../utils";
import { useParams } from "react-router-dom";
import { imgResToObjUrl } from "../utils";

// change the name of the "notRoot"  so it would make sense

export default function Comment({postId, id, root, username, timestamp, text, isLiked, replyCount, likesNum, parentCommentIdToPass, pfp}:{pfp:any, parentCommentIdToPass:number,likesNum:number, replyCount:number, postId:string | undefined, id:number, root:boolean, username:string, timestamp:string, text:string, isLiked:boolean}) {
    const [isReplyActive, setIsReplyActive] = useState<boolean>(false);
    const [isLikedState, setIsLikedState] = useState<boolean>(isLiked);

    const [isLikeLoading, setIsLikeLoading] = useState<boolean>(false);

    const [showReplies, setShowReplies] = useState<boolean>(false);
    const [likesCount, setLikesCount] = useState<number>(Number(likesNum));

    const userId = useSelector((state: RootState) => state.auth.id);

    const [commentReplies, setCommentReplies] = useState<any[]>([]);

    useEffect(()=>{
        setIsLikedState(isLiked);
        console.log(isLiked);
    }, [isLiked])

    const navigate = useNavigate();

    const [replies, setReplies] = useState([]);

    const handleLike = async () => {
        // setIsLikedState(!isLikedState);
        if (!isLikeLoading) {
            setIsLikeLoading(true);
            console.log("one");
            console.log(id, userId);
            const response = await fetch("http://localhost:3000/like_comment", {
                method: isLikedState ? "DELETE" : "POST",
                headers:{"Content-Type": "application/json"},
                body:JSON.stringify({
                    id,
                    userId,
                })
            });
            console.log("two");
            if (response.ok) {
                setIsLikedState(!isLikedState);
                console.log(isLikedState)
                setLikesCount((l)=>isLikedState ? l - 1 : l + 1);
            }
            setIsLikeLoading(false);
            console.log("three");
        }
    }


    const loadCommentReplies = async () => {
        setShowReplies(true);
        try {
            console.log(id, userId)
            const response = await fetch("http://localhost:3000/comment_replies?comment_id=" + id + "&user_id=" + userId);
            const responseJson = await response.json();
            console.log(responseJson);
            setCommentReplies(responseJson);
        } catch(e) {
            console.log(e);
            setShowReplies(false);
        }
    }


    return(
        // <div className={`${notRoot ? "pl-[50px]" : "pl-2" } pr-2 pt-2 border-b border-zinc-300`}>
        <div className={`${!root && "pl-[30px] "} pt-2 border-b border-zinc-300`}>
            <div className="flex mx-2">
                <div className="flex items-center mr-2 cursor-pointer" onClick={()=>navigate("/profile/" + username)}>
                    <img src={pfp ?? "/kitty.png"} className="rounded-full w-[40px] h-[40px]" />
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
            {/* <div className={`${showReplies && " border-b border-zinc-300 "} pl-2 flex`}> */}
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