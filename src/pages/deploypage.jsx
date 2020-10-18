import React from 'react';
import { useHistory } from 'react-router-dom';

import firebase from '../components/firebase';

import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

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
    },
    seeCode: {
        position: 'absolute',
        margin: 'auto',
        right: 15,
        bottom: 15,
        color: "#3B4353",
        backgroundColor: '#A3F7BF !important'
    }
}))
function Deploypage(props) {
    document.title = "Deploy - Xper";

    let history = useHistory();

    const classes = useStyles(); const iframeRef = React.useRef();

    let userID = props.match.params.UID, projectID = props.match.params.projectID;

    const [open, setOpen] = React.useState(true);

    React.useEffect(() => {
        firebase.database().ref("WebDev/" + userID + "/" + projectID).once("value").then(snap => {
            if (snap.key === projectID) {
                var old_element = document.getElementsByClassName(classes.iframe)[0];
                var new_element = old_element.cloneNode(true);
                old_element.parentNode.replaceChild(new_element, old_element);
                let output = new_element.contentWindow.document;
                let htmlDoc = "<style>" + snap.val().css + "</style>" + snap.val().html + "<script>" + snap.val().js + "</script>";
                try {
                    // output.contentWindow.location.reload(true);
                    output.open();
                    output.write(htmlDoc);
                    output.close();
                    setOpen(false);
                    document.title = output.title + ' - Xper';
                } catch (e) {
                    //Fuck You error
                    console.log(e)
                }
            }
        }).catch(error => {
            console.warn('Contents not found!');
            history.push("/notfound")
        })
        firebase.database().ref("WebDev/" + userID).on("child_changed", snap => {
            if (snap.key === projectID) {
                var old_element = document.getElementsByClassName(classes.iframe)[0];
                var new_element = old_element.cloneNode(true);
                old_element.parentNode.replaceChild(new_element, old_element);
                let output = new_element.contentWindow.document;
                let htmlDoc = "<style>" + snap.val().css + "</style>" + snap.val().html + "<script>" + snap.val().js + "</script>";
                try {
                    // output.contentWindow.location.reload(true);
                    output.open();
                    output.write(htmlDoc);
                    output.close();
                    document.title = output.title + ' - Xper';
                    setOpen(false);
                } catch (e) {
                    //Fuck You error
                    console.log(e)
                }
            }
        })
    }, [])
    return (
        <div>
            <Backdrop className={classes.backdrop} open={open} style={{ zIndex: 5 }}>
                <CircularProgress style={{ color: '#A3F7BF' }} />
            </Backdrop>
            <iframe
                title=" "
                className={classes.iframe}
                ref={iframeRef}
            />
            <Button className={classes.seeCode} onClick={() => { history.push("/edit/" + userID + "/" + projectID) }}>See Code</Button>
        </div>
    )
}

export default Deploypage;
