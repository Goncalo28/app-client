import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MailIcon from '@material-ui/icons/Mail';
import AuthService from '../utils/auth';
import Search from './Search';

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth + 10,
    },
    usersDrawerPaper: {
        width: drawerWidth + 50,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

const NavDrawer = props => {

    const logoutUser = () => {
        const authService = new AuthService();
        authService.logout()
            .then(() => {
                props.setCurrentUser(null);
                localStorage.removeItem('loggedInUser');
                props.history.push('/');
            })
    }

    let classes = useStyles();

    if (props.loggedInUser !== null) {

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar} style={{ backgroundColor: '#63BCE5' }}>
                    <Toolbar style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" >App</Typography>
                        <Typography variant='h6' > Hey {props.loggedInUser.username} 👋</Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <Toolbar />
                    <div className={classes.drawerContainer}>
                        <List>
                            <ListItem button>
                                <NavLink
                                    style={{ height: '100%', width: '100%', textDecoration: 'none', color: 'black', fontSize: 18 }}
                                    exact to="/dashboard">
                                    Home
                                </NavLink>
                                <HomeIcon style={{ marginRight: '7%' }} />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <NavLink
                                    style={{ width: '100%', textDecoration: 'none', color: 'black', fontSize: 18 }}
                                    exact to="/profile">
                                    Profile
                                </NavLink>
                                <PersonIcon style={{ marginRight: '7%' }} />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <NavLink
                                    style={{ width: '100%', textDecoration: 'none', color: 'black', fontSize: 18 }}
                                    exact to="/chat">Chat</NavLink>
                                <MailIcon style={{ marginRight: '7%' }} />
                            </ListItem>
                            <Divider />
                            <ListItem button onClick={logoutUser}>
                                <NavLink
                                    style={{ width: '100%', textDecoration: 'none', color: 'black', fontSize: 18 }}
                                    exact to="/">
                                    Logout
                                </NavLink>
                                <ExitToAppIcon style={{ marginRight: '7%' }} />
                            </ListItem>
                            <Divider />
                        </List>
                    </div>
                </Drawer>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    anchor="right"
                    classes={{
                        paper: classes.usersDrawerPaper,
                    }}
                >
                    <Toolbar />
                    <div className={classes.drawerContainer}>
                        <List>
                            <ListItem>
                                <Search />
                            </ListItem>
                        </List>
                    </div>
                </Drawer>
                <main className={classes.content}>
                    <Toolbar />
                </main>
            </div>
        );
    } else {
        return null
    }
}

export default withRouter(NavDrawer);
