import { useEffect, useState } from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import { IoIosHeart } from "react-icons/io";
import { FaReply } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import PostImages from "./PostImages";
import { useParams } from "react-router-dom";
import { timestampTransform, imgResToObjUrl } from "../utils";
import { Link } from "react-router-dom";

// the query for getting all the comment as array of arrays https://chatgpt.com/c/6750a6e8-dda4-8008-941c-576f561606fc
// also cte, recursive queries and postgres functions



export default function Post() {

    // when going from the feed to here, use state inside navigate
    // also check if state empty, so if user gets here from the search bar, the query would be sent

    const [text, setText] = useState("");
    const [username, setUsername] = useState("");
    const [timestamp, setTimestamp] = useState<string>("");
    const [images, setImages] = useState([]);
    const [pfp, setPfp] = useState<string | null>();
    const [likesNum, setLikesNum] = useState()
    const [commentsNum, setCommentsNum] = useState()
    const [comments, setComments] = useState([]);

    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    useEffect(()=>{

        const getRootComments = async () => {
            try {
                const response = await fetch("http://localhost:3000/comments?post_id=" + id);
                const responseJson = await response.json();
                console.log(responseJson);
                console.log(responseJson);

            } catch(e) {
                console.log(e);
            }
        }

        const getPost = async () => {
            try {
                const response = await fetch("http://localhost:3000/post?id=" + id);
                const responseJson = await response.json();
                console.log(responseJson);
                setText(responseJson[0].content);
                setUsername(responseJson[0].name);
                console.log(responseJson[0].created_at);
                setTimestamp(timestampTransform(responseJson[0].created_at));
                setPfp(responseJson[0].pf_pic);
                setImages(responseJson[0].images.length === 0 ? [] : responseJson[0].images.map((e) => ({...e, image: imgResToObjUrl(e.image)})));
                setLoading(false);
                getRootComments();
            } catch(e) {
                // add error
                console.log(e);
            }
        }
        getPost();
    }, []);


    // check if not loading


    // if (loading) return null;
    // if (text === undefined) return null;

    const test = () => {
        // console.log(text);
        // console.log(username);
        console.log(timestamp);
        // console.log(pfp);
        // console.log(images);

    }

    return(
        
        <div>

            
                    <div className="w-full border-b border-zinc-300">
                        <div className="flex pl-3 pt-2">
                            <div className="flex items-center mr-2 cursor-pointer" onClick={()=>window.location.reload()}>
                                <img src="/kitty.png" className="rounded-full w-[40px] h-[40px]"/>
                            </div>
                            <div>
                                <div className="cursor-pointer" onClick={()=>window.location.reload()}>{username}</div>
                                <div>{timestamp}</div>
                            </div>
                        </div>
                        <div className="px-3 mb-2 mt-1">
                            {text.length < 200 ? text :
                                <div>{text.slice(0, 250) + "..."}
                                    <div className="text-blue-600 underline">
                                        <Link to={"/post/" + id}>Read more</Link>
                                    </div>
                                </div>
                            }
                        </div>


                            <button onClick={test}>hello</button>

            
                        {/* <PostImages images={images}/> */}
            
                        {/* <div className="my-1 h-[30px] flex justify-around">
                            <div className="flex cursor-pointer" onClick={handleLike}>
                                <span className="pt-[5px] pr-1">{isLiked ? <IoIosHeart /> : <IoIosHeartEmpty />}</span>
                                <span>{likesNum}</span>
                            </div>
                            <div className="flex cursor-pointer" onClick={()=>navigate("/post/" + id)}>
                                <span className="pt-[5px] pr-1"><FaRegComment /></span>
                                <span>{commentsNum}</span>
                            </div>
                        </div> */}
                    </div>


            



            {/* <div className="w-full border-b border-zinc-300">
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
    
                    <PostImages images={[]}/>

                 <div className="my-1 h-[30px] flex justify-around">
                    <div 
                        className="flex"
                        onClick={handleLike}
                    >
                        <span className="pt-[5px] pr-1">{isLiked ? <IoIosHeart /> : <IoIosHeartEmpty />}</span>
                        <span>{likesNum}</span> 
                    </div>
                    <div className="flex">
                        <span className="pt-[5px] pr-1"><FaRegComment /></span>
                        <span>{commentsNum}</span>
                    </div>
                </div> 
            </div> */}

           
           
            {/* <NewReply postID={1} parentCommentID={2}/>
            <div>Comments</div>
                     <Comment 
                    root={true} 
                    username="valya" 
                    timestamp="02.12.2024" 
                    text="comment text comment textcomment textcomment textcomment textcomment textcomment textcomment textcomment text"
                    isLiked={true}
                    /> */}


            </div>
        );
}


// function Comment({root, username, timestamp, text, isLiked}:{root:boolean, username:string, timestamp:string, text:string, isLiked:boolean}) {

//     const [isReplyActive, setIsReplyActive] = useState<boolean>(true);
//     const [isLikedState, setIsLikedState] = useState<boolean>(false);

//     const handleLike = () => {
//         setIsLikedState(!isLikedState);
//     }

//     return(
//         // <div className={`${!root && "pl-[50px]"}`}>
//         <div className={`${root ? "pl-2" : "pl-[50px]"} pr-2`}>
//             <div className="flex">
//                 <div className="flex items-center">
//                     <img src="/kitty.png" className="rounded-full w-[40px] h-[40px]" />
//                 </div>
//                 <div>
//                     <div>
//                         {username}
//                     </div>
//                     <div>
//                         {timestamp}
//                     </div>
//                 </div>
//             </div>

//             <div>
//                 {text}
//             </div>

//             <div className="flex">
//                 <span className="pt-[2px]" onClick={handleLike}>{isLikedState ? <IoIosHeart /> : <IoIosHeartEmpty />}</span>
//                 <span className="text-sm">123</span>
//                 <span className="pt-[2px]" onClick={()=>setIsReplyActive(!isReplyActive)}>{isReplyActive ? <IoCloseSharp /> : <FaReply  />}</span>
//             </div>
            
//             {isReplyActive && <NewReply postID={1} parentCommentID={2}/>}
            
//         </div>
//     ); 
// }


// function NewReply({postID, parentCommentID}:{postID:number, parentCommentID:number}) {
//     // get author_id from the redux i guess
//     // ger post_id as props
//     // text from state
//     // parent_comment_id as props too 
//     const [reply, setReply] = useState<string>("");

//     const handleReplyChange = (e) => {
//         setReply(e.target.value);
//     }

//     const handleReplySend = async () => {
//         console.log(reply);

//             // await fetch("http://localhost:3000/comment", {
//             //     method: "POST",
//             //     headers: {
//             //         'Content-Type': 'application/json' 
//             //     },
//             //     body: JSON.stringify({postID, parentCommentID, reply, })
//             // });
//     }

//     return(
//         <div className="border-b border-zinc-300 p-3">
//             <div>Reply</div>
//             <input value={reply} onChange={handleReplyChange} type="text" className="bg-zinc-100 border border-zinc-300 p-1 mt-1 w-full block resize-none focus:outline-none text-sm"/>
//             <button onClick={handleReplySend}>Send</button>
//         </div>
//     );
// }