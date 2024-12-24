import { useSelector } from "react-redux"
import { RootState } from "../store"
import { useState } from "react";

export default function ProfileHeader({pfp, username, subCount, postCount}) {

    // need to delete probably
    const authUsername = useSelector((state: RootState) => state.auth.username);
    const authID = useSelector((state: RootState) => state.auth.id);

    const [isFollowed, setIsFollowed] = useState<boolean>(true)

    const handleFollow = () => {
        console.log("works");
        setIsFollowed(!isFollowed);
    }

    return(
        <div className="flex p-2 border-b border-zinc-300">
            <div className="w-[100px] h-[100px] shrink-0 rounded-md overflow-hidden mr-2">
                <img className="object-cover object-center w-full h-full" src="/kitty.png" alt="" />
            </div>
            <div className="grow">
                <div className="text-3xl bold pl-1">
                    {username}
                </div>
                <div className="pl-1">
                    <span className="text-sm mr-5">
                        Followers: {subCount}
                    </span>
                    <span className="text-sm">
                        Posts: {postCount} 
                    </span>
                </div>
                {username !== authUsername && 
                    <button 
                        onClick={handleFollow}
                        className="text-lg hover:bg-zinc-200 rounded-md px-1 mt-2 border border-zinc-300"
                    >
                        {isFollowed ? "Follow" : "Unfollow"}
                    </button>
                }            
            </div>
        </div>
    )
}