import { useEffect, useState } from "react"


const getUser = async () => {
	const user = await fetch("api");
	return user;

}


export default function UserProfile() {

	const [user, setUser] = useState();

    useEffect(()=>{

		getUser()

    }, []);


    return (
      <div>             {/* user profile page, functionality depends on the role */}

            <div>           {/* header with profile pic, name, subs count, posts count, sub button, something else idk */}
                
            </div>


            <div>  {/* just a scrollable of posts, depending on role can delete and create new posts */}

                    <div>       {/* post */}

                    </div>
            </div>
        
      </div>
    )
  }