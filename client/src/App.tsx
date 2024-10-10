import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Login/>
      {/* <Register/> */}
    </>
  )
}

export default App
