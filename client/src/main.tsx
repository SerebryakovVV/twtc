import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Login from './components/Login.tsx'
import Register from './components/Register.tsx'

import { store } from './store.ts'
import { Provider } from 'react-redux'

import ReduxTest from './components/ReduxTest.tsx'  

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
	},
	{
		path: "red",
		element: <ReduxTest/>
	}
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
	

	<Provider store={store}>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	
	</Provider>

	


	{/* <App /> */}
	{/* <div></div> */}

    
  </StrictMode>,
)
