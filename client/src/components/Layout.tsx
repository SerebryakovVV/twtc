import MenuSidebar from "./MenuSidebar"
import SearchSidebar from "./SearchSidebar"
import { Outlet } from "react-router-dom"
import PageHeader from "./PageHeader"


export default function Layout() {
	return (
    	<div className="min-h-screen bg-zinc-100 flex justify-center">
			<div className="bg-zinc-100 w-[850px] flex justify-between">
				<MenuSidebar/>
				<div className="w-[500px] relative left-[150px]">
					{/* <PageHeader text="page header"/> */}
                	<Outlet/>
				</div>
				<SearchSidebar/>
			</div>
		</div>
  	)
}

