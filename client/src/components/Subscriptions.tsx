import { useState, useEffect } from "react";
import { imgResToObjUrl } from "../utils";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import FeedPost from "./FeedPost";

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
                    <div>{p.name}</div>
                )
            })}
        </div>
    );
}

