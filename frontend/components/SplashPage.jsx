import React from 'react';
// import DiseasesDropdown from './DiseasesDropdown';
import { Link } from 'react-router-dom';
import { meshDiseaseCategories } from './meshDiseaseCategories';

class SplashPage extends React.Component {
  constructor() {
    super()
    this.state = { diseaseSelected: "Cardiovascular Diseases" };
    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(e) {
    this.setState({diseaseSelected: e.currentTarget.value});
  }

  render() {

    return (
      <div id='SplashPage'>
        <div>
          <h1>DiseaseLookup</h1>
        </div>

        <select onChange={this.changeHandler} size='5' id="diseasesDropdown">
          {meshDiseaseCategories.map(disease =>
            <option key={disease}>{disease}</option>
          )}
        </select>

        <Link to={`/lookup/${this.state.diseaseSelected}`}>Submit</Link>
      </div>
    )
  }

}

export default SplashPage;
