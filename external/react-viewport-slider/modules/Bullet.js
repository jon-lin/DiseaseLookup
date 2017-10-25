'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _classnames = require('classnames');
var PropTypes = require('prop-types');
var _classnames2 = _interopRequireDefault(_classnames);

var _react = require('React');

var _react2 = _interopRequireDefault(_react);

var Bullet = function Bullet(props) {

  var style = {
    display: 'block',
    height: '20px',
    width: '20px'
  };

  var handleClick = function handleClick() {
    props.onClick(props.index, true);
  };

  var classes = _classnames2['default']('viewport-slider-paginator-bullet', { 'is-active': props.active });

  return _react2['default'].createElement('a', { href: '#viewport-slide-' + props.index,
    className: classes,
    onClick: handleClick,
    style: style });
};

Bullet.propTypes = {
  active: PropTypes.bool,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func
};

exports['default'] = Bullet;
module.exports = exports['default'];
