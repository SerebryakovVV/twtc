import {useState} from 'react'

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
