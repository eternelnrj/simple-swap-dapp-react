import '../App.css';
import Connect from "../Connect";
import Swap from "../Swap";
import { Link } from "react-router-dom";


function MainPage() {
  return (
    <div className="App">
      
      <div className="App-header">
      <Connect />
      <Swap/>
      <Link to="/liquidity_page" className='second_page'>Liquidity Page</Link>

      </div>
    </div>
  );
}

export default MainPage;

