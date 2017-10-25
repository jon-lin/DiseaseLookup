import React from 'react';
import Slider from '../../external/react-viewport-slider/Slider';
import ForceDiagram from './ForceDiagram';
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
          <div className="forceDiagramSlide" itemstyle={{ backgroundColor: '#a2d7c7' }}>
            <div className="slideTitle">
              {diseaseSpan} has {subcatCount} immediate {meshLink} subcategories.
            </div>
            <ForceDiagram {...this.state} />
          </div>
          <div itemstyle={{ backgroundColor: '#353330' }}>
            <div className="content">Sup?</div>
          </div>
          <div itemclass="has-overlay" itemstyle={{ backgroundImage: `url(${wallpaper})`, backgroundSize: 'cover' }}>
            <div className="content">Yo.</div>
          </div>
        </Slider>
      );
  }
}

export default Slides;
