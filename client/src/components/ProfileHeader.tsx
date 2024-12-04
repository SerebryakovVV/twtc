import { useSelector } from "react-redux"
import { RootState } from "../store"

export default function ProfileHeader() {

    const authUsername = useSelector((state: RootState) => state.auth.username);
    const authID = useSelector((state: RootState) => state.auth.id);

    return(
        <div className="flex p-2 border-b border-zinc-300">
            <div className="w-[100px] h-[100px]">
                <img className="w-[100px] h-[100px] rounded-md" src="/kitty.png" alt="" />
            </div>
            <div className="grow">
                <div>
                    {authUsername}
                </div>
                <div>
                    stats for {authID}id like number of subscribers and number of posts 
                </div>
            </div>
        </div>
    )
}