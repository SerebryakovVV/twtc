import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";

export default function SearchSidebar() {

    const [searchString, setSearchString] = useState<string>("")

    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchString.length === 0) return;
        navigate("/profile/"+searchString);
        console.log(searchString);
        setSearchString("");
    }

    return (
        <div className="w-[200px] bg-zinc-100 border-l border-zinc-300 pl-1 pr-1">
            <div className="flex border-b border-zinc-300">
                <input 
                    value={searchString}
                    onChange={(e)=>setSearchString(e.target.value.length > 20 ? e.target.value.slice(0, 20) : e.target.value)}
                    className="w-[160px] h-9 mt-[3px] p-1 bg-zinc-100 focus:outline-none"
                    type="text" 
                    placeholder="Search"
                />
                <span 
                    className="w-[40px] shrink-0 pt-3 pl-1"
                    onClick={handleSearch}
                >
                    <IoIosSearch size={"25px"}/>
                </span>
            </div>
        </div>
    )
}
  