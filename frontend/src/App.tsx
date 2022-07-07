import MainPage from "./pages/main_page";
import SecondPage from "./pages/second_page";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/liquidity_page" element={<SecondPage/>} />


      
      </Routes>

    </BrowserRouter>
  );
}

export default App;

