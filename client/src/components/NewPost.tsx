import { useState, useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import { SlPaperClip } from "react-icons/sl";
import { BiColor } from "react-icons/bi";
import { useJwtFetch } from "../utils";

export default function NewPost() {

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    const [text, setText] = useState<string>("");
    const [images, setImages] = useState<string[]>([]);

    // const [height, setHeight] = useState<string>("100");

    const authorID = useSelector((state: RootState) => state.auth.id);

    const [filesState, setFilesState] = useState<File[] | []>([]);

    const jwtFetch = useJwtFetch();
    const accessToken = useSelector((state: RootState) => state.auth.jwt);
    const accessTokenRef = useRef(accessToken);
    useEffect(()=>{
        accessTokenRef.current = accessToken;
    }, [accessToken])

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
        }
    }, [text])


    const createNewPost = async () => {
        const formattedText = text.replace(/\n{3,}/g, '\n\n');
        let id: string | Blob;

        // check later
        // and rewrite, what the fuck even is this
        // id = authorID || ""
        // if (authorID) {
        //     id = authorID;
        // } else {
        //     id = ""
        // }
        const formData = new FormData();
        formData.append('text', formattedText);
        // formData.append('authorID', id);
        filesState.forEach((image) => formData.append('images', image));
        try {
            const response = jwtFetch("http://localhost:3000/post", {
				method:"POST",
                credentials:"include",
                headers:{"authorization":"Bearer " + accessTokenRef.current},
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

    

    const handeleTextChange = (e) => {
        console.log(e.target.scrollHeight);
        // console.log(height);
        setText(e.target.value);
        // setHeight("");
        // setHeight(e.target.scrollHeight);
        
    }

//https://chatgpt.com/c/6734f4db-1190-8008-ab20-49056a595c48

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        console.log(e.target.files);
        const files = e.target.files ? Array.from(e.target.files) : [];
        const imageUrls = files.map((file) => URL.createObjectURL(file));
        setFilesState(files.slice(0,4));
        setImages(imageUrls.slice(0,4));
    };

    
    return(
        <div className="p-2 border-b border-zinc-300 text-lg">New post
            <textarea 
                ref={textAreaRef}
                className={`bg-zinc-100 border border-zinc-300 p-1 mt-1 w-full block resize-none focus:outline-none text-sm overflow-hidden`}
                value={text}
                onChange={handeleTextChange}>
            </textarea>
            <input id="file-input" className="hidden" type="file" accept="image/*" multiple onChange={handleImageChange}/>
            <div className="mt-1">
                <div className="flex">
                    {images.map((i)=>{return(
                        <div className="w-[100px] h-[100px] mr-4 border border-zinc-300">
                           <img className="object-cover object-center w-full h-full" src={i}/>
                        </div>
                    )})}
                </div>
                
                <label htmlFor="file-input" className="hover:cursor-pointer m-2"><SlPaperClip style={{color:"black", display:"inline"}} size={20} /></label>
                <button onClick={createNewPost} className="ml-1 p-1 text-lg">Send</button>
                
            </div>
            
            
            
        </div> 
    )
}





