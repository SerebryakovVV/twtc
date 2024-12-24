import { imgResToObjUrl } from "../utils.ts"

export default function PostImages({images}:{images:any[]}) {
    let layout: string[] = [];

    if (images && images.length !== 0) {
        switch (images.length) {
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
            {images.map((img, index)=>{
                return(
                    <div className={layout[index] + " overflow-hidden"}>
                        <img className="object-cover object-center w-full h-full" src={imgResToObjUrl(img.image)}/>
                    </div>
                )
            })}
        </div>   
    );
}