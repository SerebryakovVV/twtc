import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Login from './components/Login.tsx'
import Register from './components/Register.tsx'

import {createBrowserRouter, RouterProvider} from 'react-router-dom'

const router = createBrowserRouter([
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
	<RouterProvider router={router} />
	{/* <App /> */}
	{/* <div></div> */}

    
  </StrictMode>,
)
