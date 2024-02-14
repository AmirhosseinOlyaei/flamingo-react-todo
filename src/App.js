import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import TodoContainer from "./components/TodoContainer";
import TaskGeneration from "./components/TaskGeneration";
import Chat from "./components/Chat";
import Navbar from "./components/Navbar";

// Create a new component for conditional rendering
const ConditionalNavbar = () => {
  const location = useLocation();

  // Check if the current path is '/' to hide the Navbar
  if (location.pathname === "/") {
    return null;
  }

  return <Navbar />;
};
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <ConditionalNavbar />
                <Login />
              </>
            }
          />
          <Route
            path="/home"
            element={
              <>
                <ConditionalNavbar />
                <LandingPage />
              </>
            }
          />
          <Route
            path="/todolist"
            element={
              <>
                <ConditionalNavbar />
                <TodoContainer />
              </>
            }
          />
          <Route
            path="/new"
            element={
              <>
                <ConditionalNavbar />
                <h1>New Todo List</h1>
              </>
            }
          />
          <Route
            path="/generate-tasks"
            element={
              <>
                <ConditionalNavbar />
                <TaskGeneration />
              </>
            }
          />
          <Route
            path="/chat"
            element={
              <>
                <ConditionalNavbar />
                <Chat />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
