import { useSelector } from "react-redux"
import { RootState } from "../store"
import { useState, useRef, useEffect } from "react";




// need to check if parentcommentid is null to differentiate between roots and others

export default function NewReply({postID, parentCommentID}:{postID:number | string | undefined, parentCommentID:number | null}) {
    const [reply, setReply] = useState<string>("");
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

    const handleReplySend = async () => {
        console.log(postID, parentCommentID, reply, authorID);

        try {
            const response = await fetch("http://localhost:3000/comment", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({postID, parentCommentID, reply, authorID})
            });
            console.log('success');
            setReply("")
        } catch(e) {
            console.log(e);
        }

            
    }

    return(
        <div className="px-3 py-1">
            <div className="text-lg">Reply</div>
            <textarea ref={replyRef} value={reply} onChange={handleReplyChange} className="bg-zinc-100 border border-zinc-300 p-1 mt-1 w-full block resize-none overflow-hidden focus:outline-none text-sm"/>
            <button onClick={handleReplySend}>Send</button>
        </div>
    );
}