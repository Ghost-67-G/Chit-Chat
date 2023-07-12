import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import ChatPage from "./Pages/ChatPage";
import VerifyEmail from "./Pages/verifyEmail";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
