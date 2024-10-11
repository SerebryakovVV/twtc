import { useState } from "react";
import ErrorMessage from "./ErrorMessage";


type validationErrorType = "Password too short" | "Username too short";
type authErrorType = "User not found" | "Wrong password" | "Server error";


export default function Login() {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [usernameError, setUsernameError] = useState<validationErrorType | "">("");
	const [passwordError, setPasswordError] = useState<validationErrorType | "">("");
	const [authError, setAuthError] = useState<authErrorType | "">("Server error");

	const handleChangeUsername = (value: string): void => {
		setUsername(/^[a-zA-Z0-9]{0,20}$/.test(value) ? value : username);
	}

	const handleChangePassword = (value: string): void => {
		setPassword(/^[a-zA-Z0-9!@#$%&*]{0,20}$/.test(value) ? value : password);
	}

	const validateFields = (): void => {
		setUsernameError("");
		setPasswordError("");
		setAuthError("");
		if (username.length < 1) setUsernameError("Username too short");
		if (password.length < 6) setPasswordError("Password too short");
		if (username.length < 1 || password.length < 6) return;
		fetchLogin()
	}

	const fetchLogin = async (): Promise<void> => {
		try {
			console.log("heighla");
			fetch("myapdfsfsdfsfsfefefefi.com", {});
		} catch (err) {
			console.log("its so over");
		}


		{/*
			
		async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Parse the response as JSON
    console.log(data); // Use the fetched data

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

fetchData();	
			
		*/}


	} 

  	return (
		<div className="w-screen h-screen bg-zinc-100 flex justify-center items-center">
			<div className="border border-solid border-black bg-white shadow-lg w-96 h-[500px] rounded-lg flex flex-col absolute">
					<h1 className="text-3xl text-center mt-4 mb-12">Login</h1>
					<div className="mx-7 h-24">
						<input 
							className="w-full mb-2 focus:outline-none border-b border-black"
							type="text" 
							placeholder="Username" 
							value={username}
							onChange={(e)=>handleChangeUsername(e.target.value)}
						/>
						{usernameError && <ErrorMessage msg={usernameError}/>}
					</div>
					<div className="mx-7 h-24">
						<input 
							className="w-full mb-2 focus:outline-none border-b border-black"
							type="password" 
							placeholder="Password" 
							value={password}
							onChange={(e)=>handleChangePassword(e.target.value)}
						/>
						{passwordError && <ErrorMessage msg={passwordError}/>}
					</div>
					<div className="mx-7 h-24">
						{authError && <ErrorMessage msg={"hello"}/>}
					</div>
					<button 
						className="mx-7 relative bottom-10 mt-auto rounded border border-solid border-black bg-black text-white hover:bg-white hover:text-black py-3"
						onClick={validateFields}
					>
						Submit
					</button>
			</div>
		</div>
	)
}
