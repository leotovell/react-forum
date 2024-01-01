import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import NotFound from "./Pages/NotFound";
import CreatePost from "./Pages/CreatePost";
import Logout from "./Pages/Logout";
import Profile from "./Pages/Profile";
import Forum from "./Pages/Forum";
import FlashMessage from "./components/FlashMessage";
import NavBar from "./components/NavBar";
import { AuthProvider } from "./components/AuthProvider";

const Router = () => {
  return (
    <>
      <AuthProvider>
        <NavBar />
        <FlashMessage />
        <BrowserRouter>
          <Routes>
            <Route path="/" exact Component={LandingPage} />
            <Route path="/register" exact Component={Register} />
            <Route path="/login" exact Component={Login} />
            <Route path="/create-post" exact Component={CreatePost} />
            <Route path="/logout" exact Component={Logout} />
            <Route path="/profile" exact Component={Profile} />
            <Route path="/profile/:id" exact Component={Profile} />
            <Route path="/forum/:id" exact Component={Forum} />
            <Route path="*" exact Component={NotFound} /> {/*  NOT FOUND 404 */}
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
};

export default Router;
