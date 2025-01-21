import { FaRegComment } from "react-icons/fa";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";
import { useEffect, useState } from "react";
import PostImages from "./PostImages";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { timestampTransform } from "../utils";

type FeedPostPropsType = {
    id:number,
    username: string, 
    timestamp: string,
    text: string,
    images: any[],  
    likesNum: number, 
    commentsNum: number,
    isLikedByUser: boolean,
    // pfp:any
}





export default function FeedPost({id, username, timestamp, text, images, likesNum, commentsNum, isLikedByUser}: FeedPostPropsType) {

    const [isLiked, setIsLiked] = useState<boolean>(isLikedByUser);
    const [isLikeLoading, setIsLikeLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    // const reduxUsername = useSelector((state: RootState) => state.auth.username);
    const userId = useSelector((state: RootState) => state.auth.id);
    const [likes, setLikes] = useState<number>(likesNum);


    // useEffect(()=>{
    //     setIsLiked(isLikedByUser);
    // }, [isLikedByUser])

    // rewrite to handle unlike
    // also need to get user likes to see if already liked
    // https://chatgpt.com/c/67685d85-01f4-8008-b531-0b666b006753
    const handleLike = async () => {
        if (!isLikeLoading) {
            setIsLikeLoading(true);
            console.log("one");
            console.log(id, userId);
            const response = await fetch("http://localhost:3000/like_post", {
                method: isLiked ? "DELETE" : "POST",
                headers:{"Content-Type": "application/json"},
                body:JSON.stringify({
                    id,
                    userId,
                })
            });
            console.log("two");
            if (response.ok) {
                setIsLiked(!isLiked);
                setLikes((l)=>isLiked ? l - 1 : l + 1);
            }
            setIsLikeLoading(false);
            console.log("three");
        }
    }

   

    return(

        // when i click pfp/username the follower_id=null
        <div className="w-full border-b border-zinc-300">
            <div className="flex pl-3 pt-2">
                <div className="flex items-center mr-2 cursor-pointer" onClick={()=>window.location.reload()}>
                    <img src="/kitty.png" className="rounded-full w-[40px] h-[40px]"/>
                </div>
                <div>
                    <div className="cursor-pointer" onClick={()=>window.location.reload()}>{username}</div>
                    <div>{timestampTransform(timestamp)}</div>
                </div>
            </div>
            <div className="px-3 mb-2 mt-1">
                {text.length < 200 ? text :
                    <div>{text.slice(0, 250) + "..."}
                        <div className="text-blue-600 underline">
                            <Link to={"/post/" + id}>Read more</Link>
                        </div>
                    </div>
                }  
            </div>

            <PostImages images={images}/>

            <div className="my-1 h-[30px] flex justify-around">
                <div className="flex cursor-pointer" onClick={handleLike}>
                    <span className="pt-[5px] pr-1">{isLiked ? <IoIosHeart /> : <IoIosHeartEmpty />}</span>
                    <span>{likes}</span>
                </div>
                <div className="flex cursor-pointer" onClick={()=>navigate("/post/" + id)}>
                    <span className="pt-[5px] pr-1"><FaRegComment /></span>
                    <span>{commentsNum}</span>
                </div>
            </div>
        </div>
    );
}