import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';


export default function AuthProvider({children}:{children:ReactNode}): JSX.Element | null {
	const navigate = useNavigate();
  	const accessToken = useSelector((state: RootState) => state.auth.jwt);
	useEffect(()=>{
		if (!accessToken) navigate("/login");
	}, [accessToken]);
	return accessToken ? <>{children}</> : null;
}