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

    this.barcharts = {};

    this.state = {
      pubmedHits: "...",
      trialsHits: "...",
      loading: true,
      loadingDiv: <div className='loadingDiv'><img src="./loading.svg" /></div>,
      selectedDisease: null,
    };

    this.barchartsInitialized = false;

    this.changeHandler = this.changeHandler.bind(this);
    this.clickHander = this.clickHander.bind(this);
  }

  componentDidMount() {
    this.getHits(this.props.diseaseName);
  }

  getHits(diseaseName) {
    if (this.barchartsInitialized) {
      $('#barchartsPanel').append(`<div class='loadingDiv jquery'><img src="./loading.svg" /></div>`);
    }

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
        $('.loadingDiv').remove();
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

  createBarcharts() {
    this.createBarchart('pubmedBarchart');
    this.createBarchart('trialsBarchart');
  }

  createBarchart(svgID) {
    let w = $('#barchartsPanel').width();
    let h = $('#barchartsPanel').height()/2;
    let p = {top: 40, left: 50, right: 15, bottom: 30};

    let dataset = Object.values(this.dataset);

    let svg = d3.select("#" + svgID)
                .attr("viewBox", `0 0 ${w} ${h}`);

    let labels = dataset.map(d => d.key);
    let colors = d3.scaleOrdinal(d3.schemeCategory10);

    let title, dataKey;
    if (svgID === 'pubmedBarchart') {
      title = 'Hits on PubMed';
      dataKey = 'pubmedHits'
    } else {
      title = 'Hits on ClinicalTrials.gov';
      dataKey = 'trialsHits';
    }

    //create title
    svg.append("text")
       .attr("x", w/2)
       .attr("y", 30)
       .text(title)
       .attr("text-anchor", "middle")
       .attr("font-family", "sans-serif")
       .attr("font-size", "15px");

    //create scales and axes
    let xScale = d3.scaleBand()
                   .domain(labels)
                   .range([p.left, w - p.right])
                   .paddingInner(0.2);

    let xAxis = d3.axisBottom(xScale);

    let gx = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (h - p.bottom) + ")")
                .call(xAxis);

    let yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset, d => d[dataKey])])
                    .range([h - p.bottom, p.top]);

    let yAxis = d3.axisLeft(yScale);

    let gy = svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + p.left + ",0)")
                .call(yAxis);

    let bars = svg.selectAll("rect")
                  .data(dataset)
                  .enter()
                  .append("rect")
                  .attr("x", (d, i) => xScale(labels[i]))
                  .attr("y", d => yScale(d[dataKey]))
                  .attr("width", xScale.bandwidth())
                  .attr("height", d => h - p.bottom - yScale(d[dataKey]))
                  .attr("fill", (d, i) => colors(i))
                  .attr("class", "bar");

    bars.append("title")
        .text(d => d[dataKey]);

    this.barcharts[dataKey] = {w, h, p, xScale, xAxis, gx, yScale, yAxis, gy, colors};
  }

  updateBarcharts() {
    let dataset = Object.values(this.dataset);
    let labels = dataset.map(d => d.key);

    ['pubmedBarchart', 'trialsBarchart'].forEach(svgID => {
      let svg = d3.select('#' + svgID);
      let dataKey = (svgID === 'pubmedBarchart') ? 'pubmedHits' : 'trialsHits';
      let {w, h, p, xScale, xAxis, gx, yScale, yAxis, gy, colors} = this.barcharts[dataKey];

      xScale.domain(labels);
      yScale.domain([
        0, d3.max(dataset, d => d[dataKey])
      ]);

      gx.transition().duration(500).call(xAxis.scale(xScale))
      gy.transition().duration(500).call(yAxis.scale(yScale))

      let bars = svg.selectAll("rect")
                    .data(dataset);

      let newBars = bars.enter()
                        .append("rect")
                        .attr("x", (d, i) => xScale(labels[i]))
                        .attr("y", h - p.top)
                        .attr("width", xScale.bandwidth())
                        .attr("height", 0)
                        .attr("fill", (d, i) => colors(i))
                        .attr("class", "bar");

      newBars.append("title")
             .text(d => d[dataKey]);

      newBars.merge(bars)
             .transition()
             .duration(500)
             .attr("x", (d, i) => xScale(labels[i]))
             .attr("y", d => yScale(d[dataKey]))
             .attr("width", xScale.bandwidth())
             .attr("height", d => h - p.bottom - yScale(d[dataKey]));
    });

  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log(nextProps, nextState);
  //   // return !(nextProps.diseaseName === this.props.diseaseName);
  // }

  changeHandler(e) {
    this.state.selectedDisease = e.currentTarget.value;
  }

  clickHander() {
    if (!this.state.selectedDisease) {
      this.state.selectedDisease = "Animal Diseases";
    }
    this.getHits(this.state.selectedDisease);
  }

  render() {
    let diseaseName = this.props.diseaseName,
        { pubmedHits, trialsHits } = this.state,
        cl = "slideTitleColorText",
        diseaseSpan = <span className={cl}>{`"${diseaseName}"`}</span>,
        pubmedSpan = <span className={cl}>{pubmedHits.toLocaleString()}</span>,
        trialsSpan = <span className={cl}>{trialsHits.toLocaleString()}</span>,
        dateSpan = <span className={cl}>2015-2016</span>,
        pubmedURL = `https://www.ncbi.nlm.nih.gov/pubmed`,
        trialsURL = `https://clinicaltrials.gov/`,
        pubmedLink = <a className='slideLink pubmedLink'
                        href={pubmedURL} target="_blank">PubMed</a>,
        trialsLink = <a className='slideLink trialsLink'
                        href={trialsURL} target="_blank">
                        clinicaltrials.gov</a>,
        loadingDiv = this.state.loadingDiv;

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

              <div onClick={this.clickHander} className="submitDiseaseName barchartsPanel">Submit</div>
            </div>
          </div>

          <div id="barchartsPanel">
            <svg id="pubmedBarchart"></svg>
            <svg id="trialsBarchart"></svg>
            {this.state.loading && loadingDiv}
          </div>
        </div>
      </div>
    )
  }

}

export default ResearchBarcharts;
