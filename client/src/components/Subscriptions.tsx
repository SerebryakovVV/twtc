import { useState, useEffect, ReactNode } from "react";
import { imgResToObjUrl } from "../utils";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import FeedPost from "./FeedPost";


import { useNavigate } from "react-router-dom";

export default function Subscriptions() {
    const [subs, setSubs] = useState<any[]>([]);

    const userId = useSelector((state: RootState) => state.auth.id);

    useEffect(()=>{

        const getSubs = async () => {
            try {
                const response = await fetch("http://localhost:3000/subscriptions?user_id=" + userId);
                const responseJson = await response.json();
                setSubs(responseJson);
                console.log(responseJson);
            } catch(e) {
                console.log(e);
                // handle the error
            }
        }

        getSubs();
    }, [])


    
    
    
    return(
        <div className="">
            {subs.map((p)=>{
                return(
                    // <div>{p.name}</div>
                    <SubscriptionCard key={p.id} name={p.name} id={p.id} pfp={p.pf_pic && imgResToObjUrl(p.pf_pic.data)}/>
                )
            })}
        </div>
    );
}



function SubscriptionCard({name, id, pfp}) {
    // where is isLoading state
    const [isFollowed, setIsFollowed] = useState(true);
    const navigate = useNavigate();
    const authID = useSelector((state: RootState) => state.auth.id);

    const handleFollow = async () => {
        try {
            // console.log(followedId, authID, isFollowed);
            const response = await fetch("http://localhost:3000/subscription", {
                method:"POST",
                headers: { "Content-Type": "application/json" }, 
                body:JSON.stringify({followedId:id, authID, isFollowed})
            });
            // i return plain text, no json
            // const responseJson = await response.json();
            // console.log(responseJson);
            if (response.ok) {

                setIsFollowed(!isFollowed);
            }
        } catch(e) {
            console.log(e);
        }
    }

    return(
        <div className="border-b border-zinc-300 flex p-2">
            <div className="w-[70px] h-[70px] shrink-0 rounded-full overflow-hidden mr-2">
                <img onClick={()=>navigate("/profile/" + name)} className="object-cover object-center w-full h-full rounded-md cursor-pointer" src={pfp ?? "/kitty.png"} alt="" />
            </div>
            <div className="pt-1">
                <div onClick={()=>navigate("/profile/" + name)} className="text-xl cursor-pointer">{name}</div>
                <button 
                    onClick={handleFollow} 
                    className="text-base hover:bg-zinc-200 rounded-md px-1 mt-2 border border-zinc-300">
                        {isFollowed ? "Unfollow" : "Follow" }
                </button>
            </div>
        </div>
    )
}