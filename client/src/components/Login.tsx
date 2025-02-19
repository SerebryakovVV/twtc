import { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { setUsernameRedux, setIdRedux, setJwtRedux } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";


type validationErrorType = "Password too short" | "Username field is empty";
type AuthErrorType = "User not found" | "Wrong password" | "Server error";


export default function Login() {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
	const [usernameError, setUsernameError] = useState<validationErrorType | "">("");
	const [passwordError, setPasswordError] = useState<validationErrorType | "">("");
	const [authError, setAuthError] = useState<AuthErrorType | "">("");
	const dispatch = useDispatch();
	const navigate = useNavigate();

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
		if (username.length < 1) setUsernameError("Username field is empty");
		if (password.length < 6) {
			setPasswordError("Password too short");
			setPassword("");
		}
		if (username.length < 1 || password.length < 6) return;
		fetchLogin();
	}

	const fetchLogin = async (): Promise<void> => {
		try {
			console.log("start");
			const response = await fetch("http://localhost:3000/login", {
				method:"POST",
				credentials: "include",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username,
					password
				})
			});
			if (!response.ok) throw Error("Fetch error");
			const resultJSON = await response.json();
			dispatch(setUsernameRedux(resultJSON.username));
			dispatch(setIdRedux(resultJSON.id));
			dispatch(setJwtRedux(resultJSON.accessToken));
			localStorage.setItem("accessToken", resultJSON.accessToken);
			localStorage.setItem("id", resultJSON.id);
			localStorage.setItem("username", resultJSON.username);
			navigate("/");
		} catch (err) {
			console.log("its so over ", err);
		}
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
						<div className="w-full mb-2 focus:outline-none border-b border-black flex justify-between">
							<input 
								className="focus:outline-none w-full"
								type={isPasswordVisible ? "text" : "password"} 
								placeholder="Password" 
								value={password}
								onChange={(e)=>handleChangePassword(e.target.value)}
							/>
							<span className="pt-1 pr-2" onClick={()=>setIsPasswordVisible(!isPasswordVisible)}>{isPasswordVisible ? <IoMdEyeOff/>  : <IoMdEye/>}</span>
						</div>
						{passwordError && <ErrorMessage msg={passwordError}/>}
					</div>
					<div className="mx-7 h-24">
						{authError && <ErrorMessage msg={authError}/>}
					</div>
					<button 
						className="mx-7 relative bottom-6 mt-auto rounded border border-solid border-black bg-black text-white hover:bg-white hover:text-black py-3"
						onClick={validateFields}
					>
						Submit
					</button>
					<Link to="/register" className="underline text-center mb-2">register</Link>
			</div>
		</div>
	)
}