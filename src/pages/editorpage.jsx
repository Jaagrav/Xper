import React from 'react';
import { useHistory, Link } from 'react-router-dom';

import firebase from '../components/firebase';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-nord_dark";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-javascript";

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import ShareIcon from '@material-ui/icons/Share';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import LaunchIcon from '@material-ui/icons/Launch';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    header: {
        position: 'absolute',
        height: '50px',
        width: '100%',
        margin: 'auto',
        top: 0,
        right: 0,
        left: 0,
        backgroundColor: '#A3F7BF',
        zIndex: 1
    },
    brandingName: {
        position: 'absolute',
        fontFamily: "'Orbitron', sans-serif",
        height: "fit-content",
        width: "fit-content",
        fontSize: '25px',
        fontWeight: '600',
        color: '#3B4353',
        margin: 'auto',
        top: '0',
        left: '15px',
        bottom: '0'
    },
    photoURL: {
        height: '50px',
        width: '50px',
        position: 'absolute',
        margin: 'auto',
        top: '0',
        right: '5px',
        bottom: '0'
    },
    root: {
        transform: 'translateZ(0px)',
        flexGrow: 1,
    },
    exampleWrapper: {
        position: 'relative',
        marginTop: theme.spacing(3),
        height: 380,
    },
    radioGroup: {
        margin: theme.spacing(1, 0),
    },
    speedDial: {
        position: 'absolute',
        top: 5,
        right: 0
    },
    codeName: {
        position: 'absolute',
        margin: 'auto',
        fontSize: '1rem',
        fontWeight: '600',
        fontFamily: '"Comfortaa", sans-serif',
        top: '0',
        bottom: '0',
        right: '60px',
        height: '30px',
        color: '#3B4353 !important',
        textAlign: 'right',
        backgroundColor: 'transparent',
        outline: 'none',
        border: 'none'
    },
    editorsTabs: {
        position: 'absolute',
        width: '369px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(100px, 1fr))',
        zIndex: 2,
        [theme.breakpoints.down("sm")]: {
            width: '100%',
            top: '50px',
            zIndex: 0,
        },
    },
    tabs: {
        cursor: 'pointer',
        height: '100%',
        width: '100%',
        fontSize: '1rem',
        color: '#A3F7BF',
        fontFamily: '"Comfortaa", sans-serif',
        textAlign: 'center',
        padding: '16px 0',
        marginRight: '3px',
        display: 'inline-block',
        backgroundColor: "#3B4353",
        "&.selected": {
            backgroundColor: "#2E3440 !important",
            cursor: 'auto'
        },
        "&:hover": {
            backgroundColor: "#434b5b",
        }
    },
    dragToOutput: {
        position: 'absolute',
        margin: 'auto',
        cursor: 'w-resize',
        height: '50px',
        width: '50px',
        backgroundColor: '#3b4353',
        borderRadius: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 15,
        right: 477,
        [theme.breakpoints.down("sm")]: {
            right: 15,
        },
        zIndex: '2'
    },
    editor: {
        position: 'absolute',
        height: 'calc(100% - 50px)',
        width: '100%',
        margin: 'auto',
        top: '50px',
        right: '0',
        left: '0',
        zIndex: '0',
        [theme.breakpoints.down("sm")]: {
            height: 'calc(100% - 100px)',
            top: '100px',
        },
    },
    iframe: {
        position: 'absolute',
        height: '100%',
        margin: 'auto',
        right: '0',
        top: '0',
        bottom: '0',
        outline: 0,
        border: 0,
        backgroundColor: 'white',
        zIndex: 4,
        [theme.breakpoints.down("sm")]: {
            transition: '0.4s', width: '0%',
        },
    },
    editors: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        margin: 'auto',
        top: 0,
        left: 0,
        bottom: 0,

    }
}));

function Editorpage(props) {
    document.title = "Code Editor - Xper";
    const classes = useStyles();
    let history = useHistory();
    let mouseDown = false;
    let codeName = React.useRef();
    let html = '', css = '', js = '';
    let htmlTabRef = React.useRef(), cssTabRef = React.useRef(), jsTabRef = React.useRef();
    let htmlEditorRef = React.useRef(), cssEditorRef = React.useRef(), jsEditorRef = React.useRef(), editors = React.useRef();
    let dragToIframeRef = React.useRef();

    let firebaseRef = React.useRef();
    const [loadCode, setLoadCode] = React.useState(false);

    const [displayName, setDisplayName] = React.useState("");
    const [userPhoto, setUserPhoto] = React.useState("");
    const [letEdit, setLetEdit] = React.useState(false);

    let userID = props.match.params.UID, projectID = props.match.params.projectID;

    React.useEffect(() => {
        firebase.auth().onAuthStateChanged(firebaseUser => {
            // else if (snap.exists()) history.push("/notfound")
            if (firebaseUser) {
                if (firebaseUser.uid === userID) {
                    // console.log(firebaseUser);
                    setUserPhoto(firebaseUser.photoURL);
                    setDisplayName(firebaseUser.displayName);
                    firebaseRef.current = firebase.database().ref("WebDev/" + userID + "/" + projectID)
                    firebaseRef.current.once("value").then(snap => {
                        if (snap.key === projectID) {
                            html = snap.val().html;
                            css = snap.val().css;
                            js = snap.val().js;
                            setLoadCode(!loadCode);
                            codeName.current.value = snap.val().name;
                            htmlEditorRef.current.editor.setValue(html);
                            cssEditorRef.current.editor.setValue(css);
                            jsEditorRef.current.editor.setValue(js);
                            updateIframe();
                        }
                    }).catch(error => {
                        console.warn('Contents not found!');
                        history.push("/notfound")
                    })
                }
                else {
                    setLetEdit(true);
                    firebase.database().ref("WebDev/" + userID).once('value').then(snap => {
                        if (!snap.exists())
                            history.push("/notfound")
                    })
                }
            }
            else
                history.push("/auth");
        });
        if (window.innerWidth >= 1024) {
            let widthOfIframe = Math.floor(((477 - 20) / window.innerWidth) * 100);
            document.getElementsByClassName(classes.iframe)[0].style.width = widthOfIframe + "%";
            editors.current.style.width = (100 - widthOfIframe) + "%";
            htmlEditorRef.current.editor.resize();
            cssEditorRef.current.editor.resize();
            jsEditorRef.current.editor.resize();
        }
    }, []);

    window.addEventListener('resize', e => {
        console.log("Window Resized!")
        if (window.innerWidth > 1000)
            window.location.reload(true);
    });

    function openTab(tabName) {
        htmlTabRef.current.classList.remove("selected");
        cssTabRef.current.classList.remove("selected");
        jsTabRef.current.classList.remove("selected");
        htmlEditorRef.current.refEditor.style.display = "none";
        cssEditorRef.current.refEditor.style.display = "none";
        jsEditorRef.current.refEditor.style.display = "none";
        switch (tabName) {
            case 'html':
                htmlTabRef.current.classList.add("selected");
                htmlEditorRef.current.refEditor.style.display = "block";
                break;
            case 'css':
                cssTabRef.current.classList.add("selected");
                cssEditorRef.current.refEditor.style.display = "block";
                break;
            case 'js':
                jsTabRef.current.classList.add("selected");
                jsEditorRef.current.refEditor.style.display = "block";
                break;
            default: console.log("Shit")
        }
    }

    function updateIframe() {
        firebaseRef.current.child("html").set(html)
        firebaseRef.current.child("css").set(css)
        firebaseRef.current.child("js").set(js)
        var old_element = document.getElementsByClassName(classes.iframe)[0];
        var new_element = old_element.cloneNode(true);
        old_element.parentNode.replaceChild(new_element, old_element);
        let output = new_element.contentWindow.document;
        let htmlDoc = "<html><style>" + css + "</style>" + html + "<script>" + js + "</script></html>";
        try {
            // output.contentWindow.location.reload(true);
            output.open();
            output.write(htmlDoc);
            output.close();
        } catch (e) {
            //Fuck You error
            console.log(e)
        }
    }
    function dragToShowIframe(e) {
        let mousePos = window.innerWidth - (e.clientX + 30);
        if (mouseDown && e.clientX > 40 && e.clientX < window.innerWidth - 40) {
            dragToIframeRef.current.style.right = mousePos + "px";
            let widthOfIframe = Math.floor(((mousePos - 20) / window.innerWidth) * 100);
            document.getElementsByClassName(classes.iframe)[0].style.width = widthOfIframe + "%";
            editors.current.style.width = (100 - widthOfIframe) + "%";
            htmlEditorRef.current.editor.resize();
            cssEditorRef.current.editor.resize();
            jsEditorRef.current.editor.resize();
        }
    }

    function htmlChanged(e) {
        html = e;
        updateIframe();
    }
    function cssChanged(e) {
        css = e;
        updateIframe();
    }
    function jsChanged(e) {
        js = e;
        updateIframe();
    }

    let iframeOpen = false;
    function openOutput() {
        if (window.innerWidth <= 1024) {
            console.log("Open Output")
            iframeOpen = !iframeOpen;
            document.getElementsByClassName(classes.iframe)[0].style.width = iframeOpen ? "100%" : "0%";

            setTimeout(() => {
                htmlEditorRef.current.editor.resize();
                cssEditorRef.current.editor.resize();
                jsEditorRef.current.editor.resize();
            }, 1000)
        }
        else {
            console.log("Do nothing")
        }
    }

    function changeCodeName(e) {
        firebaseRef.current.child("name").set(e.target.value);
    }



    function Speeddialreturn() {
        const [openSnackbar, setOpenSnackBar] = React.useState(false);
        const [snackBarText, setSnackBarText] = React.useState("Link Copied");
        const handleClose = (event, reason) => {
            if (reason === 'clickaway') {
                return;
            }

            setOpenSnackBar(false);
        };

        const [open, setOpen] = React.useState(false);
        function copyLink(e) {
            console.log("Copy Link")
            const copyTxt = document.createElement("input");
            copyTxt.value = "https://codersweb.netlify.app/" + e + "/" + userID + "/" + projectID;
            document.body.parentNode.appendChild(copyTxt);
            copyTxt.select();
            document.execCommand("copy")
            document.body.parentNode.removeChild(copyTxt);
            setSnackBarText(e.substring(0, 1).toUpperCase() + e.substring(1) + " Link Copied!")
            setOpenSnackBar(true);
        }

        function shareLink() {
            if (navigator.share) {
                navigator
                    .share({
                        title: codeName.current.value + " - Xper",
                        url: "https://codersweb.netlify.app/edit/" + userID + "/" + projectID
                    })
                    .then(() => {
                        console.log("Thanks for sharing!");
                    })
                    .catch(console.error);
            } else {
                console.log("support na re");
                copyLink("edit")
            }
        }

        const actions = [
            { icon: <HomeRoundedIcon onClick={() => { history.push('/') }} />, name: 'Home' },
            { icon: <LaunchIcon onClick={() => { window.open(("/deploy/" + userID + "/" + projectID + "/"), "_blank") }} />, name: 'Open Deployed Site' },
            { icon: <FileCopyIcon onClick={() => { copyLink("deploy") }} />, name: 'Copy Deploy Link' },
            { icon: <ShareIcon onClick={shareLink} />, name: 'Share Code Link' },
            { icon: <SaveIcon />, name: 'Save' },
        ];
        return (
            <div>
                <Snackbar open={openSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} autoHideDuration={2000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        {snackBarText}
                    </Alert>
                </Snackbar>
                <SpeedDial
                    ariaLabel="SpeedDial example"
                    className={classes.speedDial}
                    icon={<Avatar style={{ height: "30px", width: "30px" }} alt={displayName} src={userPhoto} />}
                    onClose={() => { setOpen(false) }}
                    onOpen={() => { setOpen(true) }}
                    open={open}
                    direction={"down"}
                    onClick={() => {/*do nothing*/ }}
                >
                    {
                        actions.map((action) => (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                            />
                        ))
                    }
                </SpeedDial>
            </div>
        )
    }

    function Loader() {
        const [openLoader, setOpenLoader] = React.useState(true);

        React.useEffect(() => {
            firebase.database().ref("WebDev/" + userID + "/" + projectID).once("value").then(snap => {
                setOpenLoader(false);
            });
        }, [])

        return (
            <Backdrop open={openLoader} style={{ zIndex: 5 }}>
                <CircularProgress style={{ color: '#A3F7BF' }} />
            </Backdrop>
        )
    }
    return (
        <div onMouseUp={() => { mouseDown = false; }} onMouseMove={dragToShowIframe}>
            <Loader />
            <div className={classes.header}>
                <Link to="/"><div className={classes.brandingName}>Xper</div></Link>
                <input ref={codeName} className={classes.codeName} onChange={changeCodeName} placeholder="Project Name" />
                <Speeddialreturn />
            </div>
            <div className={classes.editorsTabs}>
                <div className={classes.tabs + " selected"} ref={htmlTabRef} onClick={() => { openTab('html') }}>HTML</div>
                <div className={classes.tabs} ref={cssTabRef} onClick={() => { openTab('css') }}>CSS</div>
                <div className={classes.tabs} ref={jsTabRef} onClick={() => { openTab('js') }}>JS</div>
            </div>
            <div className={classes.editor} update={loadCode}>
                <div className={classes.editors} ref={editors}>
                    <AceEditor
                        placeholder="HTML goes here"
                        mode="html"
                        theme="nord_dark"
                        name="htmlEditor"
                        fontSize={18}
                        wrapEnabled={false}
                        ref={htmlEditorRef}
                        showPrintMargin={false}
                        showGutter={true}
                        highlightActiveLine={true}
                        value={html}
                        readOnly={letEdit}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: true,
                            showLineNumbers: true,
                        }}
                        onChange={htmlChanged}
                    />
                    <AceEditor
                        placeholder="CSS goes here"
                        mode="css"
                        theme="nord_dark"
                        name="cssEditor"
                        fontSize={18}
                        wrapEnabled={false}
                        ref={cssEditorRef}
                        showPrintMargin={false}
                        showGutter={true}
                        highlightActiveLine={true}
                        value={css}
                        readOnly={letEdit}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: true,
                            showLineNumbers: true,
                        }}
                        onChange={cssChanged}
                    />
                    <AceEditor
                        placeholder="JavaScript goes here"
                        mode="javascript"
                        theme="nord_dark"
                        name="jsEditor"
                        fontSize={18}
                        wrapEnabled={false}
                        ref={jsEditorRef}
                        showPrintMargin={false}
                        showGutter={true}
                        highlightActiveLine={true}
                        value={js}
                        readOnly={letEdit}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: true,
                            showLineNumbers: true,
                        }}
                        onChange={jsChanged}
                    />
                </div>
                <iframe
                    title=" "
                    className={classes.iframe}
                />
            </div>
            <Tooltip TransitionComponent={Zoom} title="Drag to see output" placement="left" onClick={openOutput} onMouseDown={() => { mouseDown = true; }} ref={dragToIframeRef}>
                <div className={classes.dragToOutput}>
                    <PlayArrowRoundedIcon style={{ color: "#A3F7BF" }} />
                </div>
            </Tooltip>
        </div>
    )
}

export default Editorpage;
