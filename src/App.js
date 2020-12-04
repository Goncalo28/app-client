import React from "react"
import { Route, Switch } from "react-router-dom";
import AuthService from "./utils/auth";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Home from './components/Home';
import NavDrawer from './components/NavDrawer';
import Profile from './components/Profile'
import UsersProfile from './components/UsersProfile'
import Dashboard from "./components/Dashboard";
// import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

class App extends React.Component {
  state = {
    loggedInUser: null,
  };

  // theme = createMuiTheme({
  //   palette: {
  //     type: 'dark'
  //   },
  // })

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
        {/* <ThemeProvider theme={this.theme}> */}

        <ToastContainer />
        {/* <Navbar
          loggedInUser={this.state.loggedInUser}
          setCurrentUser={this.setCurrentUser}
        /> */}
        <NavDrawer loggedInUser={this.state.loggedInUser} setCurrentUser={this.setCurrentUser} />
        <Switch>
          <Route exact path="/" render={
            () => {
              return <Home loggedInUser={this.state.loggedInUser} setCurrentUser={this.setCurrentUser} />
            }
          } />
          <Route path="/dashboard" render={
            () => {
              return <Dashboard loggedInUser={this.state.loggedInUser} setCurrentUser={this.setCurrentUser} />
            }
          } />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/profile/:id" component={UsersProfile} />
        </Switch>
        {/* </ThemeProvider> */}
      </div>
    );
  }
}

export default App;

