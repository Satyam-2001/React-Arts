'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var Icon = require('@mdi/react');
var js = require('@mdi/js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var Icon__default = /*#__PURE__*/_interopDefaultLegacy(Icon);

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$6 = ".CanvasSketch-module_main__z3D8e{position:relative}.CanvasSketch-module_canvas__9YPTy{background-color:#fff;border:solid;border-color:rgba(0,0,0,.1);border-width:2px;cursor:pointer}";
var classes$6 = {"main":"CanvasSketch-module_main__z3D8e","canvas":"CanvasSketch-module_canvas__9YPTy"};
styleInject(css_248z$6);

const getColorAtPixel = (imageData, x, y) => {
  const {
    width,
    data
  } = imageData;
  return {
    r: data[4 * (width * y + x) + 0],
    g: data[4 * (width * y + x) + 1],
    b: data[4 * (width * y + x) + 2],
    a: data[4 * (width * y + x) + 3]
  };
};

const setColorAtPixel = (imageData, color, x, y) => {
  const {
    width,
    data
  } = imageData;
  data[4 * (width * y + x) + 0] = color.r & 0xff;
  data[4 * (width * y + x) + 1] = color.g & 0xff;
  data[4 * (width * y + x) + 2] = color.b & 0xff;
  data[4 * (width * y + x) + 3] = color.a & 0xff;
};

const colorMatch = (a, b) => {
  return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
};

const floodFill = (imageData, newColor, x, y) => {
  const {
    width,
    height
  } = imageData;
  const stack = [];
  const baseColor = getColorAtPixel(imageData, x, y);
  let operator = {
    x,
    y
  }; // Check if base color and new color are the same

  if (colorMatch(baseColor, newColor)) {
    return;
  } // Add the clicked location to stack


  stack.push({
    x: operator.x,
    y: operator.y
  });

  while (stack.length) {
    operator = stack.pop();
    let contiguousDown = true; // Vertical is assumed to be true

    let contiguousUp = true; // Vertical is assumed to be true

    let contiguousLeft = false;
    let contiguousRight = false; // Move to top most contiguousDown pixel

    while (contiguousUp && operator.y >= 0) {
      operator.y--;
      contiguousUp = colorMatch(getColorAtPixel(imageData, operator.x, operator.y), baseColor);
    } // Move downward


    while (contiguousDown && operator.y < height) {
      setColorAtPixel(imageData, newColor, operator.x, operator.y); // Check left

      if (operator.x - 1 >= 0 && colorMatch(getColorAtPixel(imageData, operator.x - 1, operator.y), baseColor)) {
        if (!contiguousLeft) {
          contiguousLeft = true;
          stack.push({
            x: operator.x - 1,
            y: operator.y
          });
        }
      } else {
        contiguousLeft = false;
      } // Check right


      if (operator.x + 1 < width && colorMatch(getColorAtPixel(imageData, operator.x + 1, operator.y), baseColor)) {
        if (!contiguousRight) {
          stack.push({
            x: operator.x + 1,
            y: operator.y
          });
          contiguousRight = true;
        }
      } else {
        contiguousRight = false;
      }

      operator.y++;
      contiguousDown = colorMatch(getColorAtPixel(imageData, operator.x, operator.y), baseColor);
    }
  }
};

const CanvasSketch = props => {
  const [isDrawing, setIsDrawing] = React.useState(false);
  const canvasRef = React.useRef(null);
  const contextRef = React.useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    canvas.style.width = `${canvas.width}`;
    canvas.style.height = `${canvas.height}`;
    const context = canvas.getContext("2d");
    context.lineCap = props.lineCap;
    context.strokeStyle = props.color;
    context.lineWidth = props.lineWidth;
    contextRef.current = context;
  }, []);
  React.useEffect(() => {
    contextRef.current.lineCap = props.lineCap;
  }, [props.lineCap]);
  React.useEffect(() => {
    contextRef.current.strokeStyle = props.color;
  }, [props.color]);
  React.useEffect(() => {
    contextRef.current.lineWidth = props.lineWidth;
  }, [props.lineWidth]);
  React.useEffect(() => {
    props.getClearCanvas(() => () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
    });
  }, []);

  const startDrawing = ({
    nativeEvent
  }) => {
    const {
      offsetX,
      offsetY
    } = nativeEvent;

    if (props.option === 'paint') {
      const canvas = canvasRef.current;
      const imageData = contextRef.current.getImageData(0, 0, canvas.width, canvas.height);
      const rgb = props.color.replace(/[^\d,]/g, '').split(',');
      const newcolor = {
        r: parseInt(rgb[0]),
        g: parseInt(rgb[1]),
        b: parseInt(rgb[2]),
        a: 255
      };
      floodFill(imageData, newcolor, offsetX, offsetY);
      contextRef.current.putImageData(imageData, 0, 0);
    } else {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const startTouchDrawing = ({
    touches
  }) => {
    const {
      clientX,
      clientY
    } = touches[0];
    contextRef.current.beginPath();
    contextRef.current.moveTo(clientX - window.innerWidth * 0.22, clientY - window.innerHeight * 0.1);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({
    nativeEvent
  }) => {
    if (!isDrawing) {
      return;
    }

    const {
      offsetX,
      offsetY
    } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const touchDraw = ({
    touches
  }) => {
    if (!isDrawing) {
      return;
    }

    const {
      clientX,
      clientY
    } = touches[0];
    contextRef.current.lineTo(clientX - window.innerWidth * 0.22, clientY - window.innerHeight * 0.1);
    contextRef.current.stroke();
  };

  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: classes$6.main,
    style: {
      height: `${props.height}px`,
      width: `${props.width}px`
    }
  }, /*#__PURE__*/React__default["default"].createElement("canvas", {
    ref: canvasRef,
    className: classes$6.canvas,
    onMouseDown: startDrawing,
    onMouseUp: finishDrawing,
    onMouseMove: draw,
    onTouchStart: startTouchDrawing,
    onTouchEnd: finishDrawing,
    onTouchMove: touchDraw,
    onMouseLeave: finishDrawing
  }));
};

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  return _extends.apply(this, arguments);
}

var css_248z$5 = ".CanvasSketchTool-module_box__gZsxo{align-items:center;box-sizing:border-box;display:flex;flex-direction:row;justify-content:center}";
var classes$5 = {"box":"CanvasSketchTool-module_box__gZsxo"};
styleInject(css_248z$5);

var css_248z$4 = ".Menu-module_menu__4Ey1d{background-color:#fff;border:1px solid #dadce0;border-radius:25px;box-sizing:border-box;display:flex;flex-direction:column;height:95%;justify-content:space-around;margin:0 8px;padding:5px;width:50px;z-index:10}";
var classes$4 = {"menu":"Menu-module_menu__4Ey1d"};
styleInject(css_248z$4);

var css_248z$3 = "@import url(\"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200\");.IconButton-module_menu-option__DK-ZQ{align-items:center;aspect-ratio:1/1;border-radius:50%;cursor:pointer;display:flex;flex-direction:row;justify-content:center;position:relative}.IconButton-module_name__RL4s0{background-color:#3c4043;border-radius:5px;color:#fff;font-size:13px;font-weight:500;left:50px;padding:3px 5px;position:absolute;white-space:nowrap}";
var classes$3 = {"menu-option":"IconButton-module_menu-option__DK-ZQ","name":"IconButton-module_name__RL4s0"};
styleInject(css_248z$3);

const IconButton = props => {
  const [show, setShow] = React.useState(false);
  const isActive = props.name === props.active;

  const onClickHandler = () => {
    props.setActive(props.name);
  };

  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: classes$3['menu-option'],
    style: {
      backgroundColor: !isActive ? 'white' : props.color || 'rgb(60,64,67)'
    }
  }, /*#__PURE__*/React__default["default"].createElement(Icon__default["default"], {
    path: props.label,
    size: 1.2,
    color: isActive ? 'white' : 'rgb(60,64,67)',
    onMouseMove: () => setShow(true),
    onMouseLeave: () => setShow(false),
    onClick: props.onClick || onClickHandler
  }), show ? /*#__PURE__*/React__default["default"].createElement("p", {
    className: classes$3.name
  }, props.name) : undefined, props.children);
};

var css_248z$2 = ".Circle-module_circle__2zVZA{aspect-ratio:1/1;border-radius:50%;box-sizing:border-box;margin:5px}.Circle-module_border__8aHMq{border:4px solid #6cd0f5}";
var classes$2 = {"circle":"Circle-module_circle__2zVZA","border":"Circle-module_border__8aHMq"};
styleInject(css_248z$2);

const Circle = props => {
  const onClick = () => {
    props.setProp(props.property);
  };

  return /*#__PURE__*/React__default["default"].createElement("p", {
    className: `${classes$2.circle} ${props.selected ? classes$2.border : undefined}`,
    onClick: onClick,
    style: {
      width: `${props.size}px`,
      height: `${props.size}px`,
      backgroundColor: props.color
    }
  });
};

var css_248z$1 = ".Size-module_size-menu__5Xffn{align-items:center;background-color:#fff;border-radius:5px;box-shadow:2px 2px 6px rgba(0,0,0,.5);display:flex;flex-direction:row;justify-content:space-around;left:50px;min-height:40px;position:absolute;width:100px;z-index:20}";
var classes$1 = {"size-menu":"Size-module_size-menu__5Xffn"};
styleInject(css_248z$1);

const useOutsideClick = (ref, callback) => {
  React.useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }; // Bind the event listener


    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};

const Size = props => {
  const [show, setShow] = React.useState(false);
  const [lineWidth, setLineWidth] = React.useState(4);
  const ref = React.useRef();
  useOutsideClick(ref, () => setShow(false));

  const setWidth = value => {
    setLineWidth(value);
    props.dispatchData({
      lineWidth: value
    });
  };

  const onClick = () => {
    props.setActive('Pen Size');
    setShow(prev => !prev);
  };

  return /*#__PURE__*/React__default["default"].createElement(IconButton, _extends({
    name: "Pen Size",
    label: js.mdiAdjust
  }, props, {
    onClick: onClick
  }), show ? /*#__PURE__*/React__default["default"].createElement("div", {
    ref: ref,
    className: classes$1['size-menu']
  }, [4, 6, 8, 10].map(size => /*#__PURE__*/React__default["default"].createElement(Circle, {
    key: size,
    size: size,
    property: size,
    color: props.color,
    setProp: setWidth,
    selected: lineWidth === size
  }))) : undefined);
};

var css_248z = ".Color-module_size-menu__LqWM8{align-items:center;background-color:#fff;border-radius:5px;box-shadow:2px 2px 6px rgba(0,0,0,.5);display:flex;flex-flow:row wrap;justify-content:space-around;left:50px;position:absolute;width:130px;z-index:20}";
var classes = {"size-menu":"Color-module_size-menu__LqWM8"};
styleInject(css_248z);

const colors = ['rgb(60,64,67)', 'rgb(25,172,192)', 'rgb(105,158,62)', 'rgb(243,179,42)', 'rgb(217,69,62)', 'rgb(171,71,188)'];

const Color = props => {
  const [show, setShow] = React.useState(false);
  const ref = React.useRef();
  useOutsideClick(ref, () => setShow(false));

  const onClick = () => {
    props.setActive('Pen Color');
    setShow(prev => !prev);
  };

  return /*#__PURE__*/React__default["default"].createElement(IconButton, _extends({
    name: "Pen Color",
    label: js.mdiPalette
  }, props, {
    onClick: onClick
  }), show ? /*#__PURE__*/React__default["default"].createElement("div", {
    className: classes['size-menu'],
    ref: ref
  }, colors.map(color => /*#__PURE__*/React__default["default"].createElement(Circle, {
    key: color,
    size: 30,
    color: color,
    property: color,
    setProp: props.setColor,
    selected: color === props.color
  }))) : undefined);
};

const Menu = props => {
  const [active, setActive] = React.useState('Pen');
  const [color, setColor] = React.useState('rgb(60,64,67)');

  const colorChange = color => {
    setColor(color);
    props.dispatchData({
      color,
      option: 'pen'
    });
  };

  const onChange = action => {
    if (action === 'Flood Fill') props.dispatchData({
      option: 'paint',
      color
    });else if (action === 'Clear Frame') {
      props.clearCanvas();
      props.dispatchData({
        option: 'pen',
        color
      });
      return;
    } else if (action === 'Erase') props.dispatchData({
      color: 'white',
      option: 'pen'
    });else props.dispatchData({
      option: 'pen',
      color
    });
    setActive(action);
  };

  const prop = {
    active,
    setActive: onChange
  };
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: classes$4.menu
  }, /*#__PURE__*/React__default["default"].createElement(IconButton, _extends({
    name: "Pen",
    label: js.mdiPen
  }, prop, {
    color: color
  })), /*#__PURE__*/React__default["default"].createElement(IconButton, _extends({
    name: "Erase",
    label: js.mdiEraserVariant
  }, prop)), /*#__PURE__*/React__default["default"].createElement(Size, _extends({}, prop, {
    color: color,
    dispatchData: props.dispatchData
  })), /*#__PURE__*/React__default["default"].createElement(Color, _extends({}, prop, {
    color: color,
    setColor: colorChange
  })), /*#__PURE__*/React__default["default"].createElement(IconButton, _extends({
    name: "Flood Fill",
    label: js.mdiFormatColorFill
  }, prop, {
    color: color
  })), /*#__PURE__*/React__default["default"].createElement(IconButton, _extends({
    name: "Clear Frame",
    label: js.mdiDelete
  }, prop)));
};

const initialData = {
  color: 'rgb(60,64,67)',
  option: 'pen',
  lineWidth: 4
};

const reducer = (prev, action) => {
  return { ...prev,
    ...action
  };
};

const CanvasSketchTool = props => {
  const [properties, dispatchData] = React.useReducer(reducer, initialData);
  const [clearCanvas, setClearCanvas] = React.useState();
  console.log(properties);
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: classes$5.box,
    style: {
      height: `${props.height}px`
    }
  }, /*#__PURE__*/React__default["default"].createElement(Menu, {
    dispatchData: dispatchData,
    clearCanvas: clearCanvas
  }), /*#__PURE__*/React__default["default"].createElement(CanvasSketch, _extends({}, props, properties, {
    lineCap: "round",
    getClearCanvas: setClearCanvas
  })));
};

exports.CanvasSketch = CanvasSketch;
exports.CanvasSketchTool = CanvasSketchTool;
