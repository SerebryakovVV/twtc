import {useState} from 'react'

// https://chatgpt.com/c/6716a293-c924-8008-bd87-197f3992430e
// https://chatgpt.com/c/6716a997-a5f4-8008-a7a0-6f63d2cd2dc9


export default function AuthProvider({children}:any) {

    const [logged, setLogged] = useState<boolean>(true);

    if (logged) {
   return   children    
    } else {
  return (
    // <div>AuthProvider</div>
    
     <div>not logged</div>
  )
}
}
