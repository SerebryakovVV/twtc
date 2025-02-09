import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { store } from './store.ts'
import { Provider } from 'react-redux'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import AuthProvider from './components/AuthProvider.tsx'
import Login from './components/Login.tsx'
import Register from './components/Register.tsx'
import Layout from './components/Layout.tsx'
import Post from './components/Post.tsx'
import Feed from './components/Feed.tsx'
import Profile from './components/Profile.tsx'
import Subscriptions from './components/Subscriptions.tsx'
import Likes from './components/Likes.tsx'
import { Navigate } from 'react-router-dom'


const router = createBrowserRouter([
	{
		path:"/",
		element: <AuthProvider><Layout/></AuthProvider>,
		children: [
			{index: true, element:<Feed/>},
			{path: "profile/:queryUsername", element:<Profile/>},
			{path: "post/:id", element:<Post/>},
			{path: "subscriptions", element:<Subscriptions/>},
			{path: "likes", element:<Likes/>}
		]
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
		path: "*",
		element:<Navigate to="/"/>
	}
]);


createRoot(document.getElementById('root')!).render(
  	<StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</StrictMode>,
)