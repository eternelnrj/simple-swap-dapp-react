import React from 'react';
import logo from './logo.svg';
import '../App.css';
import Connect from "../Connect";
import Swap from "../Swap";
import Supply from "../Supply";
import Withdraw from "../Withdraw";
import background from "./background3.jpg"
import { Outlet, Link } from "react-router-dom";


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

