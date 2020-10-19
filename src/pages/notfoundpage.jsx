import React from 'react'
import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles';

import NotFoundIllustration from '../components/notfound.svg'

const useStyles = makeStyles((theme) => ({
    brandingName: {
        position: 'absolute',
        fontFamily: "'Orbitron', sans-serif",
        height: "fit-content",
        width: "fit-content",
        fontSize: '45px',
        color: '#50C0FF',
        margin: 'auto',
        top: '15px',
        left: '15px',
    },
    nfi: {
        position: "absolute",
        margin: 'auto',
        width: 'calc(100% - 40%)',
        top: '0',
        right: '0',
        left: '0',
        bottom: '0',
    },
    notfound: {
        position: "absolute",
        height: 'fit-content',
        width: 'fit-content',
        margin: 'auto',
        color: '#50C0FF',
        right: '0',
        left: '0',
        bottom: 50,
        fontFamily: "'Orbitron', sans-serif",
        fontSize: '45px',
    }
}))
function Notfoundpage() {
    document.title = 'Not Found - Xper';

    const classes = useStyles();

    return (
        <div>
            <Link to="/"><div className={classes.brandingName}>Xper</div></Link>
            <img alt="File Not Found" src={NotFoundIllustration} className={classes.nfi} />
            <Link to="/"><div className={classes.notfound}>Not Found</div></Link>
        </div>
    )
}

export default Notfoundpage;
