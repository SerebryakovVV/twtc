import { imgResToObjUrl } from "../utils.ts"

import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

import { FaAngleLeft, FaAngleRight } from "react-icons/fa";


export default function PostImages({images}:{images:any[]}) {
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [imgNum, setImgNum] = useState<number>(images.length);
    const [currentImg, setCurrentImg] = useState<number>(0);
    const [imagesTransformed, setImagesTransformed] = useState<any[]>([]);

    useEffect(()=>{
        const cleanUpReference = images.map((i)=>({id:i.image_id, image:imgResToObjUrl(i.image)}));
        setImagesTransformed(cleanUpReference);
        return () => cleanUpReference.forEach((i)=>URL.revokeObjectURL(i.image))
    }, [images])

    const handleFullscreen = (i) => {
        setCurrentImg(i);
        setIsFullscreen(true);
    }

    let layout: string[] = [];
    if (imagesTransformed && imagesTransformed.length !== 0) {
        switch (imagesTransformed.length) {
        case 1:
            layout.push("col-span-2 row-span-2");
            break;
        case 2:
            layout.push("col-span-1 row-span-2 border-r-2 border-zinc-300");
            layout.push("col-span-1 row-span-2");
            break;
        case 3:
            layout.push("col-span-1 row-span-2 border-r-2 border-zinc-300");
            layout.push("col-span-1 row-span-1 border-b-2 border-zinc-300");
            layout.push("col-span-1 row-span-1");
            break;
        case 4:
            layout.push("col-span-1 row-span-1 border-r-2 border-b-2 border-zinc-300");
            layout.push("col-span-1 row-span-1 border-b-2 border-zinc-300");
            layout.push("col-span-1 row-span-1 border-r-2 border-zinc-300");
            layout.push("col-span-1 row-span-1");
            break;
        } 
    } else {
        return null;
    }

    return(
        <div className="grid grid-cols-2 grid-rows-2 w-[476px] h-[238px] border border-zinc-300 m-auto">
            {imagesTransformed.map((img, index)=>{
                return(
                    <div key={img.id} className={layout[index] + " overflow-hidden"}>
                        <img alt="notihgn here"
                            className="object-cover object-center w-full h-full" 
                            src={img.image}
                            onClick={()=>handleFullscreen(index)}    
                        />
                    </div>
                )
            })}
            {isFullscreen && createPortal(
                <div onClick={()=>setIsFullscreen(false)}  className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-45">
                    <div onClick={(e)=>e.stopPropagation()} className="relative h-auto w-[1200px] border border-black">
                        <div className={"absolute top-1/2 transform -translate-y-1/2 " + (currentImg > 0 ? "" : "hidden")}
                             onClick={()=>setCurrentImg(currentImg-1)}>
                            <FaAngleLeft size={64}/>
                        </div>
                        <div>
                            <img className="object-contain w-full h-full" src={imagesTransformed[currentImg].image}/>
                         </div>
                         <div className={"absolute top-1/2 right-0 transform -translate-y-1/2 " + (currentImg >= images.length - 1 ? "hidden" : "")}
                              onClick={()=>setCurrentImg(currentImg+1)}>
                            <FaAngleRight size={64}/>
                        </div>
                    </div>
                </div>, 
                document.body
            )}
        </div>   
    );
}