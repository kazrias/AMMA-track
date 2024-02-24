import "./App.css";

import { useEffect } from "react";

import { Header } from "./components/Header/Header";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import MainPage from "./pages/MainPage";
import BoardsPage from "./pages/BoardsPage/BoardsPage";
import BoardPage from "./pages/BoardPage/BoardPage";
import NotFound from "./pages/NotFound";

import { login } from "./redux/slices/authenticationSlice";
import { useDispatch } from "react-redux";

import { Route, Routes } from "react-router-dom";


function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const isLoggedIn = window.localStorage.getItem("isLoggedIn");
    if (isLoggedIn && isLoggedIn === "ON") {
      dispatch(login(JSON.parse(window.localStorage.getItem("loggedUser"))));
    }
  }, [dispatch]);

  return (
    <>

      <Header />
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/workspaces" element={<BoardsPage />} />
          <Route path="/workspaces/:id" element={<BoardPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
