import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setIdRedux, setUsernameRedux, setJwtRedux } from '../features/auth/authSlice';
import { useState } from 'react';


export default function AuthProvider({children}:{children:ReactNode}): JSX.Element | null {
	const navigate = useNavigate();
	const dispatch = useDispatch()
	const accessToken = useSelector((state: RootState) => state.auth.jwt);
	const username = useSelector((state: RootState) => state.auth.username);
    const id = useSelector((state: RootState) => state.auth.id);
    const [isSynced, setIsSynced] = useState<boolean>(false);

    useEffect(()=>{
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedUsername = localStorage.getItem('username');
        const storedId = localStorage.getItem('id');
        if (!accessToken && storedAccessToken) dispatch(setJwtRedux(storedAccessToken));
        if (!username && storedUsername) dispatch(setUsernameRedux(storedUsername));
        if (!id && storedId) dispatch(setIdRedux(storedId));
        setIsSynced(true);
    }, [accessToken, username, id])
	
	useEffect(()=>{
        if (isSynced) {
            if (!accessToken || !username || !id) navigate("/login");
            setIsSynced(false);
        }
	}, [accessToken, username, id, isSynced]);

    return (accessToken && username && id) ? <>{children}</> : null;
}