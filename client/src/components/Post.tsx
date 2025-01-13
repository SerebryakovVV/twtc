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
import NewReply from "./NewReply";
import Comment from "./Comment";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

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
    // set likes from the query response
    const [likesNum, setLikesNum] = useState(123)
    const [commentsNum, setCommentsNum] = useState()
    const [comments, setComments] = useState<any[]>([]);
    const [isLikeLoading, setIsLikeLoading] = useState<boolean>(false);
    const userId = useSelector((state: RootState) => state.auth.id);

    const [isLiked, setIsLiked] = useState<boolean>(false);




    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    const navigate = useNavigate();

    useEffect(()=>{

        const getRootComments = async () => {
            try {
                const response = await fetch("http://localhost:3000/comments?post_id=" + id);
                const responseJson = await response.json();
                // console.log(responseJson, id);
                setComments(responseJson);
            } catch(e) {
                console.log(e);
            }
        }


        // rewrite /post sql
        const getPost = async () => {
            try {
                const response = await fetch("http://localhost:3000/post?id=" + id + "&viewerId=" + userId);
                const responseJson = await response.json();
                console.log(responseJson);
                setText(responseJson[0].content);
                setUsername(responseJson[0].name);
                // console.log(responseJson[0].created_at);
                setTimestamp(timestampTransform(responseJson[0].created_at));
                setPfp(responseJson[0].pf_pic);
                setImages(responseJson[0].images);
                //
                setIsLiked(responseJson[0].liked_by_user);
                setLikesNum(responseJson[0].likes_count);
                //
                setLoading(false);
                getRootComments();
            } catch(e) {
                // add error
                console.log(e);
            }
        }
        getPost();
    }, []);



    const handleLike = async () => {
        if (!isLikeLoading) {
            setIsLikeLoading(true);
            console.log("one");
            console.log(id, userId);
            const response = await fetch("http://localhost:3000/like_post", {
                method: isLiked ? "DELETE" : "POST",
                headers:{"Content-Type": "application/json"},
                body:JSON.stringify({
                    id,
                    userId,
                })
            });
            console.log("two");
            if (response.ok) {
                setIsLiked(!isLiked);
                setLikesNum((l)=>isLiked ? l - 1 : l + 1);
            }
            setIsLikeLoading(false);
            console.log("three");
        }
    }

    // check if not loading


    // if (loading) return null;
    // if (text === undefined) return null;

   

    return(
        
        <div>

                    {/* change links inside surname and pfp, make default pfp */}
                    <div className="w-full border-b border-zinc-300 ">
                        <div className="flex pl-3 pt-2">
                            <div className="flex items-center mr-2 cursor-pointer" >
                                <img src="/kitty.png" className="rounded-full w-[40px] h-[40px]" onClick={()=>{navigate("/profile/" + username)}}/>
                            </div>
                            <div>
                                <div className="cursor-pointer" onClick={()=>{navigate("/profile/" + username)}}>{username}</div>
                                <div>{timestamp}</div>
                            </div>
                        </div>
                        <div className="px-3 mb-2 mt-1">
                            {text}
                        </div>



                        <PostImages images={images}/>
            
                         <div className="my-1 h-[30px] flex justify-center">
                            <div className="flex cursor-pointer" onClick={handleLike}>
                                <span className="pt-[5px] pr-1">{isLiked ? <IoIosHeart /> : <IoIosHeartEmpty />}</span>
                                <span>{likesNum}</span>
                            </div>
                        </div> 
                    </div>


            



           
           
            <NewReply postID={id} parentCommentID={null}/>


            

            <div>Comments</div>

            {comments.map((c)=>{
                return(
                    <Comment 
                        key={c.id} 
                        postId={id}
                        id={c.id} 
                        root={null} 
                        username={c.name} 
                        timestamp={timestampTransform(c.created_at)} 
                        text={c.content} 
                        isLiked={true}
                    />
                )
            })} 


            </div>
        );
}





