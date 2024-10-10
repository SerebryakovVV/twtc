import { useState } from "react";


const registerUser = async () => {
	try {
		const result = await fetch("registerApi");
	} catch (err) {
		
	}
}





export default function Register() {

	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [repeatPassword, setRepeatPassword] = useState<string>("");
	

    return (
		<div className="w-screen h-screen bg-zinc-100 flex justify-center items-center">
        
		<div className="border border-solid border-black bg-white shadow-lg w-96 h-[500px] rounded-lg flex flex-col absolute">
			
			
				<h1 className="text-3xl text-center mt-4 mb-12">Register</h1>
				
				<input 
					className="mx-7 focus:outline-none border-b border-black mb-10" 
					type="text" 
					placeholder="Username"
					value={username}
					onChange={(e)=>setUsername(e.target.value)}
					/>

				<input 
					className="mx-7 focus:outline-none border-b border-black mb-10" 
					type="password" 
					placeholder="Password"
					value={password}
					onChange={(e)=>setPassword(e.target.value)}
					/>
					
				<input 
					className="mx-7 focus:outline-none border-b border-black mb-10"
					type="password" 
					placeholder="Repeat password"
					value={repeatPassword}
					onChange={(e)=>setRepeatPassword(e.target.value)}
					/>

				<button className="mx-7 relative bottom-10 mt-auto rounded border border-solid border-black bg-black text-white hover:bg-white hover:text-black py-3">
					Submit
				</button>

		
			


		</div>
    
    </div>
    )
  }