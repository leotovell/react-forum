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
import CreateForum from "./Pages/CreateForum";
import Search from "./Pages/Search";

const Router = () => {
  return (
    <>
      <AuthProvider>
        <NavBar />
        <FlashMessage />
        <BrowserRouter>
          <Routes>
            <Route path="/" exact Component={LandingPage} />
            {/* User */}
            <Route path="/register" exact Component={Register} />
            <Route path="/login" exact Component={Login} />
            <Route path="/profile" exact Component={Profile} />
            <Route path="/profile/:id" exact Component={Profile} />
            <Route path="/logout" exact Component={Logout} />
            {/* Forums */}
            <Route path="/search" exact Component={Search} />
            <Route path="/create-forum" exact Component={CreateForum} />
            <Route path="/forum/:url" exact Component={Forum} />
            <Route
              path="/forum/:url/create-post"
              exact
              Component={CreatePost}
            />
            {/* Error 404 */}
            <Route path="*" exact Component={NotFound} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
};

export default Router;
