import { Search } from "lucide-react";
import "./SearchBar.css";

export default function SearchBar() {

return(

<div className="search-box">

<input

type="text"

placeholder="Search products..."

/>

<Search/>

</div>

)

}