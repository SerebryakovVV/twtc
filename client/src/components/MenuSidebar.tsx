import { Link } from "react-router-dom"

export default function MenuSidebar() {
    return (
        <div className="w-[150px] bg-zinc-100 border-r border-zinc-300">
            <div className="text-3xl mb-8">TWTX</div>
            <ul className="mr-2">
                <li><Link to="/"><MenuSidebarElement text="Feed"/></Link></li>
                <li><Link to="profile"><MenuSidebarElement text="Profile"/></Link></li>
                <li><Link to="likes"><MenuSidebarElement text="Likes"/></Link></li>
                <li><Link to="subscriptions"><MenuSidebarElement text="Subscriptions"/></Link></li>
            </ul>
    	</div>
    )
}


function MenuSidebarElement({text}:{text:string}) {
    return(
        <div className="pl-1 py-1 pr-7 text-lg hover:bg-zinc-200 rounded">
            {text}
        </div>   
    )
}

