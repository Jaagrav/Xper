import React from 'react'
import { useHistory } from 'react-router-dom';

import firebase from '../components/firebase';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import Illustration1 from '../components/authpageillustration.svg';

const useStyles = makeStyles((theme) => ({
    authButton: {
        height: "fit-content",
        width: "fit-content",
        backgroundColor: "#3B4353",
        color: "#A3F7BF",
        padding: "10px 10px",
        "&:hover": {
            backgroundColor: "#1D2431"
        },
        position: "absolute",
        margin: "auto",
        top: "50px",
        right: "0",
        left: "0",
        bottom: "0",
    },
    brandingName: {
        fontFamily: "'Orbitron', sans-serif",
        color: "#A3F7BF",
        height: "fit-content",
        width: "fit-content",
        fontSize: "3rem",
        position: "absolute",
        margin: "auto",
        top: "0",
        right: "0",
        left: "0",
        bottom: "100px",
    },
    topBar: {
        height: "7px",
        width: "100%",
        position: "absolute",
        margin: "auto",
        top: "0",
        right: "0",
        left: "0",
        backgroundColor: "#A3F7BF"
    }
}));

function Authpage() {
    document.title = "Auth - Xper";
    const classes = useStyles();
    let history = useHistory();

    let handleSignIn = e => {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
    }

    React.useEffect(() => {
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser)
                history.push("/");
        });
    }, []);

    return (
        <div>
            <div className={classes.topBar}></div>
            <div className={classes.brandingName}>Xper</div>
            <Button className={classes.authButton} onClick={handleSignIn}>Sign In with Google</Button>
            <img src={Illustration1} className={"auth-illustration"} alt="auth illustration" />
        </div>
    )
}

export default Authpage;
