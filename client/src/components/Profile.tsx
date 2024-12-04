import { useEffect, useState } from "react";
import NewPost from "./NewPost";
import ProfileHeader from "./ProfileHeader";
import { useSelector } from "react-redux"
import { RootState } from "../store"
import { useParams } from 'react-router-dom';

import Post from "./Post.tsx";

import FeedPost from './FeedPost.tsx'


export default function Profile() {
    const [posts, setPosts] = useState<any[]>([])
    const username = useSelector((state: RootState) => state.auth.username);
    const { queryUsername } = useParams();
   
    // useEffect(()=>{
    //     const getPosts = async () => {
    //         try {
    //             const queryResult = await fetch(`http://localhost:3000/posts?username=${queryUsername}`);
    //             const queryResultJson = await queryResult.json();
    //             setPosts(queryResultJson);
    //             console.log(queryResultJson);
    //         } catch(e) {
    //             console.log(e);
    //         }
    //     }
    //     getPosts()
    // },[])

    return(
        <div className="">
            {/* <ProfileHeader/>          */}
            {/* {username === queryUsername ? <NewPost/> : null}  */}
            {/*
            {
                posts.map(
                    (el, index)=>{
                        return(
                            <div>
                                <div key={el.post_id}>{el.content}</div>
                                {
                                    el.images && el.images.map(
                                        (i)=>{
                                            return(
                                                <img src={`data:image/png;base64,${i.image}`} alt="Uploaded Image"></img>
                                            ) 
                                        }
                                    )
                                }
                            </div>
                        )
                    }
                )
            }  
            */}
            {/* delete later */}
            {/* <FeedPost 
                username="valentin" 
                text=" this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text"
                timestamp="22.11.2024"
                likesNum={1488}
                commentsNum={282}
            /> */}
            {/* delete later */}






                    <Post username="valentin" 
                     text=" this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text this is the text"
                         timestamp="22.11.2024"
                         likesNum={1488}
                         commentsNum={282}/>
    </div>

        

    );
}

