'use strict';

var React = require('react');
var numeral = require('numeral');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var numeral__default = /*#__PURE__*/_interopDefaultLegacy(numeral);

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var regex = /^[0-9,.]+/g;
var keyRegex = /^(Backspace)|((Numpad|Digit)[0-9]{1})/i;

var setCaretPosition = function setCaretPosition(inputForm, index) {
  inputForm.setSelectionRange(index, index, 'none');
};

var Input = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var inputRef = React.useRef(null);
  var clockTimeout = 0;
  React.useImperativeHandle(ref, function () {
    return inputRef === null || inputRef === void 0 ? void 0 : inputRef.current;
  });

  var _props$format = props.format,
      format = _props$format === void 0 ? '0' : _props$format,
      onChange = props.onChange,
      rest = _objectWithoutProperties(props, ["format", "onChange"]);

  var _props$min = props.min,
      min = _props$min === void 0 ? 0 : _props$min,
      max = props.max;
  min = numeral__default['default'](min).value() || 0;
  max = numeral__default['default'](max).value() || undefined;
  var defaultValue = props.defaultValue ? numeral__default['default'](props.defaultValue).format(format) : '';

  var _useState = React.useState({
    value: defaultValue,
    position: 0
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  var _useState3 = React.useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      changeEvent = _useState4[0],
      setChangeEvent = _useState4[1];

  var focusOnChar = function focusOnChar(value, index) {
    var val = numeral__default['default'](value).value();
    var dotCount = (value.match(/\./g) || []).length;
    var finalIndex = (val || 0).toString().length;
    finalIndex = index + dotCount;
    if (!finalIndex) finalIndex = 1;
    return finalIndex;
  };

  var changeHandler = function changeHandler(event) {
    event.persist();
    var m;
    var value = event.target.value;
    var position = regex.lastIndex;
    var numeralValue = numeral__default['default'](value).value() || 0;
    var unformattedValue = numeralValue.toString();

    if (max && max < numeralValue) {
      unformattedValue = unformattedValue.slice(0, -1);
    }

    while ((m = regex.exec(unformattedValue)) !== null) {
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      position = regex.lastIndex;
    }

    value = value === '' ? '' : numeral__default['default'](parseFloat(unformattedValue)).format(format) || '';
    position = focusOnChar(value, position);
    new Promise(function (resolve) {
      setState({
        value: value,
        position: position
      });
      resolve(true);
    }).then(function () {
      setCaretPosition(inputRef.current, position);
    });
    if (clockTimeout !== 0) clearTimeout(clockTimeout);
    setChangeEvent(event);
    clockTimeout = setTimeout(function () {
      return null;
    }, 300);
  };

  var onPropsOnChange = function onPropsOnChange() {
    if (clockTimeout !== 0) clearTimeout(clockTimeout);
    clockTimeout = setTimeout(function () {
      if (changeEvent) {
        var numeralValue = numeral__default['default'](state.value).value();

        if (min && min > numeralValue) {
          changeEvent.target.setCustomValidity("The given value must be greater than ".concat(min));
        }

        if (onChange) {
          var tempValue = (numeralValue || '').toString();
          var value = parseFloat(tempValue) || 0;
          onChange(changeEvent, value);
        }
      }
    }, 1000);
  };

  var keyboardHandler = function keyboardHandler(event) {
    if (event.key === ',') {
      var _parts$;

      var parts = state.value.split(',');
      var position = ((_parts$ = parts[0]) === null || _parts$ === void 0 ? void 0 : _parts$.length) + 1 || 0;
      setCaretPosition(inputRef.current, position);
      return event.preventDefault();
    }

    if (keyRegex.test(event.code)) onPropsOnChange();
  };

  var keyDownHandler = function keyDownHandler(event) {
    if (event.code === 'Backspace' || event.code === 'Delete') {
      var _inputRef$current;

      var lastIndex = ((_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.selectionEnd) || 0;

      if (lastIndex > 0) {
        var lastChar = state.value.slice(lastIndex - 1, lastIndex);

        if (lastChar === ',') {
          setCaretPosition(inputRef.current, lastIndex - 1);
          return event.preventDefault();
        }
      }
    }
  };

  var clipboardHandler = function clipboardHandler(event) {
    onPropsOnChange();
  };

  React.useMemo(function () {
    var value = props.value;

    if (value !== undefined && value !== null) {
      setState({
        value: value.toString(),
        position: (value === null || value === void 0 ? void 0 : value.toString().length) || 0
      });
    }
  }, [props.value]);
  return /*#__PURE__*/React__default['default'].createElement("input", Object.assign({
    ref: inputRef
  }, rest, {
    type: "tel",
    onChange: changeHandler,
    onKeyUp: keyboardHandler,
    onKeyDown: keyDownHandler,
    onKeyPress: keyboardHandler,
    onPaste: clipboardHandler,
    value: state.value,
    autoComplete: "off"
  }));
});
Input.displayName = 'NumeralReact';
