import React from 'react';

import firebase from '../components/firebase';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    iframe: {
        position: 'absolute',
        margin: 'auto',
        height: '100%',
        width: '100%',
        top: '0',
        right: '0',
        left: '0',
        bottom: '0',
        outline: 0,
        border: 0,
        backgroundColor: 'white',
    }
}))
function Deploypage(props) {
    document.title = "Deploy - WebDev";
    const classes = useStyles(); const iframeRef = React.useRef();

    let userID = props.match.params.UID, projectID = props.match.params.projectID;

    React.useEffect(() => {
        firebase.database().ref("WebDev/" + userID + "/" + projectID).once("value").then(snap => {
            if (snap.key === projectID) {
                let output = document.getElementsByClassName(classes.iframe)[0];
                let htmlDoc = "<style>" + snap.val().css + "</style>" + snap.val().html + "<script>" + snap.val().js + "</script>";
                try {
                    output.src = "about:blank";
                    output.srcdoc = (htmlDoc);
                } catch (e) {
                    //Fuck You error
                    console.log(e)
                }
                setTimeout(() => { document.title = output.contentWindow.document.title; }, 100);
            }
        })
        firebase.database().ref("WebDev/" + userID).on("child_changed", snap => {
            if (snap.key === projectID) {
                let output = document.getElementsByClassName(classes.iframe)[0];
                let htmlDoc = "<style>" + snap.val().css + "</style>" + snap.val().html + "<script>" + snap.val().js + "</script>";
                try {
                    output.src = "about:blank";
                    output.srcdoc = (htmlDoc);
                    document.title = output.contentWindow.document.title;
                } catch (e) {
                    //Fuck You error
                    console.log(e)
                }
            }
        })
    }, [])
    return (
        <div>
            <iframe
                title=" "
                className={classes.iframe}
            />
        </div>
    )
}

export default Deploypage;
