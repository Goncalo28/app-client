import React from "react"
import { Redirect, Route, Switch } from "react-router-dom";
import AuthService from "./utils/auth";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Home from './components/Home'
import Signup from "./components/auth/Signup";
import Feed from "./components/Feed";

class App extends React.Component {
  state = {
    loggedInUser: null,
  };

  setCurrentUser = (user) => {
    this.setState({
      loggedInUser: user,
    });
  };

  componentDidMount() {
    if (this.state.loggedInUser === null) {
      const authService = new AuthService();
      authService.loggedin().then((response) => {
        if (response.data._id) {
          this.setCurrentUser(response.data);
        } else {
          localStorage.removeItem("loggedInUser");
        }
      });
    }
  }

  render() {
    return (
      <div className="App">
        <ToastContainer />
        {/* <Navbar
          loggedInUser={this.state.loggedInUser}
          setCurrentUser={this.setCurrentUser}
        /> */}
        <Switch>
          <Route exact path="/" render={
            () => {
              return <Home loggedInUser={this.state.loggedInUser} setCurrentUser={this.setCurrentUser} />
            }
          } />
          <Route path="/feed" component={Feed} />
        </Switch>
      </div>
    );
  }
}

export default App;

