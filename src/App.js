import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';

import Authpage from './pages/authpage';
import Projectspage from './pages/projectspage';
import Editorpage from './pages/editorpage';
import Deploypage from './pages/deploypage';
import Notfoundpage from './pages/notfoundpage';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Projectspage} />
          <Route exact path="/auth" component={Authpage} />
          <Route exact path="/edit/:UID/:projectID" component={Editorpage} />
          <Route exact path="/deploy/:UID/:projectID" component={Deploypage} />
          <Route exact path="/notfound" component={Notfoundpage} />
          <Redirect to="/notfound" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
