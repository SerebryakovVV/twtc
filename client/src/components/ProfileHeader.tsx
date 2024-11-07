export default function ProfileHeader() {
    return(
        <div className="flex p-2">
            <div className="w-[100px] h-[100px]">
                <img className="w-[100px] h-[100px] rounded-md" src="kitty.png" alt="" />
            </div>
            <div className="grow">
                <div>
                    username
                </div>
                <div>
                    stats
                </div>
            </div>
        </div>
    )
}