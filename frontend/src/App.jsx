import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import ChatsPage from "./Pages/ChatsPage";

function App() {
  return (
    <>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chats" element={<ChatsPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
