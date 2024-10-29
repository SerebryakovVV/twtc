import { useSelector } from "react-redux"
import { RootState } from "../store"
// import kitty from "../../public/kitty.png"

export default function Profile() {

	const authUsername = useSelector((state: RootState) => state.auth.username)

	return (
    	<div className="h-screen bg-zinc-100 flex justify-center">
			<div className="bg-zinc-300 w-[1100px] flex">
				

				// separate into a component
				<div className="w-[275px] bg-red-300">
					buttons here
				</div>



				<div className="bg-zinc-500 w-[550px]">
					two parts here
					header with user info
					and posts
					if authenticated show likes or they will be on the side with post creation form
				</div>
				

				// separate into a component
				<div className="w-[275px] bg-green-300">
					search here
				</div>

			</div>
			
			
			
		</div>
  	)
}


{/* <img src="/kitty.png" alt="nothing is working!!!!!!!!!!" /> */}
// <div>{authUsername}</div>