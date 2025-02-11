import { useState, useEffect, ReactNode, useRef } from "react";
import { imgResToObjUrl } from "../utils";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import FeedPost from "./FeedPost";
import { useJwtFetch } from "../utils";

import { useNavigate } from "react-router-dom";

export default function Subscriptions() {
    const [subs, setSubs] = useState<any[]>([]);
    

    const userId = useSelector((state: RootState) => state.auth.id);

    const jwtFetch = useJwtFetch();
    const accessToken = useSelector((state: RootState) => state.auth.jwt);

    useEffect(()=>{

        const getSubs = async () => {
            try {
                const response = await jwtFetch("http://localhost:3000/subscriptions", {

                    credentials:"include", 
                    headers: {"authorization":"Bearer " + accessToken},
                });
                if (!response.ok) {throw new Error("error subscription")}
                const responseJson = await response.json();
                setSubs(responseJson);
                console.log(responseJson);
            } catch(e) {
                console.log(e);
                // handle the error
            }
        }

        getSubs();
    }, [accessToken])


    
    
    
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
    const jwtFetch = useJwtFetch()
    
    const [isLoading, setIsLoading] = useState(false);
    
    // const authID = useSelector((state: RootState) => state.auth.id);
    const accessToken = useSelector((state: RootState) => state.auth.jwt);
    const accessTokenRef = useRef(accessToken);
    
        useEffect(()=>{
            accessTokenRef.current = accessToken;
        }, [accessToken])

    const handleFollow = async () => {
        if (isLoading) return;
        try {
            setIsLoading(true);
            const response = await jwtFetch("http://localhost:3000/subscription", {
                method:"POST",  
                credentials:"include", 
                headers: {"Content-Type": "application/json", "authorization":"Bearer " + accessTokenRef.current}, 
                body:JSON.stringify({followedId:id, isFollowed})
            });
            if (response.ok) {
                setIsFollowed(!isFollowed);
            } else {
                throw new Error("subscription error")
            }
        } catch(e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <div className="border-b border-zinc-300 flex p-2">
            <div className="w-[70px] h-[70px] shrink-0 rounded-full overflow-hidden mr-2">
                <img onClick={()=>navigate("/profile/" + name)} className="object-cover object-center w-full h-full rounded-md cursor-pointer" src={pfp ?? "/default_pfp.jpg"} alt="" />
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