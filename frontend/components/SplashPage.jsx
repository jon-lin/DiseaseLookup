import React from 'react';
import { Link } from 'react-router-dom';
import { meshDiseaseCategories } from './meshDiseaseCategories';

class SplashPage extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <div>Welcome to splash page!</div>
        <Link to={`/lookup/Cardiovascular Diseases`}>Cardiovascular Diseases</Link>
      </div>
    )
  }

}

export default SplashPage;
