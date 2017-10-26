import React from 'react';
// import DiseasesDropdown from './DiseasesDropdown';
import { Link } from 'react-router-dom';
import Particles from 'react-particles-js';
import { meshDiseaseCategories } from './meshDiseaseCategories';

class SplashPage extends React.Component {
  constructor() {
    super()
    this.state = { diseaseSelected: "Animal Diseases" };
    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(e) {
    this.setState({diseaseSelected: e.currentTarget.value});
  }

  render() {

    return (
      <div id='SplashPage'>
        <Particles
          className='canvasWrapper'
          params={{ particles:
            {
              number: { value: 80, density: { enable: true } },
              color: { value: '#ead8ce' }
            }
          }}
        />

        <div id='splashTextContainer'>
          <h1>Welcome to DiseaseLookup</h1>
          <div id="splashFeaturesList">
            <div>See subcategories of a disease type</div>
            <div>Explore research stats</div>
            <div>Learn more about clinical trials</div>
          </div>
        </div>

        <div id="splashCenterPanel">
          <div id="panelTopText">Pick a disease category</div>

          <select onChange={this.changeHandler}
                  size='5'
                  className="diseasesDropdown splash">
            {meshDiseaseCategories.map(disease =>
              <option key={disease}>{disease}</option>
            )}
          </select>

          <Link
            className="submitDiseaseName"
            to={`/lookup/${this.state.diseaseSelected}`}>
            Submit
          </Link>
        </div>
      </div>
    )
  }

}

export default SplashPage;
