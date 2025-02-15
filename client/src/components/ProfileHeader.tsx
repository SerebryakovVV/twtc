import { useSelector } from "react-redux"
import { RootState } from "../store"
import { useEffect, useState } from "react";
import { useJwtFetch } from "../utils";
import { useRef } from "react";


// type ProfileHeaderType = {
//     followedId:number, 
//     isFollowing:boolean, 
//     pfp:string, 
//     username:string, 
//     subCount:number, 
//     postCount:number
// }


export default function ProfileHeader({followedId, isFollowing, pfp, username, subCount, postCount}) {
    const authUsername = useSelector((state: RootState) => state.auth.username);
    const authID = useSelector((state: RootState) => state.auth.id);
    const [isFollowed, setIsFollowed] = useState<boolean>(isFollowing);
    const [fCount, setFCount] = useState<number>(subCount)
    const jwtFetch = useJwtFetch();
    const accessToken = useSelector((state: RootState) => state.auth.jwt);
    const accessTokenRef = useRef(accessToken);

    useEffect(()=>{
        setIsFollowed(isFollowing);
        setFCount(subCount);
    }, [username, isFollowing, subCount])

    useEffect(()=>{
            accessTokenRef.current = accessToken;
    }, [accessToken])
    
    const handleFollow = async () => {
        try {
            console.log(followedId, authID, isFollowed);
            const response = await fetch("http://localhost:3000/subscription", {
                method:"POST",
                headers: { "Content-Type": "application/json" }, 
                body:JSON.stringify({followedId, authID, isFollowed})
            });
            if (response.ok) {
                setFCount((fc)=>isFollowed ? fc - 1 : fc + 1);
                setIsFollowed(!isFollowed);
            }
        } catch(e) {
            console.log(e);
        }
    }

    const handlePfpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!authID || !e.target.files) return;
        const formData = new FormData();
        formData.append('pfp', e.target.files[0])
        try {
            const response = jwtFetch("http://localhost:3000/pfp", {
				method:"POST",
                credentials: "include",
                headers:{"authorization":"Bearer " + accessTokenRef.current},
				body: formData
			});
            window.location.reload();
        } catch(e) {
            console.log(e);
        }
    }

    return(
        <div className="flex p-2 border-b border-zinc-300">
            <div className="w-[100px] h-[100px] shrink-0 rounded-full overflow-hidden mr-2">
                <img className="object-cover object-center w-full h-full" src={pfp ?? "/default_pfp.jpg"} alt="" />
            </div>
            <div className="grow">
                <div 
                onClick={()=>{console.log(isFollowed, isFollowing)}}
                className="text-3xl bold pl-1">
                    {username}
                </div>
                <div className="pl-1">
                    <span className="text-sm mr-5">
                        Followers: {fCount}
                    </span>
                    <span className="text-sm">
                        Posts: {postCount} 
                    </span>
                </div>
                {username === authUsername 
                    ?<div>
                        <input onChange={handlePfpChange} id="pfp-input" className="hidden" type="file" accept="image/png"/>
                        <label htmlFor="pfp-input" className="underline mt-2 ml-1 cursor-pointer">
                            change picture
                        </label>
                    </div>
                    :<button 
                        onClick={handleFollow}
                        className="text-lg hover:bg-zinc-200 rounded-md px-1 mt-2 border border-zinc-300">
                        {isFollowed ? "Unfollow" : "Follow" }
                    </button>
                }            
            </div>
        </div>
    )
}