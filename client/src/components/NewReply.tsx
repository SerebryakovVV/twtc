import { useSelector } from "react-redux"
import { RootState } from "../store"
import { useState, useRef, useEffect } from "react";


import { useJwtFetch } from "../utils";

// need to check if parentcommentid is null to differentiate between roots and others

// change any to function

export default function NewReply({toRoot, replyToName, postID, parentCommentID, hideReplyWhenSent}:{toRoot:boolean, replyToName:string | null, hideReplyWhenSent:any, postID:number | string | undefined, parentCommentID:number | null}) {
    const [reply, setReply] = useState<string>(replyToName ? "@" + replyToName + ", " : "");
    const authorID = useSelector((state: RootState) => state.auth.id);
    const replyRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (replyRef.current) {
            replyRef.current.style.height = "auto";
            replyRef.current.style.height = replyRef.current.scrollHeight + "px";
        }
    }, [reply])

    const handleReplyChange = (e) => {
        // check the length
        setReply(e.target.value);
    }

     const jwtFetch = useJwtFetch();
            const accessToken = useSelector((state: RootState) => state.auth.jwt);
            const accessTokenRef = useRef(accessToken);
            useEffect(()=>{
                accessTokenRef.current = accessToken;
            }, [accessToken])

    const handleReplySend = async () => {
        console.log(postID, parentCommentID, reply, authorID);

        try {
            const response = await jwtFetch("http://localhost:3000/comment", {
                method: "POST",
                credentials:"include",
                headers: {
                    'Content-Type': 'application/json' , "authorization":"Bearer " + accessTokenRef.current
                },
                body: JSON.stringify({postID, parentCommentID, reply})
            });
            console.log('success');
            setReply("")
            if (hideReplyWhenSent) hideReplyWhenSent(false);
        } catch(e) {
            console.log(e);
        }

            
    }

    return(
        // <div className="px-3 py-1">
        <div className={`${toRoot && "border-b border-zinc-300 "} px-3 py-1 `}>
            <div className="text-lg">Reply</div>
            <textarea ref={replyRef} value={reply} onChange={handleReplyChange} className="bg-zinc-100 border border-zinc-300 p-1 mt-1 w-full block resize-none overflow-hidden focus:outline-none text-sm"/>
            <button onClick={handleReplySend}>Send</button>
        </div>
    );
}