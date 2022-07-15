import '../App.css';
import Connect from "../Connect";
import Supply from "../Supply";
import Withdraw from "../Withdraw";
import { Link } from "react-router-dom";


function SecondPage() {
  return (
    <div className="App">
      
      <div className="App-header">
        <Connect />
        <Supply />
        <Withdraw />
        <Link to="/" className='main_page'>Swap Page</Link>
      </div>
     
    </div>
  );
}

export default SecondPage;

