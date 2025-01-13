import { useState } from "react";
import NewReply from "./NewReply";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { FaReply } from "react-icons/fa";
// import { useParams } from "react-router-dom";


export default function Comment({postId, id, root, username, timestamp, text, isLiked}:{postId:string | undefined, id:number, root:null | number, username:string, timestamp:string, text:string, isLiked:boolean}) {

    const [isReplyActive, setIsReplyActive] = useState<boolean>(true);
    const [isLikedState, setIsLikedState] = useState<boolean>(false);

    // const { id } = useParams()

    const [replies, setReplies] = useState([]);

    const handleLike = () => {
        setIsLikedState(!isLikedState);
    }


    const loadCommentReplies = () => {
        
    }



    return(
        // <div className={`${!root && "pl-[50px]"}`}>
        <div className={`${root ? "pl-[50px]" : "pl-2" } pr-2`}>
            <div className="flex">
                <div className="flex items-center">
                    <img src="/kitty.png" className="rounded-full w-[40px] h-[40px]" />
                </div>
                <div>
                    <div>
                        {username}
                    </div>
                    <div>
                        {timestamp}
                    </div>
                </div>
            </div>

            <div>
                {text}
            </div>

            <div className="flex">
                <span className="pt-[2px]" onClick={handleLike}>{isLikedState ? <IoIosHeart /> : <IoIosHeartEmpty />}</span>
                <span className="text-sm">123</span>
                <span className="pt-[2px]" onClick={()=>setIsReplyActive(!isReplyActive)}>{isReplyActive ? <IoCloseSharp /> : <FaReply  />}</span>
            </div>

            



            {/* replies number */}

            
            {isReplyActive && <NewReply postID={postId} parentCommentID={id}/>}

            { // replyCount > 0 && 
                <div onClick={loadCommentReplies}>
                    Show replies({123})
                </div>
            }


            {
                // replies.map((r)=>{
                //     return(
                //         <Comment postId={postId} root={id} id={r.id} username={r.username} text={r.content} timestamp="12.12.2012" isLiked={false}/>
                //     )
                // })
                // map over replies
            }




            
            
            
        </div>
    ); 
}