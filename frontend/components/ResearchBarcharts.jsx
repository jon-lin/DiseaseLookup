import React from 'react';
import * as d3 from 'd3';
import { meshDiseaseCategories } from './meshDiseaseCategories';

class ResearchBarcharts extends React.Component {
  constructor(props) {
    super(props);

    this.dataset = {
      [props.diseaseName]: {
        key: props.diseaseName,
        pubmedHits: 0,
        trialsHits: 0
      }
    };

    this.state = {pubmedHits: "...", trialsHits: "...", loading: true};

    this.barchartsInitialized = false;
  }

  getHits(diseaseName) {
    let pubReq = $.ajax('/pubmed/hits', { data: { diseaseName }});

    let trialReq = $.ajax('/clinicaltrials', { data: {
                      diseaseName,
                      onlyGetHits: true
                    }});

    Promise.all([pubReq, trialReq]).then(values => {
      if (!this.dataset[diseaseName]) {
        this.dataset[diseaseName] = {};
      }
      this.dataset[diseaseName].key = diseaseName;
      this.dataset[diseaseName].pubmedHits = values[0].count;
      this.dataset[diseaseName].trialsHits = values[1][0].hits;

      if (this.barchartsInitialized) {
        this.updateBarcharts();
      } else {
        this.barchartsInitialized = true;
        this.state.loading = false;

        this.setState({
          pubmedHits: values[0].count,
          trialsHits: values[1][0].hits
        }, this.createBarcharts)
      }

    });
  }

  componentDidMount() {
    this.getHits(this.props.diseaseName);
  }

  updateBarcharts() {

  }

  createBarcharts() {

  }

  createBarchart(domID) {
    // let w = $('#barchartsPanel').width();
    // let h = $('#barchartsPanel').height()/2;

    // let svg = d3.select("#pubmedBarchart")
    //             .attr("viewBox", `0 0 ${w} ${h}`);


  }

  changeHandler() {

  }

  render() {
    let diseaseName = this.props.diseaseName;
    let { pubmedHits, trialsHits } = this.state;
    let diseaseSpan = <span className="slideTitleColorText">{`"${diseaseName}"`}</span>;
    let pubmedSpan = <span className="slideTitleColorText">{pubmedHits.toLocaleString()}</span>;
    let trialsSpan = <span className="slideTitleColorText">{trialsHits.toLocaleString()}</span>;
    let dateSpan = <span className="slideTitleColorText">2015-2016</span>;
    let pubmedURL = `https://www.ncbi.nlm.nih.gov/pubmed`;
    let trialsURL = `https://clinicaltrials.gov/`;
    let pubmedLink = <a className='slideLink pubmedLink' href={pubmedURL} target="_blank">PubMed</a>;
    let trialsLink = <a className='slideLink trialsLink' href={trialsURL} target="_blank">clinicaltrials.gov</a>;
    let loadingDiv = <div className='loadingDiv'><img src="./loading.svg" /></div>;

    return (
      <div id='innerBarchartsSlideContainer'>
        <div className="slideTitleContainer">
          <div className="slideTitle">
            {diseaseSpan} is a major topic of {pubmedSpan} {pubmedLink} journal articles, with {trialsSpan} clinical trials listed on {trialsLink} for {dateSpan}
          </div>
          {this.state.loading && loadingDiv}
        </div>

        <div id='barchartsSlideBottomContainer'>
          <div id="addDiseasePanel">
            <div id="instructionsToAddDisease">
              Compare the numbers to other disease categories. Submit a selection to add it to the barcharts.
            </div>

            <div id="addDiseaseDropdownAndButton">
              <select onChange={this.changeHandler}
                      size='26'
                      className="diseasesDropdown barchartsPanel">
                {meshDiseaseCategories.map(disease =>
                  <option key={disease}>{disease}</option>
                )}
              </select>

              <div className="submitDiseaseName barchartsPanel">Submit</div>
            </div>
          </div>

          <div id="barchartsPanel">
            <svg id="pubmedBarchart"></svg>
            <svg id="trialsBarchart"></svg>
          </div>
        </div>
      </div>
    )
  }

}

export default ResearchBarcharts;
