import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'

// https://chatgpt.com/c/6717f070-9a5c-8008-b136-88850e31dcf0
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Login/> */}
      <Register/>
    </>
  )
}

export default App
