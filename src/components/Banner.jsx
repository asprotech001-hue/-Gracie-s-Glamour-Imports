import { useNavigate } from "react-router-dom";
import "./Banner.css";

export default function Banner(){

const navigate = useNavigate();

return(

<section className="banner">

<div>

<h1>

UP TO 40% OFF

</h1>

<p>

New Imported Collections

</p>

<button onClick={() => navigate("/shop")}>

SHOP NOW

</button>

</div>

</section>

)

}
