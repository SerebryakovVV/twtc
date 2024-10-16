import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Login from './components/Login.tsx'
import Register from './components/Register.tsx'

import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import AuthProvider from './components/AuthProvider.tsx'

const router = createBrowserRouter([
	{
		path: "/",
		element: <div>idi nahui</div>
	},
	{
		path: "login",
		element: <Login/>
	},
	{
		path: "register",
		element: <Register/>
	}
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
	
	<AuthProvider>
		<RouterProvider router={router} />
	</AuthProvider>
	


	{/* <App /> */}
	{/* <div></div> */}

    
  </StrictMode>,
)
