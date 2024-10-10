import { useState } from "react";
import ErrorMessage from "./ErrorMessage";


type validationErrorType = "Password too short" | "Username too short";
type authErrorType = "User not found" | "Wrong password";


export default function Login() {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [usernameError, setUsernameError] = useState<validationErrorType | "">("");
	const [passwordError, setPasswordError] = useState<validationErrorType | "">("");
	const [authError, setAuthError] = useState<authErrorType | "">("");

	const handleChangeUsername = (value: string): void => {
		setUsername(/^[a-zA-Z0-9]{0,20}$/.test(value) ? value : username);
	}

	const handleChangePassword = (value: string): void => {
		setPassword(/^[a-zA-Z0-9!@#$%&*]{0,20}$/.test(value) ? value : password);
	}

	const validateAndFetch = (): validationErrorType[] | void => {
		setUsernameError("");
		setPasswordError("");
		setAuthError("");
		if (username.length < 1) setUsernameError("Username too short");
		if (password.length < 6) setPasswordError("Password too short");
	
		// fetch logic here

	}

  	return (
		<div className="w-screen h-screen bg-zinc-100 flex justify-center items-center">
			<div className="border border-solid border-black bg-white shadow-lg w-96 h-[500px] rounded-lg flex flex-col absolute">
					<h1 className="text-3xl text-center mt-4 mb-12">Login</h1>
					
					
					<div className="mx-7 h-24">
						<input 
						className="w-full mb-2 focus:outline-none border-b border-black" type="text" placeholder="Username" value={username}
						onChange={(e)=>handleChangeUsername(e.target.value)}
						/>
						{usernameError && <ErrorMessage msg={usernameError}/>}
					</div>
					
					
					<div className="mx-7 h-24">

					<input 
						className="w-full mb-2 focus:outline-none border-b border-black" type="password" placeholder="Password" value={password}
						onChange={(e)=>handleChangePassword(e.target.value)}
					/>
					{passwordError && <ErrorMessage msg={passwordError}/>}
</div>
					{/* {
						errArr.map(el=><ErrorMessage msg={el}/>)
					} */}

<div className="mx-7 h-24">
<ErrorMessage msg={"hello"}/>
</div>
	


					<button 
						className="mx-7 relative bottom-10 mt-auto rounded border border-solid border-black bg-black text-white hover:bg-white hover:text-black py-3"
						onClick={validateAndFetch}
					>
						Submit
					</button>
			</div>
		</div>
	)
}
