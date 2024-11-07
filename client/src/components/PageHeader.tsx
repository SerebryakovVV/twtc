import { IoArrowBackOutline } from "react-icons/io5";


export default function PageHeader({text}:{text:string}) {
    return(
        <div className="bg-zinc-100 border-b border-zinc-300 w-full h-10  text-2xl">
            <IoArrowBackOutline className="inline align-middle mr-3"/>
            <span>{text}</span>
        </div>
    );
}