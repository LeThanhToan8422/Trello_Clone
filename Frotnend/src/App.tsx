import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import "./styles/app.css";
import SignUp from "./components/SignUp";
import Board from "./components/Board";
import BoardList from "./components/BoardList";
import { useLoginStore } from "./zustand/loginStore";
import "./styles/BoardList.css";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const isLoggedIn = useLoginStore((state) => state.isLoggedIn);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/boards" /> : <Login />}
          />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/boards"
            element={
              <PrivateRoute>
                <BoardList />
              </PrivateRoute>
            }
          />
          <Route
            path="/board/:boardId"
            element={
              <PrivateRoute>
                <Board />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/boards" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
