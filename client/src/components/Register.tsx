import { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link } from "react-router-dom";


type validationErrorType = "Password too short" | "Username field is empty" | "Passwords don't match";
type RegistrationErrorType = "Username taken" | "Server error";


export default function Login() {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [repeatPassword, setRepeatPassword] = useState<string>("");
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
	const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] = useState<boolean>(false);
	const [usernameError, setUsernameError] = useState<validationErrorType | "">("");
	const [passwordError, setPasswordError] = useState<validationErrorType | "">("");
	const [repeatPasswordError, setRepeatPasswordError] = useState<validationErrorType | "">("");
	const [registrationError, setRegistrationError] = useState<RegistrationErrorType | "">("");

	const handleChangeUsername = (value: string): void => {
		setUsername(/^[a-zA-Z0-9]{0,20}$/.test(value) ? value : username);
	}

	const handleChangePassword = (value: string, field: "origin" | "repeat"): void => {
		field === "origin" ?
			setPassword(/^[a-zA-Z0-9!@#$%&*]{0,20}$/.test(value) ? value : password) :
			setRepeatPassword(/^[a-zA-Z0-9!@#$%&*]{0,20}$/.test(value) ? value : repeatPassword);
	}

	const validateFields = (): void => {
		setUsernameError("");
		setPasswordError("");
		setRepeatPasswordError("");
		setRegistrationError("");
		if (username.length < 1) setUsernameError("Username field is empty");
		if (password.length < 6) {
			setPasswordError("Password too short");
			setPassword("");
			setRepeatPassword("");
		}
		if (password !== repeatPassword) {
			setRepeatPasswordError("Passwords don't match");
			setPassword("");
			setRepeatPassword("");
		}
		if (username.length < 1 || password.length < 6 || password !== repeatPassword) return;
		console.log("passed");
		registerUser();
	}

	const registerUser = async (): Promise<void> => {
		try {
			const response = await fetch("http://localhost:3000/register", {
				method:"POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username,
					password
				})
			});
			if (!response.ok) {                
				const responseJSON = await response.text();  
				console.log(responseJSON);
				throw Error("Fetch error");  
			}
			console.log("passed the auth");
			const responseJSON = await response.json();
			console.log(responseJSON);
		} catch (err) {
			console.log("its so over ", err);
		}
	}

  	return (
		<div className="w-screen h-screen bg-zinc-100 flex justify-center items-center">
			<div className="border border-solid border-black bg-white shadow-lg w-96 h-[500px] rounded-lg flex flex-col absolute">
					<h1 className="text-3xl text-center mt-4 mb-12">Register</h1>
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
						<div className="w-full mb-2 focus:outline-none border-b border-black flex justify-between">
							<input 
								className="focus:outline-none w-full"
								type={isPasswordVisible ? "text" : "password"} 
								placeholder="Password" 
								value={password}
								onChange={(e)=>handleChangePassword(e.target.value, "origin")}
							/>
							<span className="pt-1 pr-2" onClick={()=>setIsPasswordVisible(!isPasswordVisible)}>{isPasswordVisible ? <IoMdEyeOff/>  : <IoMdEye/>}</span>
						</div>
						{passwordError && <ErrorMessage msg={passwordError}/>}
					</div>
					<div className="mx-7 h-24">
					<div className="w-full mb-2 focus:outline-none border-b border-black flex justify-between">
						<input 
							className="focus:outline-none w-full"
							type={isRepeatPasswordVisible ? "text" : "password"}
							placeholder="Repeat password" 
							value={repeatPassword}
							onChange={(e)=>handleChangePassword(e.target.value, "repeat")}
						/>
						<span className="pt-1 pr-2" onClick={()=>setIsRepeatPasswordVisible(!isRepeatPasswordVisible)}>{isRepeatPasswordVisible ? <IoMdEyeOff/>  : <IoMdEye/>}</span>
					</div>
						{repeatPasswordError && <ErrorMessage msg={repeatPasswordError}/>}
					</div>
					<div className="mx-7 h-24">
						{registrationError && <ErrorMessage msg={registrationError}/>}
					</div>
					<button 
						className="mx-7 relative bottom-6 mt-auto rounded border border-solid border-black bg-black text-white hover:bg-white hover:text-black py-3"
						onClick={validateFields}
					>
						Submit
					</button>
					<Link to="/login" className="underline text-center mb-2">login</Link>
			</div>
		</div>
	)
}
