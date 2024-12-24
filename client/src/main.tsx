// https://roadmap.sh/rust
// https://doc.rust-lang.org/book/ch03-05-control-flow.html
// https://roadmap.sh/golang
// https://chatgpt.com/c/671a95c7-af80-8008-8410-348e7c7feac9?__cf_chl_rt_tk=QUwj6KofYGrOiMqwJ.mkeBQ8YybSedZCH3eEEq96bS8-1730027687-1.0.1.1-gunZAmMob8qprSzGnux2Yimz0Jzs4FBuqv1nas.Eg94
// https://chatgpt.com/c/671aa4dd-0018-8008-8432-be4c497a08d9
// https://chatgpt.com/c/671c8166-dc38-8008-95b9-50246533beb2
// https://chatgpt.com/c/671cbfe1-03dc-8008-b090-779467320536?__cf_chl_rt_tk=7gfjtyKoEcbJRFRhFQkjAcPgDZUFeYS4XZEg9A1BplE-1730027720-1.0.1.1-QVEgIV0wYqQMdB9tSETpyGg4XDZPNt.TjKkH0A1Scrw
// https://chatgpt.com/c/671ccad5-eb64-8008-a9de-603a54192065
// https://reactrouter.com/en/main/start/examples
// https://github.com/remix-run/react-router/tree/dev/examples 
// https://chatgpt.com/c/6717f070-9a5c-8008-b136-88850e31dcf0
// https://chatgpt.com/c/672283a1-acac-8008-aa66-11a962bf3c6f

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


const router = createBrowserRouter([
	{
		path:"/",
		// element: <AuthProvider><Layout/></AuthProvider>,
		element: <Layout/>,
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
	}
]);


createRoot(document.getElementById('root')!).render(
  	<StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</StrictMode>,
)