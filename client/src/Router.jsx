import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./Pages/LandingPage";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import NotFound from "./Pages/NotFound";
import CreatePost from "./Pages/CreatePost";
import Logout from "./Pages/Logout";
import Profile from "./Pages/Profile";
import FlashMessage from "./components/FlashMessage";

const Router = () => {
  return (
    <>
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
          <Route path="*" exact Component={NotFound} /> {/*  NOT FOUND 404 */}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
