import { useEffect, useState } from "react";
import NewReply from "./NewReply";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { FaReply } from "react-icons/fa";
// import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function Comment({postId, id, root, username, timestamp, text, isLiked, replyCount, likesNum}:{likesNum:number, replyCount:number, postId:string | undefined, id:number, root:null | number, username:string, timestamp:string, text:string, isLiked:boolean}) {

    const [isReplyActive, setIsReplyActive] = useState<boolean>(true);
    const [isLikedState, setIsLikedState] = useState<boolean>(false);

    const [showReplies, setShowReplies] = useState<boolean>(false);
    const [replyNum, setReplyNum] = useState<number>(0);

    // const { id } = useParams()

    useEffect(()=>{
        setIsLikedState(isLiked);
    }, [isLiked])

    const navigate = useNavigate();

    const [replies, setReplies] = useState([]);

    const handleLike = () => {
        setIsLikedState(!isLikedState);
    }


    const loadCommentReplies = () => {
        
    }



    return(
        <div className={`${root ? "pl-[50px]" : "pl-2" } pr-2 pt-2 border-b border-zinc-300`}>
            <div className="flex">
                <div className="flex items-center mr-2 cursor-pointer" onClick={()=>navigate("/profile/" + username)}>
                    <img src="/kitty.png" className="rounded-full w-[40px] h-[40px]" />
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

            <div className="flex pl-1">
                <span className="pt-[2px]" onClick={handleLike}>{isLikedState ? <IoIosHeart /> : <IoIosHeartEmpty />}</span>
                <span className="text-sm mr-1">{likesNum}</span>
                <span className="pt-[2px]" onClick={()=>setIsReplyActive(!isReplyActive)}>{isReplyActive ? <IoCloseSharp /> : <FaReply  />}</span>
            </div>

            



        

            
            {isReplyActive && <NewReply postID={postId} parentCommentID={id}/>}

            { 
                <div className="ml-1 text-sm underline cursor-pointer mb-1" onClick={loadCommentReplies}>
                    Show replies({replyCount})
                </div>
            }


           



            
            
            
        </div>
    ); 
}