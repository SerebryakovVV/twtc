import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';

// https://chatgpt.com/c/6716a293-c924-8008-bd87-197f3992430e
// https://chatgpt.com/c/6716a997-a5f4-8008-a7a0-6f63d2cd2dc9


export default function AuthProvider({children}:{children:ReactNode}): JSX.Element {
	const navigate = useNavigate();
  	const authUsername = useSelector((state: RootState) => state.auth.username)
	useEffect(()=>{
		if (!authUsername) {
			navigate("/login");
		}}, [authUsername]
	);
	return(<>{children}</>)
}