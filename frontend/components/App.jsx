import React from 'react';
import Slides from './Slides';
import SplashPage from './SplashPage';
import { Switch, Route } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={SplashPage}/>
        <Route exact path='/lookup/:diseaseName' component={Slides}/>
      </Switch>
    )
  }
}

export default App;
