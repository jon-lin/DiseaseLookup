import React from 'react';
import Slider from '../../external/react-viewport-slider/Slider';

const wallpaper = 'http://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-164335.png';

class Slides extends React.Component {
  constructor() {
    super()
  }

  // <div itemstyle={{ backgroundColor: '#353330' }}>
  //   <div className="content">Sup?</div>
  // </div>
  // <div itemclass="has-overlay" itemstyle={{ backgroundImage: `url(${wallpaper})`, backgroundSize: 'cover' }}>
  //   <div className="content">Yo.</div>
  // </div>

  render() {
      return (
        // <div>what</div>
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
          <div itemstyle={{ color: '#333' }}>
            <div className="content love">
              <i className="fa fa-heart"></i>
              <iframe src="http://ghbtns.com/github-btn.html?user=daviferreira&repo=react-viewport-slider&type=follow&count=true&size=large" allowTransparency="true" frameBorder="0" scrolling="0" width="auto" height="30" />
              <iframe src="http://ghbtns.com/github-btn.html?user=daviferreira&repo=react-viewport-slider&type=watch&count=true&size=large" allowTransparency="true" frameBorder="0" scrolling="0" width="auto" height="30" />
              <iframe src="http://ghbtns.com/github-btn.html?user=daviferreira&repo=react-viewport-slider&type=fork&count=true&size=large" allowTransparency="true" frameBorder="0" scrolling="0" width="auto" height="30" />
            </div>
          </div>
        </Slider>
      );
  }
}

export default Slides;
