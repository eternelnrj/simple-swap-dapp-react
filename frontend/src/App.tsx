import SwapPage from "./pages/main_page";
import LiquidityPage from "./pages/second_page";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SwapPage/>}/>
        <Route path="/liquidity_page" element={<LiquidityPage/>} />      
      </Routes>
    </BrowserRouter>
  );
}

export default App;

