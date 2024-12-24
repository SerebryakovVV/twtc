import { useSelector } from "react-redux"
import { RootState } from "../store"
// import kitty from "../../public/kitty.png"
import MenuSidebar from "./MenuSidebar"
import SearchSidebar from "./SearchSidebar"
import { Outlet } from "react-router-dom"
import PageHeader from "./PageHeader"

export default function Layout() {

	const authUsername = useSelector((state: RootState) => state.auth.username)

	// to add active tab
	// https://chatgpt.com/c/674cd218-a64c-8008-9857-b67a21b41ae0

	return (
    	<div className="min-h-screen bg-zinc-100 flex justify-center">
			<div className="bg-zinc-100 w-[850px] flex justify-between">
				<MenuSidebar/>
				<div className="w-[500px]">
					<PageHeader text="page header"/>
                	<Outlet/>
				</div>
				<SearchSidebar/>
			</div>
		</div>
  	)
}

// `
// select 
// 	coalesce(
// 		json_agg
// 		// collecting posts into array
// 		json_build_object(
// 		//	building the object of a post
// 			JSON_AGG
// 			// images to array
// 			json_build_object(
// 				// images
// 			)
// 		)
	
// 	, []
// 	) as posts from users left join posts on users.id = posts.author_id left join post_image on posts.id = post_image.post_id where users.id = $1

// `