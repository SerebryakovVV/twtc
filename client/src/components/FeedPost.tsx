import { FaRegComment } from "react-icons/fa";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";
import { useState } from "react";

export default function FeedPost({username, text, timestamp, likesNum, commentsNum}:{username: string, text: string, timestamp: string, likesNum: number, commentsNum: number}) {

    const [isLiked, setIsLiked] = useState<boolean>(true);

    return(
        <div className="w-full border-b border-zinc-300">
            <div className="flex pl-3 pt-2">
                <div className="flex items-center mr-2">
                    <img src="/kitty.png" className="rounded-full w-[40px] h-[40px]"/>
                </div>
                <div>
                    <div>{username}</div>
                    <div>{timestamp}</div>
                </div>
            </div>
            <div className="px-3 mb-2 mt-1">
                {text}
            </div>

            {/* <div>photos here</div> */}

            <div className="my-1 h-[30px] flex justify-around">
                <div className="flex">
                    <span className="pt-[5px] pr-1">{isLiked ? <IoIosHeart /> : <IoIosHeartEmpty />}</span>
                    <span>{likesNum}</span>
                </div>
                <div className="flex">
                    <span className="pt-[5px] pr-1"><FaRegComment /></span>
                    <span>{commentsNum}</span>
                </div>
            </div>
        </div>
    );
}