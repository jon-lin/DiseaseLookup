import React from 'react';
import Slider from '../../external/react-viewport-slider/Slider';

const wallpaper = 'http://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-164335.png';

class Slides extends React.Component {
  constructor() {
    super()
  }

  render() {
      return (
        <Slider>
          <div itemstyle={{ backgroundColor: '#a2d7c7' }}>
            <div className="content">Hello, world.</div>
            <div>test</div>
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
