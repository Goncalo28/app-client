import React from 'react';
import Login from './auth/Login';
import "../index.css";
import { Grid, Paper, makeStyles, Typography } from '@material-ui/core';
import './home.css';
import { withRouter } from 'react-router-dom';

const Home = (props) => {

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            background: "lightBlue",
            width: theme.spacing(100),
            height: theme.spacing(100),
            marginTop: theme.spacing(0.5),
        },
    }));

    const classes = useStyles();

    return (
        <div style={{ backgroundImage: "url('../images/home-background.jpg')", backgroundSize: "cover", backgroundRepeat: "no-repeat", flexWrap: 'wrap' }} className='home-container'>
            <Grid container spacing={0}
                direction="row"
                justify="center"
                alignItems="center"
            >
                <Grid item xs={6} style={{ paddingLeft: 10, paddingRight: 10 }}>
                    <div className="wrapper" style={{ display: 'flex', alignItems: 'left', justifyContent: 'space-around', flexDirection: 'column' }}>
                        <div className="one" style={{ paddingLeft: 10, marginTop: 20 }}>
                            <Typography variant='h3'>Investor</Typography>
                            <Typography variant='h5'>As an investor, find projects and people you are willing to take a chance on!</Typography>
                        </div>
                        <div className="two" style={{ paddingLeft: 10, marginTop: 20 }}>
                            <Typography variant='h3'>Innovator</Typography>
                            <Typography variant='h5'>As a creator, put your idea out there so that your dream can come through with the help of investors!</Typography>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={6} style={{ display: 'flex' }}>
                    <Paper className={classes.paper}>
                        <Login loggedInUser={props.loggedInUser} setCurrentUser={props.setCurrentUser} />
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default withRouter(Home);
