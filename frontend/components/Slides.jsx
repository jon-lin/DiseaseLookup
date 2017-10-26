import React from 'react';
import Slider from '../../external/react-viewport-slider/Slider';
import ForceDiagram from './ForceDiagram';
import ResearchBarcharts from './ResearchBarcharts';
import { meshCatsAndSubcats } from './meshDiseaseCategories';

const wallpaper = 'http://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-164335.png';

class Slides extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diseaseName: props.match.params.diseaseName,
      diseaseSubCats: meshCatsAndSubcats[props.match.params.diseaseName]
    };
  }

  render() {
      let meshUrl = `https://www.nlm.nih.gov/pubs/factsheets/mesh.html`;
      let { diseaseName, diseaseSubCats } = this.state;
      let diseaseSpan = <span className="slideTitleColorText">{`"${diseaseName}"`}</span>;
      let subcatCount = <span className="slideTitleColorText">{diseaseSubCats.length - 1}</span>;
      let meshLink = <a className='slideLink meshLink' href={meshUrl} target="_blank">MeSH</a>;

      return (
        <Slider>

          <div className="slideContainer forceDiagramSlide" itemstyle={{ backgroundColor: '#a2d7c7' }}>
            <div className="slideTitle">
              {diseaseSpan} has {subcatCount} immediate {meshLink} subcategories.
              A plus sign (+) means a category has its own subcategories.
            </div>
            <ForceDiagram {...this.state} />
          </div>

          <div className="slideContainer barchartsSlide" itemstyle={{ backgroundColor: '#353330' }}>
            <ResearchBarcharts diseaseName={diseaseName} />
          </div>

          <div itemclass="has-overlay" itemstyle={{ backgroundImage: `url(${wallpaper})`, backgroundSize: 'cover' }}>
            <div className="content">Yo.</div>
          </div>

        </Slider>
      );
  }
}

export default Slides;
