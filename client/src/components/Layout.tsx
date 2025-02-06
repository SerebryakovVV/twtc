import { useSelector } from "react-redux"
import { RootState } from "../store"
// import kitty from "../../public/kitty.png"
import MenuSidebar from "./MenuSidebar"
import SearchSidebar from "./SearchSidebar"
import { Outlet } from "react-router-dom"
import PageHeader from "./PageHeader"

export default function Layout() {

	const authUsername = useSelector((state: RootState) => state.auth.username)


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

