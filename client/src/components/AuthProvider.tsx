import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setIdRedux, setUsernameRedux, setJwtRedux } from '../features/auth/authSlice';
import { useState } from 'react';


// skip the reload save for now, can put the id, username and jwt into localstorage, but will need to put it in useState in components

export default function AuthProvider({children}:{children:ReactNode}): JSX.Element | null {
	// const [username, setUsername] = useState();
	// const [id, setId] = useState();

	const navigate = useNavigate();
	const dispatch = useDispatch()
	// const accessToken = useSelector((state: RootState) => state.auth.jwt) || localStorage.getItem('accessToken');
	const accessToken = useSelector((state: RootState) => state.auth.jwt);
	// also need to put id and username into the localstorage

	// let username = useSelector((state: RootState) => state.auth.username);
	// if (!username) {
	// 	username = localStorage.getItem("username");
	// 	if (username) dispatch(setUsernameRedux(username));
	// }
	
	// let id = useSelector((state: RootState) => state.auth.id);
	// if (!id) {
	// 	id = localStorage.getItem("id");
	// 	if (id) dispatch(setIdRedux(id));
	// }
	
	useEffect(()=>{
		if (!accessToken) navigate("/login");
	}, [accessToken]);
	return accessToken ? <>{children}</> : null;
}


/*

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { setUser } from "../store/authSlice"; // assuming you have an action to set user info

export default function AuthProvider({ children }: { children: ReactNode }): JSX.Element | null {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Access token, id, and username from Redux or localStorage
    const accessToken = useSelector((state: RootState) => state.auth.jwt) || localStorage.getItem('accessToken');
    const userId = useSelector((state: RootState) => state.auth.id);
    const username = useSelector((state: RootState) => state.auth.username);

    // UseEffect to check for missing user data in Redux and get from localStorage if needed
    useEffect(() => {
        if (!accessToken) {
            navigate("/login");
        } else {
            // If userId or username are missing from Redux, fetch from localStorage
            if (!userId || !username) {
                const storedUserId = localStorage.getItem("userId");
                const storedUsername = localStorage.getItem("username");

                // If userId and username exist in localStorage, dispatch them to Redux
                if (storedUserId && storedUsername) {
                    dispatch(setUser({ id: storedUserId, username: storedUsername }));
                }
            }
        }
    }, [accessToken, navigate, dispatch, userId, username]);

    // If no access token, render nothing (block access)
    if (!accessToken) return null;

    return <>{children}</>;
}

*/