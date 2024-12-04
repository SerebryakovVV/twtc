import { useState } from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";
import { FaReply } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

// the query for getting all the comment as array of arrays https://chatgpt.com/c/6750a6e8-dda4-8008-941c-576f561606fc

export default function Post({username, text, timestamp, likesNum, commentsNum}:{username: string, text: string, timestamp: string, likesNum: number, commentsNum: number}) {
    
    const [isLiked, setIsLiked] = useState<boolean>(true);
    
    return(
        

        <div>
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
    



                    {/* <PostImages /> */}









                <div className="my-1 h-[30px] flex justify-around">
                    <div className="flex">
                        <span className="pt-[5px] pr-1">{isLiked ? <IoIosHeart /> : <IoIosHeartEmpty />}</span>
                        <span>{likesNum}</span>
                    </div>
                    <div className="flex">

                        <span>{commentsNum}</span>
                    </div>
                </div>
            </div>

           

            
                {/* <Comment 
                    root={true} 
                    username="valya" 
                    timestamp="02.12.2024" 
                    text="comment text comment textcomment textcomment textcomment textcomment textcomment textcomment textcomment text"
                    isLiked={true}
                    /> */}

                


                    


            </div>

        );
  
}


function Comment({root, username, timestamp, text, isLiked}:{root:boolean, username:string, timestamp:string, text:string, isLiked:boolean}) {

    const [isReplyActive, setIsReplyActive] = useState<boolean>(true);

    return(
        // <div className={`${!root && "pl-[50px]"}`}>
        <div className={`${root ? "pl-2" : "pl-[50px]"} pr-2`}>
            <div className="flex">
                <div className="flex items-center">
                    <img src="/kitty.png" className="rounded-full w-[40px] h-[40px]" />
                </div>
                <div>
                    <div>
                        {username}
                    </div>
                    <div>
                        {timestamp}
                    </div>
                </div>
            </div>

            <div>
                {text}
            </div>

            <div className="flex">
                {isLiked ? <IoIosHeart /> : <IoIosHeartEmpty />}
                <span onClick={()=>setIsReplyActive(!isReplyActive)}>{isReplyActive ? <IoCloseSharp /> : <FaReply  />}</span>
            </div>
            
            {isReplyActive && <NewReply postID={1} parentCommentID={2}/>}
            
        </div>
    );
}


function NewReply({postID, parentCommentID}:{postID:number, parentCommentID:number}) {

    // get author_id from the redux i guess
    // ger post_id as props
    // text from state
    // parent_comment_id as props too 
    const [reply, setReply] = useState<string>("");

    const handleReplyChange = (e) => {
        setReply(e.target.value);
    }

    const handleReplySend = async () => {
        console.log(reply);

            
        
            // await fetch("http://localhost:3000/comment", {
            //     method: "POST",
            //     headers: {
            //         'Content-Type': 'application/json' 
            //     },
            //     body: JSON.stringify({postID, parentCommentID, reply, })
            // });
        

        

    }

    return(
        <div>
            <input value={reply} onChange={handleReplyChange} type="text" className="bg-zinc-100 border border-zinc-300 p-1 mt-1 w-full block resize-none focus:outline-none text-sm"/>
            <button onClick={handleReplySend}>Send</button>
        </div>
    );
}


function PostImages({images}:{images:any[]}) {
    let layout: string[] = [];
    if (images && images.length !== 0) {
        switch (images.length) {
        case 1:
            layout.push("col-span-2 row-span-2");
            break;
        case 2:
            layout.push("col-span-1 row-span-2");
            layout.push("col-span-1 row-span-2");
            break;
        case 3:
            layout.push("col-span-1 row-span-2");
            layout.push("col-span-1 row-span-1");
            layout.push("col-span-1 row-span-1");
            break;
        case 4:
            layout.push("col-span-1 row-span-1");
            layout.push("col-span-1 row-span-1");
            layout.push("col-span-1 row-span-1");
            layout.push("col-span-1 row-span-1");
            break;
        } 
    }
    return(
        <div className="grid grid-cols-2 grid-rows-2 w-[476px] h-[238px] border border-zinc-300 m-auto">
            {images.map((img, index)=>{
                return(
                    <img src={img.image} className={layout[index]}/>
                )
            })} 
            {/* <div className="col-span-1 row-span-2">1</div> */}
            {/* <div className="col-span-1 row-span-1">2</div> */}
            {/* <div className="col-span-1 row-span-1">3</div>  */}
            {/* <div>4</div>     */}
        </div>   
    );
}