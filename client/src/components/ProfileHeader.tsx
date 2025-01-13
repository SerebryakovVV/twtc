import { useSelector } from "react-redux"
import { RootState } from "../store"
import { useEffect, useState } from "react";

// type ProfileHeaderType = {
//     isFollowing:boolean, pfp:string, username:string, subCount:number, postCount:number
// }

export default function ProfileHeader({followedId, isFollowing, pfp, username, subCount, postCount}) {

    // need to delete probably
    const authUsername = useSelector((state: RootState) => state.auth.username);
    const authID = useSelector((state: RootState) => state.auth.id);

    const [isFollowed, setIsFollowed] = useState<boolean>(isFollowing);
    // const [isFollowed, setIsFollowed] = useState<boolean>();
    const [fCount, setFCount] = useState<number>(subCount)


    // on mount now, when content changes doesn't mean it unmounts
    useEffect(()=>{
        setIsFollowed(isFollowing);
        setFCount(subCount);
    }, [username, isFollowing, subCount])

// changed subcount to fCount

    const handleFollow = async () => {
        try {
            console.log(followedId, authID, isFollowed);
            const response = await fetch("http://localhost:3000/subscription", {
                method:"POST",
                headers: { "Content-Type": "application/json" }, 
                body:JSON.stringify({followedId, authID, isFollowed})
            });
            // i return plain text, no json
            // const responseJson = await response.json();
            // console.log(responseJson);
            if (response.ok) {
                // setFCount(fCount + (isFollowed ? -1 : 1));
                setFCount((fc)=>isFollowed ? fc - 1 : fc + 1);
                setIsFollowed(!isFollowed);
            }
        } catch(e) {
            console.log(e);
        }
    }

    const handlePfpChange = () => {


        const formData = new FormData();
        formData.append('text', formattedText);
        formData.append('authorID', id);
        filesState.forEach((image) => formData.append('images', image));
        try {
            const response = fetch("http://localhost:3000/post", {
				method:"POST",
				body: formData
			});
            console.log(response);
            setText("");
            // check this later
            setFilesState([]);
            setImages([]);
        } catch(e) {
            console.log(e);
        }


    }

    return(
        <div className="flex p-2 border-b border-zinc-300">
            <div className="w-[100px] h-[100px] shrink-0 rounded-md overflow-hidden mr-2">
                <img className="object-cover object-center w-full h-full" src="/kitty.png" alt="" />
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
                {username === authUsername ?
                // change to button, or input
                <div onClick={handlePfpChange} className="underline mt-2 text-blue-500 cursor-pointer">change profile picture</div>
                :
                    <button 
                        onClick={handleFollow}
                        className="text-lg hover:bg-zinc-200 rounded-md px-1 mt-2 border border-zinc-300"
                    >
                        {isFollowed ? "Unfollow" : "Follow" }
                    </button>
                }            
            </div>
        </div>
    )
}