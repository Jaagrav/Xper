import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';

import Authpage from './pages/authpage';
import Projectspage from './pages/projectspage';
import Editorpage from './pages/editorpage';
import Deploypage from './pages/deploypage';

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/auth" component={Authpage} />
        <Route exact path="/" component={Projectspage} />
        <Route exact path="/edit/:UID/:projectID" component={Editorpage} />
        <Route exact path="/deploy/:UID/:projectID" component={Deploypage} />
      </Router>
    </div>
  );
}

export default App;
