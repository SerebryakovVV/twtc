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
import { useRef } from "react";
import { useJwtFetch } from "../utils";


type FeedPostPropsType = {
    id:number,
    username: string, 
    timestamp: string,
    text: string,
    images: any[],  
    likesNum: number, 
    commentsNum: number,
    isLikedByUser: boolean,
    pfp:any
}


export default function FeedPost({id, username, timestamp, text, images, likesNum, commentsNum, isLikedByUser, pfp}: FeedPostPropsType) {
    const [isLiked, setIsLiked] = useState<boolean>(isLikedByUser);
    const [isLikeLoading, setIsLikeLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [likes, setLikes] = useState<number>(likesNum);
    const jwtFetch = useJwtFetch();
    const accessToken = useSelector((state: RootState) => state.auth.jwt);
    const accessTokenRef = useRef(accessToken);
        
    useEffect(()=>{
        accessTokenRef.current = accessToken;
    }, [accessToken])

    const handleLike = async () => {
        if (!isLikeLoading) {
            setIsLikeLoading(true);
            const response = await jwtFetch("http://localhost:3000/like_post", {
                method: isLiked ? "DELETE" : "POST",
                credentials: "include",
                headers:{"Content-Type": "application/json", "authorization":"Bearer " + accessTokenRef.current},
                body:JSON.stringify({
                    id
                })
            });
            if (response.ok) {
                setIsLiked(!isLiked);
                setLikes((l)=>isLiked ? l - 1 : l + 1);
            }
            setIsLikeLoading(false);
        }
    }

   
    return(
        <div className="w-full border-b border-zinc-300">
            <div className="flex pl-3 pt-2">
                <div className="w-[40px] h-[40px] shrink-0 rounded-full overflow-hidden mr-2 cursor-pointer" onClick={()=>navigate("/profile/"+username)}>
                    <img src={pfp ?? "/default_pfp.jpg"} className="object-cover object-center w-full h-full"/>
                </div>
                <div>
                    <div className="cursor-pointer" onClick={()=>navigate("/profile/"+username)}>{username}</div>
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