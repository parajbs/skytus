(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _isReactNative = _interopRequireDefault(require("./isReactNative"));

var _uriToBlob = _interopRequireDefault(require("./uriToBlob"));

var _FileSource = _interopRequireDefault(require("./sources/FileSource"));

var _StreamSource = _interopRequireDefault(require("./sources/StreamSource"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

var FileReader = /*#__PURE__*/function () {
  function FileReader() {
    _classCallCheck(this, FileReader);
  }

  _createClass(FileReader, [{
    key: "openFile",
    value: function openFile(input, chunkSize) {
      // In React Native, when user selects a file, instead of a File or Blob,
      // you usually get a file object {} with a uri property that contains
      // a local path to the file. We use XMLHttpRequest to fetch
      // the file blob, before uploading with tus.
      if ((0, _isReactNative["default"])() && input && typeof input.uri !== 'undefined') {
        return (0, _uriToBlob["default"])(input.uri).then(function (blob) {
          return new _FileSource["default"](blob);
        })["catch"](function (err) {
          throw new Error("tus: cannot fetch `file.uri` as Blob, make sure the uri is correct and accessible. ".concat(err));
        });
      } // Since we emulate the Blob type in our tests (not all target browsers
      // support it), we cannot use `instanceof` for testing whether the input value
      // can be handled. Instead, we simply check is the slice() function and the
      // size property are available.


      if (typeof input.slice === 'function' && typeof input.size !== 'undefined') {
        return Promise.resolve(new _FileSource["default"](input));
      }

      if (typeof input.read === 'function') {
        chunkSize = Number(chunkSize);

        if (!Number.isFinite(chunkSize)) {
          return Promise.reject(new Error('cannot create source for stream without a finite value for the `chunkSize` option'));
        }

        return Promise.resolve(new _StreamSource["default"](input, chunkSize));
      }

      return Promise.reject(new Error('source object may only be an instance of File, Blob, or Reader in this environment'));
    }
  }]);

  return FileReader;
}();

exports["default"] = FileReader;

},{"./isReactNative":5,"./sources/FileSource":6,"./sources/StreamSource":7,"./uriToBlob":10}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = fingerprint;

var _isReactNative = _interopRequireDefault(require("./isReactNative"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
} // TODO: Differenciate between input types

/**
 * Generate a fingerprint for a file which will be used the store the endpoint
 *
 * @param {File} file
 * @param {Object} options
 * @param {Function} callback
 */


function fingerprint(file, options) {
  if ((0, _isReactNative["default"])()) {
    return Promise.resolve(reactNativeFingerprint(file, options));
  }

  return Promise.resolve(['tus-br', file.name, file.type, file.size, file.lastModified, options.endpoint].join('-'));
}

function reactNativeFingerprint(file, options) {
  var exifHash = file.exif ? hashCode(JSON.stringify(file.exif)) : 'noexif';
  return ['tus-rn', file.name || 'noname', file.size || 'nosize', exifHash, options.endpoint].join('/');
}

function hashCode(str) {
  /* eslint-disable no-bitwise */
  // from https://stackoverflow.com/a/8831937/151666
  var hash = 0;

  if (str.length === 0) {
    return hash;
  }

  for (var i = 0; i < str.length; i++) {
    var _char = str.charCodeAt(i);

    hash = (hash << 5) - hash + _char;
    hash &= hash; // Convert to 32bit integer
  }

  return hash;
}

},{"./isReactNative":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
/* eslint-disable max-classes-per-file */


var XHRHttpStack = /*#__PURE__*/function () {
  function XHRHttpStack() {
    _classCallCheck(this, XHRHttpStack);
  }

  _createClass(XHRHttpStack, [{
    key: "createRequest",
    value: function createRequest(method, url) {
      return new Request(method, url);
    }
  }, {
    key: "getName",
    value: function getName() {
      return 'XHRHttpStack';
    }
  }]);

  return XHRHttpStack;
}();

exports["default"] = XHRHttpStack;

var Request = /*#__PURE__*/function () {
  function Request(method, url) {
    _classCallCheck(this, Request);

    this._xhr = new XMLHttpRequest();

    this._xhr.open(method, url, true);

    this._method = method;
    this._url = url;
    this._headers = {};
  }

  _createClass(Request, [{
    key: "getMethod",
    value: function getMethod() {
      return this._method;
    }
  }, {
    key: "getURL",
    value: function getURL() {
      return this._url;
    }
  }, {
    key: "setHeader",
    value: function setHeader(header, value) {
      this._xhr.setRequestHeader(header, value);

      this._headers[header] = value;
    }
  }, {
    key: "getHeader",
    value: function getHeader(header) {
      return this._headers[header];
    }
  }, {
    key: "setProgressHandler",
    value: function setProgressHandler(progressHandler) {
      // Test support for progress events before attaching an event listener
      if (!('upload' in this._xhr)) {
        return;
      }

      this._xhr.upload.onprogress = function (e) {
        if (!e.lengthComputable) {
          return;
        }

        progressHandler(e.loaded);
      };
    }
  }, {
    key: "send",
    value: function send() {
      var _this = this;

      var body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      return new Promise(function (resolve, reject) {
        _this._xhr.onload = function () {
          resolve(new Response(_this._xhr));
        };

        _this._xhr.onerror = function (err) {
          reject(err);
        };

        _this._xhr.send(body);
      });
    }
  }, {
    key: "abort",
    value: function abort() {
      this._xhr.abort();

      return Promise.resolve();
    }
  }, {
    key: "getUnderlyingObject",
    value: function getUnderlyingObject() {
      return this._xhr;
    }
  }]);

  return Request;
}();

var Response = /*#__PURE__*/function () {
  function Response(xhr) {
    _classCallCheck(this, Response);

    this._xhr = xhr;
  }

  _createClass(Response, [{
    key: "getStatus",
    value: function getStatus() {
      return this._xhr.status;
    }
  }, {
    key: "getHeader",
    value: function getHeader(header) {
      return this._xhr.getResponseHeader(header);
    }
  }, {
    key: "getBody",
    value: function getBody() {
      return this._xhr.responseText;
    }
  }, {
    key: "getUnderlyingObject",
    value: function getUnderlyingObject() {
      return this._xhr;
    }
  }]);

  return Response;
}();

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DefaultHttpStack", {
  enumerable: true,
  get: function get() {
    return _httpStack["default"];
  }
});
Object.defineProperty(exports, "DetailedError", {
  enumerable: true,
  get: function get() {
    return _error["default"];
  }
});
exports.Upload = void 0;
Object.defineProperty(exports, "canStoreURLs", {
  enumerable: true,
  get: function get() {
    return _urlStorage.canStoreURLs;
  }
});
exports.defaultOptions = void 0;
Object.defineProperty(exports, "enableDebugLog", {
  enumerable: true,
  get: function get() {
    return _logger.enableDebugLog;
  }
});
exports.isSupported = void 0;

var _upload = _interopRequireDefault(require("../upload"));

var _noopUrlStorage = _interopRequireDefault(require("../noopUrlStorage"));

var _logger = require("../logger");

var _error = _interopRequireDefault(require("../error"));

var _urlStorage = require("./urlStorage");

var _httpStack = _interopRequireDefault(require("./httpStack"));

var _fileReader = _interopRequireDefault(require("./fileReader"));

var _fileSignature = _interopRequireDefault(require("./fileSignature"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var defaultOptions = _objectSpread(_objectSpread({}, _upload["default"].defaultOptions), {}, {
  httpStack: new _httpStack["default"](),
  fileReader: new _fileReader["default"](),
  urlStorage: _urlStorage.canStoreURLs ? new _urlStorage.WebStorageUrlStorage() : new _noopUrlStorage["default"](),
  fingerprint: _fileSignature["default"]
});

exports.defaultOptions = defaultOptions;

var Upload = /*#__PURE__*/function (_BaseUpload) {
  _inherits(Upload, _BaseUpload);

  var _super = _createSuper(Upload);

  function Upload() {
    var file = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Upload);

    options = _objectSpread(_objectSpread({}, defaultOptions), options);
    return _super.call(this, file, options);
  }

  _createClass(Upload, null, [{
    key: "terminate",
    value: function terminate(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      options = _objectSpread(_objectSpread({}, defaultOptions), options);
      return _upload["default"].terminate(url, options);
    }
  }]);

  return Upload;
}(_upload["default"]);

exports.Upload = Upload;
var _window = window,
    XMLHttpRequest = _window.XMLHttpRequest,
    Blob = _window.Blob;
var isSupported = XMLHttpRequest && Blob && typeof Blob.prototype.slice === 'function';
exports.isSupported = isSupported;

},{"../error":12,"../logger":13,"../noopUrlStorage":14,"../upload":15,"./fileReader":1,"./fileSignature":2,"./httpStack":3,"./urlStorage":11}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var isReactNative = function isReactNative() {
  return typeof navigator !== 'undefined' && typeof navigator.product === 'string' && navigator.product.toLowerCase() === 'reactnative';
};

var _default = isReactNative;
exports["default"] = _default;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _isCordova = _interopRequireDefault(require("./isCordova"));

var _readAsByteArray = _interopRequireDefault(require("./readAsByteArray"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

var FileSource = /*#__PURE__*/function () {
  // Make this.size a method
  function FileSource(file) {
    _classCallCheck(this, FileSource);

    this._file = file;
    this.size = file.size;
  }

  _createClass(FileSource, [{
    key: "slice",
    value: function slice(start, end) {
      // In Apache Cordova applications, a File must be resolved using
      // FileReader instances, see
      // https://cordova.apache.org/docs/en/8.x/reference/cordova-plugin-file/index.html#read-a-file
      if ((0, _isCordova["default"])()) {
        return (0, _readAsByteArray["default"])(this._file.slice(start, end));
      }

      var value = this._file.slice(start, end);

      return Promise.resolve({
        value: value
      });
    }
  }, {
    key: "close",
    value: function close() {// Nothing to do here since we don't need to release any resources.
    }
  }]);

  return FileSource;
}();

exports["default"] = FileSource;

},{"./isCordova":8,"./readAsByteArray":9}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function len(blobOrArray) {
  if (blobOrArray === undefined) return 0;
  if (blobOrArray.size !== undefined) return blobOrArray.size;
  return blobOrArray.length;
}
/*
  Typed arrays and blobs don't have a concat method.
  This function helps StreamSource accumulate data to reach chunkSize.
*/


function concat(a, b) {
  if (a.concat) {
    // Is `a` an Array?
    return a.concat(b);
  }

  if (a instanceof Blob) {
    return new Blob([a, b], {
      type: a.type
    });
  }

  if (a.set) {
    // Is `a` a typed array?
    var c = new a.constructor(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
  }

  throw new Error('Unknown data type');
}

var StreamSource = /*#__PURE__*/function () {
  function StreamSource(reader) {
    _classCallCheck(this, StreamSource);

    this._buffer = undefined;
    this._bufferOffset = 0;
    this._reader = reader;
    this._done = false;
  }

  _createClass(StreamSource, [{
    key: "slice",
    value: function slice(start, end) {
      if (start < this._bufferOffset) {
        return Promise.reject(new Error("Requested data is before the reader's current offset"));
      }

      return this._readUntilEnoughDataOrDone(start, end);
    }
  }, {
    key: "_readUntilEnoughDataOrDone",
    value: function _readUntilEnoughDataOrDone(start, end) {
      var _this = this;

      var hasEnoughData = end <= this._bufferOffset + len(this._buffer);

      if (this._done || hasEnoughData) {
        var value = this._getDataFromBuffer(start, end);

        var done = value == null ? this._done : false;
        return Promise.resolve({
          value: value,
          done: done
        });
      }

      return this._reader.read().then(function (_ref) {
        var value = _ref.value,
            done = _ref.done;

        if (done) {
          _this._done = true;
        } else if (_this._buffer === undefined) {
          _this._buffer = value;
        } else {
          _this._buffer = concat(_this._buffer, value);
        }

        return _this._readUntilEnoughDataOrDone(start, end);
      });
    }
  }, {
    key: "_getDataFromBuffer",
    value: function _getDataFromBuffer(start, end) {
      // Remove data from buffer before `start`.
      // Data might be reread from the buffer if an upload fails, so we can only
      // safely delete data when it comes *before* what is currently being read.
      if (start > this._bufferOffset) {
        this._buffer = this._buffer.slice(start - this._bufferOffset);
        this._bufferOffset = start;
      } // If the buffer is empty after removing old data, all data has been read.


      var hasAllDataBeenRead = len(this._buffer) === 0;

      if (this._done && hasAllDataBeenRead) {
        return null;
      } // We already removed data before `start`, so we just return the first
      // chunk from the buffer.


      return this._buffer.slice(0, end - start);
    }
  }, {
    key: "close",
    value: function close() {
      if (this._reader.cancel) {
        this._reader.cancel();
      }
    }
  }]);

  return StreamSource;
}();

exports["default"] = StreamSource;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var isCordova = function isCordova() {
  return typeof window !== 'undefined' && (typeof window.PhoneGap !== 'undefined' || typeof window.Cordova !== 'undefined' || typeof window.cordova !== 'undefined');
};

var _default = isCordova;
exports["default"] = _default;

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = readAsByteArray;
/**
 * readAsByteArray converts a File object to a Uint8Array.
 * This function is only used on the Apache Cordova platform.
 * See https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/index.html#read-a-file
 */

function readAsByteArray(chunk) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();

    reader.onload = function () {
      var value = new Uint8Array(reader.result);
      resolve({
        value: value
      });
    };

    reader.onerror = function (err) {
      reject(err);
    };

    reader.readAsArrayBuffer(chunk);
  });
}

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = uriToBlob;
/**
 * uriToBlob resolves a URI to a Blob object. This is used for
 * React Native to retrieve a file (identified by a file://
 * URI) as a blob.
 */

function uriToBlob(uri) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';

    xhr.onload = function () {
      var blob = xhr.response;
      resolve(blob);
    };

    xhr.onerror = function (err) {
      reject(err);
    };

    xhr.open('GET', uri);
    xhr.send();
  });
}

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canStoreURLs = exports.WebStorageUrlStorage = void 0;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

var hasStorage = false;

try {
  hasStorage = 'localStorage' in window; // Attempt to store and read entries from the local storage to detect Private
  // Mode on Safari on iOS (see #49)

  var key = 'tusSupport';
  localStorage.setItem(key, localStorage.getItem(key));
} catch (e) {
  // If we try to access localStorage inside a sandboxed iframe, a SecurityError
  // is thrown. When in private mode on iOS Safari, a QuotaExceededError is
  // thrown (see #49)
  if (e.code === e.SECURITY_ERR || e.code === e.QUOTA_EXCEEDED_ERR) {
    hasStorage = false;
  } else {
    throw e;
  }
}

var canStoreURLs = hasStorage;
exports.canStoreURLs = canStoreURLs;

var WebStorageUrlStorage = /*#__PURE__*/function () {
  function WebStorageUrlStorage() {
    _classCallCheck(this, WebStorageUrlStorage);
  }

  _createClass(WebStorageUrlStorage, [{
    key: "findAllUploads",
    value: function findAllUploads() {
      var results = this._findEntries('tus::');

      return Promise.resolve(results);
    }
  }, {
    key: "findUploadsByFingerprint",
    value: function findUploadsByFingerprint(fingerprint) {
      var results = this._findEntries("tus::".concat(fingerprint, "::"));

      return Promise.resolve(results);
    }
  }, {
    key: "removeUpload",
    value: function removeUpload(urlStorageKey) {
      localStorage.removeItem(urlStorageKey);
      return Promise.resolve();
    }
  }, {
    key: "addUpload",
    value: function addUpload(fingerprint, upload) {
      var id = Math.round(Math.random() * 1e12);
      var key = "tus::".concat(fingerprint, "::").concat(id);
      localStorage.setItem(key, JSON.stringify(upload));
      return Promise.resolve(key);
    }
  }, {
    key: "_findEntries",
    value: function _findEntries(prefix) {
      var results = [];

      for (var i = 0; i < localStorage.length; i++) {
        var _key = localStorage.key(i);

        if (_key.indexOf(prefix) !== 0) continue;

        try {
          var upload = JSON.parse(localStorage.getItem(_key));
          upload.urlStorageKey = _key;
          results.push(upload);
        } catch (e) {// The JSON parse error is intentionally ignored here, so a malformed
          // entry in the storage cannot prevent an upload.
        }
      }

      return results;
    }
  }]);

  return WebStorageUrlStorage;
}();

exports.WebStorageUrlStorage = WebStorageUrlStorage;

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct.bind();
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

var DetailedError = /*#__PURE__*/function (_Error) {
  _inherits(DetailedError, _Error);

  var _super = _createSuper(DetailedError);

  function DetailedError(message) {
    var _this;

    var causingErr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var req = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var res = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    _classCallCheck(this, DetailedError);

    _this = _super.call(this, message);
    _this.originalRequest = req;
    _this.originalResponse = res;
    _this.causingError = causingErr;

    if (causingErr != null) {
      message += ", caused by ".concat(causingErr.toString());
    }

    if (req != null) {
      var requestId = req.getHeader('X-Request-ID') || 'n/a';
      var method = req.getMethod();
      var url = req.getURL();
      var status = res ? res.getStatus() : 'n/a';
      var body = res ? res.getBody() || '' : 'n/a';
      message += ", originated from request (method: ".concat(method, ", url: ").concat(url, ", response code: ").concat(status, ", response text: ").concat(body, ", request id: ").concat(requestId, ")");
    }

    _this.message = message;
    return _this;
  }

  return _createClass(DetailedError);
}( /*#__PURE__*/_wrapNativeSuper(Error));

var _default = DetailedError;
exports["default"] = _default;

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableDebugLog = enableDebugLog;
exports.log = log;
/* eslint no-console: "off" */

var isEnabled = false;

function enableDebugLog() {
  isEnabled = true;
}

function log(msg) {
  if (!isEnabled) return;
  console.log(msg);
}

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
/* eslint no-unused-vars: "off" */


var NoopUrlStorage = /*#__PURE__*/function () {
  function NoopUrlStorage() {
    _classCallCheck(this, NoopUrlStorage);
  }

  _createClass(NoopUrlStorage, [{
    key: "listAllUploads",
    value: function listAllUploads() {
      return Promise.resolve([]);
    }
  }, {
    key: "findUploadsByFingerprint",
    value: function findUploadsByFingerprint(fingerprint) {
      return Promise.resolve([]);
    }
  }, {
    key: "removeUpload",
    value: function removeUpload(urlStorageKey) {
      return Promise.resolve();
    }
  }, {
    key: "addUpload",
    value: function addUpload(fingerprint, upload) {
      return Promise.resolve(null);
    }
  }]);

  return NoopUrlStorage;
}();

exports["default"] = NoopUrlStorage;

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsBase = require("js-base64");

var _urlParse = _interopRequireDefault(require("url-parse"));

var _error = _interopRequireDefault(require("./error"));

var _logger = require("./logger");

var _uuid = _interopRequireDefault(require("./uuid"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
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

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

var defaultOptions = {
  endpoint: null,
  uploadUrl: null,
  metadata: {},
  fingerprint: null,
  uploadSize: null,
  onProgress: null,
  onChunkComplete: null,
  onSuccess: null,
  onError: null,
  _onUploadUrlAvailable: null,
  overridePatchMethod: false,
  headers: {},
  addRequestId: false,
  onBeforeRequest: null,
  onAfterResponse: null,
  onShouldRetry: null,
  chunkSize: Infinity,
  retryDelays: [0, 1000, 3000, 5000],
  parallelUploads: 1,
  splitSizeIntoParts: null,
  // If set, wait for one partial parallel upload chunk to reach this percentage
  // before resuming the next partial upload.
  staggerPercent: null,
  storeFingerprintForResuming: true,
  removeFingerprintOnSuccess: false,
  uploadLengthDeferred: false,
  uploadDataDuringCreation: false,
  urlStorage: null,
  fileReader: null,
  httpStack: null
};

var BaseUpload = /*#__PURE__*/function () {
  function BaseUpload(file, options) {
    _classCallCheck(this, BaseUpload); // Warn about removed options from previous versions


    if ('resume' in options) {
      console.log('tus: The `resume` option has been removed in tus-js-client v2. Please use the URL storage API instead.'); // eslint-disable-line no-console
    } // The default options will already be added from the wrapper classes.


    this.options = options; // Cast chunkSize to integer

    this.options.chunkSize = Number(this.options.chunkSize); // The storage module used to store URLs

    this._urlStorage = this.options.urlStorage; // The underlying File/Blob object

    this.file = file; // The URL against which the file will be uploaded

    this.url = null; // The underlying request object for the current PATCH request

    this._req = null; // The fingerpinrt for the current file (set after start())

    this._fingerprint = null; // The key that the URL storage returned when saving an URL with a fingerprint,

    this._urlStorageKey = null; // The offset used in the current PATCH request

    this._offset = null; // True if the current PATCH request has been aborted

    this._aborted = false; // The file's size in bytes

    this._size = null; // The Source object which will wrap around the given file and provides us
    // with a unified interface for getting its size and slice chunks from its
    // content allowing us to easily handle Files, Blobs, Buffers and Streams.

    this._source = null; // The current count of attempts which have been made. Zero indicates none.

    this._retryAttempt = 0; // The timeout's ID which is used to delay the next retry

    this._retryTimeout = null; // The offset of the remote upload before the latest attempt was started.

    this._offsetBeforeRetry = 0; // An array of BaseUpload instances which are used for uploading the different
    // parts, if the parallelUploads option is used.

    this._parallelUploads = null; // A custom function for splitting the upload size into parts, if the
    // parallelUploads option is used.

    this._splitSizeIntoParts = null; // An array of upload URLs which are used for uploading the different
    // parts, if the parallelUploads option is used.

    this._parallelUploadUrls = null; // If a partial upload, the current chunk object that this partial upload is
    // uploading.

    this._currentChunk = null; // Whether this is an initial upload, or subtasks initiated in
    // _startParallelUpload.

    this._initialUpload = true;
  }
  /**
   * Use the Termination extension to delete an upload from the server by sending a DELETE
   * request to the specified upload URL. This is only possible if the server supports the
   * Termination extension. If the `options.retryDelays` property is set, the method will
   * also retry if an error ocurrs.
   *
   * @param {String} url The upload's URL which will be terminated.
   * @param {object} options Optional options for influencing HTTP requests.
   * @return {Promise} The Promise will be resolved/rejected when the requests finish.
   */


  _createClass(BaseUpload, [{
    key: "findPreviousUploads",
    value: function findPreviousUploads() {
      var _this = this;

      return this.options.fingerprint(this.file, this.options).then(function (fingerprint) {
        return _this._urlStorage.findUploadsByFingerprint(fingerprint);
      });
    }
  }, {
    key: "resumeFromPreviousUpload",
    value: function resumeFromPreviousUpload(previousUpload) {
      this.url = previousUpload.uploadUrl || null;
      this._parallelUploadUrls = previousUpload.parallelUploadUrls || null;
      this._urlStorageKey = previousUpload.urlStorageKey;
    }
  }, {
    key: "start",
    value: function start() {
      var _this2 = this;

      var file = this.file;

      if (!file) {
        this._emitError(new Error('tus: no file or stream to upload provided'));

        return;
      }

      if (!this.options.endpoint && !this.options.uploadUrl && !this.url) {
        this._emitError(new Error('tus: neither an endpoint or an upload URL is provided'));

        return;
      }

      var retryDelays = this.options.retryDelays;

      if (retryDelays != null && Object.prototype.toString.call(retryDelays) !== '[object Array]') {
        this._emitError(new Error('tus: the `retryDelays` option must either be an array or null'));

        return;
      }

      if (this.options.parallelUploads > 1) {
        // Test which options are incompatible with parallel uploads.
        for (var _i = 0, _arr = ['uploadUrl', 'uploadSize', 'uploadLengthDeferred']; _i < _arr.length; _i++) {
          var optionName = _arr[_i];

          if (this.options[optionName]) {
            this._emitError(new Error("tus: cannot use the ".concat(optionName, " option when parallelUploads is enabled")));

            return;
          }
        }
      }

      if (this.options.staggerPercent !== null) {
        if (this._initialUpload && this.options.parallelUploads <= 1) {
          this._emitError(new Error("tus: cannot use the staggerPercent option when parallelUploads is disabled"));
        }
      }

      if (this.options.splitSizeIntoParts !== null) {
        if (this.options.parallelUploads <= 1) {
          this._emitError(new Error("tus: cannot use the splitSizeIntoParts option when parallelUploads is disabled"));
        }
      }

      this.options.fingerprint(file, this.options).then(function (fingerprint) {
        if (fingerprint == null) {
          (0, _logger.log)('No fingerprint was calculated meaning that the upload cannot be stored in the URL storage.');
        } else {
          (0, _logger.log)("Calculated fingerprint: ".concat(fingerprint));
        }

        _this2._fingerprint = fingerprint;

        if (_this2._source) {
          return _this2._source;
        }

        return _this2.options.fileReader.openFile(file, _this2.options.chunkSize);
      }).then(function (source) {
        _this2._source = source; // First, we look at the uploadLengthDeferred option.
        // Next, we check if the caller has supplied a manual upload size.
        // Finally, we try to use the calculated size from the source object.

        if (_this2.options.uploadLengthDeferred) {
          _this2._size = null;
        } else if (_this2.options.uploadSize != null) {
          _this2._size = Number(_this2.options.uploadSize);

          if (Number.isNaN(_this2._size)) {
            _this2._emitError(new Error('tus: cannot convert `uploadSize` option into a number'));

            return;
          }
        } else {
          _this2._size = _this2._source.size;

          if (_this2._size == null) {
            _this2._emitError(new Error("tus: cannot automatically derive upload's size from input. Specify it manually using the `uploadSize` option or use the `uploadLengthDeferred` option"));

            return;
          }
        } // If the upload was configured to use multiple requests or if we resume from
        // an upload which used multiple requests, we start a parallel upload.


        if (_this2.options.parallelUploads > 1 || _this2._parallelUploadUrls != null) {
          _this2._startParallelUpload();
        } else {
          _this2._startSingleUpload();
        }
      })["catch"](function (err) {
        _this2._emitError(err);
      });
    }
    /**
     * Initiate the uploading procedure for a parallelized upload, where one file is split into
     * multiple request which are run in parallel.
     *
     * @api private
     */

  }, {
    key: "_startParallelUpload",
    value: function _startParallelUpload() {
      var _this$options$splitSi,
          _this3 = this;

      var totalSize = this._size;
      var totalProgress = 0;
      var _this$options = this.options,
          chunkSize = _this$options.chunkSize,
          staggerPercent = _this$options.staggerPercent;
      this._parallelUploads = [];
      var partCount = this._parallelUploadUrls != null ? this._parallelUploadUrls.length : this.options.parallelUploads; // The input file will be split into multiple slices which are uploaded in separate
      // requests. Here we generate the start and end position for the slices.

      var splitSizeFn = (_this$options$splitSi = this.options.splitSizeIntoParts) !== null && _this$options$splitSi !== void 0 ? _this$options$splitSi : splitSizeIntoParts;
      var parts = splitSizeFn(this._source.size, partCount); // Attach URLs from previous uploads, if available.

      if (this._parallelUploadUrls) {
        parts.forEach(function (part, index) {
          part.uploadUrl = _this3._parallelUploadUrls[index] || null;
        });
      } // Create an empty list for storing the upload URLs


      this._parallelUploadUrls = new Array(parts.length);
      var firstChunk = null;
      var partsChunks = null;

      if (staggerPercent !== null) {
        // Generate a promise for each chunk that will be resolved when the respective
        // upload is completed.
        var _buildChunkStaggers = buildChunkStaggers(totalSize, parts.length, chunkSize);

        var _buildChunkStaggers2 = _slicedToArray(_buildChunkStaggers, 2);

        partsChunks = _buildChunkStaggers2[0];
        firstChunk = _buildChunkStaggers2[1];
      }

      var uploads = parts.map(function (part, index) {
        var lastPartProgress = 0;
        return _this3._source.slice(part.start, part.end).then(function (_ref) {
          var value = _ref.value;
          return new Promise(function (resolve, reject) {
            // Merge with the user supplied options but overwrite some values.
            var options = _objectSpread(_objectSpread({}, _this3.options), {}, {
              // If available, the partial upload should be resumed from a previous URL.
              uploadUrl: part.uploadUrl || null,
              // We take manually care of resuming for partial uploads, so they should
              // not be stored in the URL storage.
              storeFingerprintForResuming: false,
              removeFingerprintOnSuccess: false,
              // Reset the parallelUploads option to not cause recursion.
              parallelUploads: 1,
              // Reset parallel upload options. Keep the stagger option.
              splitSizeIntoParts: null,
              // Reset metadata.
              metadata: {},
              // Add the header to indicate the this is a partial upload.
              headers: _objectSpread(_objectSpread({}, _this3.options.headers), {}, {
                'Upload-Concat': 'partial'
              }),
              // Reject or resolve the promise if the upload errors or completes.
              onSuccess: resolve,
              onError: reject,
              // Wait until every partial upload has an upload URL, so we can add
              // them to the URL storage.
              _onUploadUrlAvailable: function _onUploadUrlAvailable() {
                _this3._parallelUploadUrls[index] = upload.url; // Test if all uploads have received an URL

                if (_this3._parallelUploadUrls.filter(function (u) {
                  return Boolean(u);
                }).length === parts.length) {
                  _this3._saveUploadInUrlStorage();
                }
              }
            });

            var upload = new BaseUpload(value, options); // Finalize the partial upload fields.

            upload.options.onProgress = function (newPartProgress) {
              // Based on the progress for this partial upload, calculate the progress
              // for the entire final upload.
              //
              // NOTE: This is called for each partial upload but `_emitProgress`
              // calls the `onProgress` method for the original upload.
              totalProgress = totalProgress - lastPartProgress + newPartProgress;
              lastPartProgress = newPartProgress; // Signal to the initial `BaseUpload` object.

              _this3._emitProgress(totalProgress, totalSize); // If a chunk stagger is set, signal to the other upload when it can
              // start uploading.


              if (staggerPercent !== null) {
                // Calculate stagger using the current chunk and not the
                // current part size.
                var chunk = upload._currentChunk;
                var chunkProgress = newPartProgress - chunkSize * chunk.indexInPart;
                var chunkPercent = chunkProgress / chunkSize * 100;
                var nextChunk = chunk.nextChunkStagger;

                if (nextChunk !== null && !nextChunk.resolved && chunkPercent >= staggerPercent) {
                  // The next partial upload that should start when this partial upload
                  // reaches the stagger for a chunk.
                  nextChunk.resolve();
                  nextChunk.resolved = true;
                }
              }
            };

            upload._initialUpload = false;
            var promise = Promise.resolve();

            if (staggerPercent !== null) {
              var currentChunk = partsChunks[index][0]; // Wait for the initial stagger for this chunk before starting the part.

              promise = currentChunk.promise;
              upload._currentChunk = currentChunk;
            }

            promise.then(function () {
              return upload.start();
            }); // Store the uploads in an array, so we can later abort them if necessary.

            _this3._parallelUploads.push(upload);
          });
        });
      });

      if (staggerPercent !== null) {
        // Kick off the first upload.
        firstChunk.resolve();
      }

      var req; // Wait until all partial uploads are finished and we can send the POST request for
      // creating the final upload.

      Promise.all(uploads).then(function () {
        req = _this3._openRequest('POST', _this3.options.endpoint);
        req.setHeader('Upload-Concat', "final;".concat(_this3._parallelUploadUrls.join(' '))); // Add metadata if values have been added

        var metadata = encodeMetadata(_this3.options.metadata);

        if (metadata !== '') {
          req.setHeader('Upload-Metadata', metadata);
        }

        return _this3._sendRequest(req, null);
      }).then(function (res) {
        if (!inStatusCategory(res.getStatus(), 200)) {
          _this3._emitHttpError(req, res, 'tus: unexpected response while creating upload');

          return;
        }

        var location = res.getHeader('Location');

        if (location == null) {
          _this3._emitHttpError(req, res, 'tus: invalid or missing Location header');

          return;
        }

        _this3.url = resolveUrl(_this3.options.endpoint, location);
        (0, _logger.log)("Created upload at ".concat(_this3.url));

        _this3._emitSuccess();
      })["catch"](function (err) {
        _this3._emitError(err);
      });
    }
    /**
     * Initiate the uploading procedure for a non-parallel upload. Here the entire file is
     * uploaded in a sequential matter.
     *
     * @api private
     */

  }, {
    key: "_startSingleUpload",
    value: function _startSingleUpload() {
      // Reset the aborted flag when the upload is started or else the
      // _performUpload will stop before sending a request if the upload has been
      // aborted previously.
      this._aborted = false; // The upload had been started previously and we should reuse this URL.

      if (this.url != null) {
        (0, _logger.log)("Resuming upload from previous URL: ".concat(this.url));

        this._resumeUpload();

        return;
      } // A URL has manually been specified, so we try to resume


      if (this.options.uploadUrl != null) {
        (0, _logger.log)("Resuming upload from provided URL: ".concat(this.options.uploadUrl));
        this.url = this.options.uploadUrl;

        this._resumeUpload();

        return;
      } // An upload has not started for the file yet, so we start a new one


      (0, _logger.log)('Creating a new upload');

      this._createUpload();
    }
    /**
     * Abort any running request and stop the current upload. After abort is called, no event
     * handler will be invoked anymore. You can use the `start` method to resume the upload
     * again.
     * If `shouldTerminate` is true, the `terminate` function will be called to remove the
     * current upload from the server.
     *
     * @param {boolean} shouldTerminate True if the upload should be deleted from the server.
     * @return {Promise} The Promise will be resolved/rejected when the requests finish.
     */

  }, {
    key: "abort",
    value: function abort(shouldTerminate) {
      var _this4 = this; // Stop any parallel partial uploads, that have been started in _startParallelUploads.


      if (this._parallelUploads != null) {
        this._parallelUploads.forEach(function (upload) {
          upload.abort(shouldTerminate);
        });
      } // Stop any current running request.


      if (this._req !== null) {
        this._req.abort(); // Note: We do not close the file source here, so the user can resume in the future.

      }

      this._aborted = true; // Stop any timeout used for initiating a retry.

      if (this._retryTimeout != null) {
        clearTimeout(this._retryTimeout);
        this._retryTimeout = null;
      }

      if (!shouldTerminate || this.url == null) {
        return Promise.resolve();
      }

      return BaseUpload.terminate(this.url, this.options) // Remove entry from the URL storage since the upload URL is no longer valid.
      .then(function () {
        return _this4._removeFromUrlStorage();
      });
    }
  }, {
    key: "_emitHttpError",
    value: function _emitHttpError(req, res, message, causingErr) {
      this._emitError(new _error["default"](message, causingErr, req, res));
    }
  }, {
    key: "_emitError",
    value: function _emitError(err) {
      var _this5 = this; // Do not emit errors, e.g. from aborted HTTP requests, if the upload has been stopped.


      if (this._aborted) return; // Check if we should retry, when enabled, before sending the error to the user.

      if (this.options.retryDelays != null) {
        // We will reset the attempt counter if
        // - we were already able to connect to the server (offset != null) and
        // - we were able to upload a small chunk of data to the server
        var shouldResetDelays = this._offset != null && this._offset > this._offsetBeforeRetry;

        if (shouldResetDelays) {
          this._retryAttempt = 0;
        }

        if (shouldRetry(err, this._retryAttempt, this.options)) {
          var delay = this.options.retryDelays[this._retryAttempt++];
          this._offsetBeforeRetry = this._offset;
          this._retryTimeout = setTimeout(function () {
            _this5.start();
          }, delay);
          return;
        }
      }

      if (typeof this.options.onError === 'function') {
        this.options.onError(err);
      } else {
        throw err;
      }
    }
    /**
     * Publishes notification if the upload has been successfully completed.
     *
     * @api private
     */

  }, {
    key: "_emitSuccess",
    value: function _emitSuccess() {
      if (this.options.removeFingerprintOnSuccess) {
        // Remove stored fingerprint and corresponding endpoint. This causes
        // new uploads of the same file to be treated as a different file.
        this._removeFromUrlStorage();
      }

      if (typeof this.options.onSuccess === 'function') {
        this.options.onSuccess();
      }
    }
    /**
     * Publishes notification when data has been sent to the server. This
     * data may not have been accepted by the server yet.
     *
     * @param {number} bytesSent  Number of bytes sent to the server.
     * @param {number} bytesTotal Total number of bytes to be sent to the server.
     * @api private
     */

  }, {
    key: "_emitProgress",
    value: function _emitProgress(bytesSent, bytesTotal) {
      if (typeof this.options.onProgress === 'function') {
        this.options.onProgress(bytesSent, bytesTotal);
      }
    }
    /**
     * Publishes notification when a chunk of data has been sent to the server
     * and accepted by the server.
     * @param {number} chunkSize  Size of the chunk that was accepted by the server.
     * @param {number} bytesAccepted Total number of bytes that have been
     *                                accepted by the server.
     * @param {number} bytesTotal Total number of bytes to be sent to the server.
     * @api private
     */

  }, {
    key: "_emitChunkComplete",
    value: function _emitChunkComplete(chunkSize, bytesAccepted, bytesTotal) {
      if (typeof this.options.onChunkComplete === 'function') {
        this.options.onChunkComplete(chunkSize, bytesAccepted, bytesTotal);
      }
    }
    /**
     * Create a new upload using the creation extension by sending a POST
     * request to the endpoint. After successful creation the file will be
     * uploaded
     *
     * @api private
     */

  }, {
    key: "_createUpload",
    value: function _createUpload() {
      var _this6 = this;

      if (!this.options.endpoint) {
        this._emitError(new Error('tus: unable to create upload because no endpoint is provided'));

        return;
      }

      var req = this._openRequest('POST', this.options.endpoint);

      if (this.options.uploadLengthDeferred) {
        req.setHeader('Upload-Defer-Length', 1);
      } else {
        req.setHeader('Upload-Length', this._size);
      } // Add metadata if values have been added


      var metadata = encodeMetadata(this.options.metadata);

      if (metadata !== '') {
        req.setHeader('Upload-Metadata', metadata);
      }

      var promise;

      if (this.options.uploadDataDuringCreation && !this.options.uploadLengthDeferred) {
        this._offset = 0;
        promise = this._addChunkToRequest(req);
      } else {
        promise = this._sendRequest(req, null);
      }

      promise.then(function (res) {
        if (!inStatusCategory(res.getStatus(), 200)) {
          _this6._emitHttpError(req, res, 'tus: unexpected response while creating upload');

          return;
        }

        var location = res.getHeader('Location');

        if (location == null) {
          _this6._emitHttpError(req, res, 'tus: invalid or missing Location header');

          return;
        }

        _this6.url = resolveUrl(_this6.options.endpoint, location);
        (0, _logger.log)("Created upload at ".concat(_this6.url));

        if (typeof _this6.options._onUploadUrlAvailable === 'function') {
          _this6.options._onUploadUrlAvailable();
        }

        if (_this6._size === 0) {
          // Nothing to upload and file was successfully created
          _this6._emitSuccess();

          _this6._source.close();

          return;
        }

        _this6._saveUploadInUrlStorage().then(function () {
          if (_this6.options.uploadDataDuringCreation) {
            _this6._handleUploadResponse(req, res);
          } else {
            _this6._offset = 0;

            _this6._performUpload();
          }
        });
      })["catch"](function (err) {
        _this6._emitHttpError(req, null, 'tus: failed to create upload', err);
      });
    }
    /*
     * Try to resume an existing upload. First a HEAD request will be sent
     * to retrieve the offset. If the request fails a new upload will be
     * created. In the case of a successful response the file will be uploaded.
     *
     * @api private
     */

  }, {
    key: "_resumeUpload",
    value: function _resumeUpload() {
      var _this7 = this;

      var req = this._openRequest('HEAD', this.url);

      var promise = this._sendRequest(req, null);

      promise.then(function (res) {
        var status = res.getStatus();

        if (!inStatusCategory(status, 200)) {
          // If the upload is locked (indicated by the 423 Locked status code), we
          // emit an error instead of directly starting a new upload. This way the
          // retry logic can catch the error and will retry the upload. An upload
          // is usually locked for a short period of time and will be available
          // afterwards.
          if (status === 423) {
            _this7._emitHttpError(req, res, 'tus: upload is currently locked; retry later');

            return;
          }

          if (inStatusCategory(status, 400)) {
            // Remove stored fingerprint and corresponding endpoint,
            // on client errors since the file can not be found
            _this7._removeFromUrlStorage();
          }

          if (!_this7.options.endpoint) {
            // Don't attempt to create a new upload if no endpoint is provided.
            _this7._emitHttpError(req, res, 'tus: unable to resume upload (new upload cannot be created without an endpoint)');

            return;
          } // Try to create a new upload


          _this7.url = null;

          _this7._createUpload();

          return;
        }

        var offset = parseInt(res.getHeader('Upload-Offset'), 10);

        if (Number.isNaN(offset)) {
          _this7._emitHttpError(req, res, 'tus: invalid or missing offset value');

          return;
        }

        var length = parseInt(res.getHeader('Upload-Length'), 10);

        if (Number.isNaN(length) && !_this7.options.uploadLengthDeferred) {
          _this7._emitHttpError(req, res, 'tus: invalid or missing length value');

          return;
        }

        if (typeof _this7.options._onUploadUrlAvailable === 'function') {
          _this7.options._onUploadUrlAvailable();
        }

        _this7._saveUploadInUrlStorage().then(function () {
          // Upload has already been completed and we do not need to send additional
          // data to the server
          if (offset === length) {
            _this7._emitProgress(length, length);

            _this7._emitSuccess();

            return;
          }

          _this7._offset = offset;

          _this7._performUpload();
        });
      })["catch"](function (err) {
        _this7._emitHttpError(req, null, 'tus: failed to resume upload', err);
      });
    }
    /**
     * Start uploading the file using PATCH requests. The file will be divided
     * into chunks as specified in the chunkSize option. During the upload
     * the onProgress event handler may be invoked multiple times.
     *
     * @api private
     */

  }, {
    key: "_performUpload",
    value: function _performUpload() {
      var _this8 = this; // If the upload has been aborted, we will not send the next PATCH request.
      // This is important if the abort method was called during a callback, such
      // as onChunkComplete or onProgress.


      if (this._aborted) {
        return;
      }

      var req; // Some browser and servers may not support the PATCH method. For those
      // cases, you can tell tus-js-client to use a POST request with the
      // X-HTTP-Method-Override header for simulating a PATCH request.

      if (this.options.overridePatchMethod) {
        req = this._openRequest('POST', this.url);
        req.setHeader('X-HTTP-Method-Override', 'PATCH');
      } else {
        req = this._openRequest('PATCH', this.url);
      }

      req.setHeader('Upload-Offset', this._offset);

      var promise = this._addChunkToRequest(req);

      promise.then(function (res) {
        if (!inStatusCategory(res.getStatus(), 200)) {
          _this8._emitHttpError(req, res, 'tus: unexpected response while uploading chunk');

          return;
        }

        _this8._handleUploadResponse(req, res);
      })["catch"](function (err) {
        // Don't emit an error if the upload was aborted manually
        if (_this8._aborted) {
          return;
        }

        _this8._emitHttpError(req, null, "tus: failed to upload chunk at offset ".concat(_this8._offset), err);
      });
    }
    /**
     * _addChunktoRequest reads a chunk from the source and sends it using the
     * supplied request object. It will not handle the response.
     *
     * @api private
     */

  }, {
    key: "_addChunkToRequest",
    value: function _addChunkToRequest(req) {
      var _this9 = this;

      var start = this._offset;
      var end = this._offset + this.options.chunkSize;
      req.setProgressHandler(function (bytesSent) {
        _this9._emitProgress(start + bytesSent, _this9._size);
      });
      req.setHeader('Content-Type', 'application/offset+octet-stream'); // The specified chunkSize may be Infinity or the calcluated end position
      // may exceed the file's size. In both cases, we limit the end position to
      // the input's total size for simpler calculations and correctness.

      if ((end === Infinity || end > this._size) && !this.options.uploadLengthDeferred) {
        end = this._size;
      }

      return this._source.slice(start, end).then(function (_ref2) {
        var value = _ref2.value,
            done = _ref2.done; // If the upload length is deferred, the upload size was not specified during
        // upload creation. So, if the file reader is done reading, we know the total
        // upload size and can tell the tus server.

        if (_this9.options.uploadLengthDeferred && done) {
          _this9._size = _this9._offset + (value && value.size ? value.size : 0);
          req.setHeader('Upload-Length', _this9._size);
        }

        if (value === null) {
          return _this9._sendRequest(req);
        }

        _this9._emitProgress(_this9._offset, _this9._size);

        return _this9._sendRequest(req, value);
      });
    }
    /**
     * _handleUploadResponse is used by requests that haven been sent using _addChunkToRequest
     * and already have received a response.
     *
     * @api private
     */

  }, {
    key: "_handleUploadResponse",
    value: function _handleUploadResponse(req, res) {
      var _this10 = this;

      var offset = parseInt(res.getHeader('Upload-Offset'), 10);

      if (Number.isNaN(offset)) {
        this._emitHttpError(req, res, 'tus: invalid or missing offset value');

        return;
      }

      this._emitProgress(offset, this._size);

      this._emitChunkComplete(offset - this._offset, offset, this._size);

      this._offset = offset;

      if (offset === this._size) {
        // Yay, finally done :)
        this._emitSuccess();

        this._source.close();

        return;
      } // Not done uploading yet.


      var promise = Promise.resolve();

      if (this.options.staggerPercent !== null) {
        this._currentChunk = this._currentChunk.nextChunkInPart;

        if (this.currentChunk !== null) {
          // If the stagger is set, wait for the stagger for the current chunk.
          promise = this._currentChunk.promise;
        }
      }

      promise.then(function () {
        return _this10._performUpload();
      });
    }
    /**
     * Create a new HTTP request object with the given method and URL.
     *
     * @api private
     */

  }, {
    key: "_openRequest",
    value: function _openRequest(method, url) {
      var req = openRequest(method, url, this.options);
      this._req = req;
      return req;
    }
    /**
     * Remove the entry in the URL storage, if it has been saved before.
     *
     * @api private
     */

  }, {
    key: "_removeFromUrlStorage",
    value: function _removeFromUrlStorage() {
      var _this11 = this;

      if (!this._urlStorageKey) return;

      this._urlStorage.removeUpload(this._urlStorageKey)["catch"](function (err) {
        _this11._emitError(err);
      });

      this._urlStorageKey = null;
    }
    /**
     * Add the upload URL to the URL storage, if possible.
     *
     * @api private
     */

  }, {
    key: "_saveUploadInUrlStorage",
    value: function _saveUploadInUrlStorage() {
      var _this12 = this; // We do not store the upload URL
      // - if it was disabled in the option, or
      // - if no fingerprint was calculated for the input (i.e. a stream), or
      // - if the URL is already stored (i.e. key is set alread).


      if (!this.options.storeFingerprintForResuming || !this._fingerprint || this._urlStorageKey !== null) {
        return Promise.resolve();
      }

      var storedUpload = {
        size: this._size,
        metadata: this.options.metadata,
        creationTime: new Date().toString()
      };

      if (this._parallelUploads) {
        // Save multiple URLs if the parallelUploads option is used ...
        storedUpload.parallelUploadUrls = this._parallelUploadUrls;
      } else {
        // ... otherwise we just save the one available URL.
        storedUpload.uploadUrl = this.url;
      }

      return this._urlStorage.addUpload(this._fingerprint, storedUpload).then(function (urlStorageKey) {
        _this12._urlStorageKey = urlStorageKey;
      });
    }
    /**
     * Send a request with the provided body.
     *
     * @api private
     */

  }, {
    key: "_sendRequest",
    value: function _sendRequest(req) {
      var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      return sendRequest(req, body, this.options);
    }
  }], [{
    key: "terminate",
    value: function terminate(url) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var req = openRequest('DELETE', url, options);
      return sendRequest(req, null, options).then(function (res) {
        // A 204 response indicates a successfull request
        if (res.getStatus() === 204) {
          return;
        }

        throw new _error["default"]('tus: unexpected response while terminating upload', null, req, res);
      })["catch"](function (err) {
        if (!(err instanceof _error["default"])) {
          err = new _error["default"]('tus: failed to terminate upload', err, req, null);
        }

        if (!shouldRetry(err, 0, options)) {
          throw err;
        } // Instead of keeping track of the retry attempts, we remove the first element from the delays
        // array. If the array is empty, all retry attempts are used up and we will bubble up the error.
        // We recursively call the terminate function will removing elements from the retryDelays array.


        var delay = options.retryDelays[0];
        var remainingDelays = options.retryDelays.slice(1);

        var newOptions = _objectSpread(_objectSpread({}, options), {}, {
          retryDelays: remainingDelays
        });

        return new Promise(function (resolve) {
          return setTimeout(resolve, delay);
        }).then(function () {
          return BaseUpload.terminate(url, newOptions);
        });
      });
    }
  }]);

  return BaseUpload;
}();

function encodeMetadata(metadata) {
  return Object.entries(metadata).map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        value = _ref4[1];

    return "".concat(key, " ").concat(_jsBase.Base64.encode(String(value)));
  }).join(',');
}
/**
 * Checks whether a given status is in the range of the expected category.
 * For example, only a status between 200 and 299 will satisfy the category 200.
 *
 * @api private
 */


function inStatusCategory(status, category) {
  return status >= category && status < category + 100;
}
/**
 * Create a new HTTP request with the specified method and URL.
 * The necessary headers that are included in every request
 * will be added, including the request ID.
 *
 * @api private
 */


function openRequest(method, url, options) {
  var req = options.httpStack.createRequest(method, url);
  req.setHeader('Tus-Resumable', '1.0.0');
  var headers = options.headers || {};
  Object.entries(headers).forEach(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        name = _ref6[0],
        value = _ref6[1];

    req.setHeader(name, value);
  });

  if (options.addRequestId) {
    var requestId = (0, _uuid["default"])();
    req.setHeader('X-Request-ID', requestId);
  }

  return req;
}
/**
 * Send a request with the provided body while invoking the onBeforeRequest
 * and onAfterResponse callbacks.
 *
 * @api private
 */


function sendRequest(req, body, options) {
  var onBeforeRequestPromise = typeof options.onBeforeRequest === 'function' ? Promise.resolve(options.onBeforeRequest(req)) : Promise.resolve();
  return onBeforeRequestPromise.then(function () {
    return req.send(body).then(function (res) {
      var onAfterResponsePromise = typeof options.onAfterResponse === 'function' ? Promise.resolve(options.onAfterResponse(req, res)) : Promise.resolve();
      return onAfterResponsePromise.then(function () {
        return res;
      });
    });
  });
}
/**
 * Checks whether the browser running this code has internet access.
 * This function will always return true in the node.js environment
 *
 * @api private
 */


function isOnline() {
  var online = true;

  if (typeof window !== 'undefined' && 'navigator' in window && window.navigator.onLine === false) {
    online = false;
  }

  return online;
}
/**
 * Checks whether or not it is ok to retry a request.
 * @param {Error} err the error returned from the last request
 * @param {number} retryAttempt the number of times the request has already been retried
 * @param {object} options tus Upload options
 *
 * @api private
 */


function shouldRetry(err, retryAttempt, options) {
  // We only attempt a retry if
  // - retryDelays option is set
  // - we didn't exceed the maxium number of retries, yet, and
  // - this error was caused by a request or it's response and
  // - the error is server error (i.e. not a status 4xx except a 409 or 423) or
  // a onShouldRetry is specified and returns true
  // - the browser does not indicate that we are offline
  if (options.retryDelays == null || retryAttempt >= options.retryDelays.length || err.originalRequest == null) {
    return false;
  }

  if (options && typeof options.onShouldRetry === 'function') {
    return options.onShouldRetry(err, retryAttempt, options);
  }

  var status = err.originalResponse ? err.originalResponse.getStatus() : 0;
  return (!inStatusCategory(status, 400) || status === 409 || status === 423) && isOnline();
}
/**
 * Resolve a relative link given the origin as source. For example,
 * if a HTTP request to http://example.com/files/ returns a Location
 * header with the value /upload/abc, the resolved URL will be:
 * http://example.com/upload/abc
 */


function resolveUrl(origin, link) {
  return new _urlParse["default"](link, origin).toString();
}
/**
 * Calculate the start and end positions for the parts if an upload
 * is split into multiple parallel requests.
 *
 * @param {number} totalSize The byte size of the upload, which will be split.
 * @param {number} partCount The number in how many parts the upload will be split.
 * @return {object[]}
 * @api private
 */


function splitSizeIntoParts(totalSize, partCount) {
  var partSize = Math.floor(totalSize / partCount);
  var parts = [];

  for (var i = 0; i < partCount; i++) {
    parts.push({
      start: partSize * i,
      end: partSize * (i + 1)
    });
  }

  parts[partCount - 1].end = totalSize;
  return parts;
}
/**
 * Build the chunk staggers.
 *
 * NOTE: The code that builds parts must be kept in sync with
 * `splitSizeIntoChunkAlignedParts` in skynet-js.
 */


function buildChunkStaggers(totalSize, partCount, chunkSize) {
  // Helper function to create a new chunk in partsChunks at the given part.
  function newChunk(partsChunks, partIndex) {
    var chunksForPart = partsChunks[partIndex];
    var chunkResolve;
    var promise = new Promise(function (resolve) {
      chunkResolve = resolve;
    });
    var chunk = {
      promise: promise,
      resolve: chunkResolve,
      resolved: false,
      nextChunkStagger: null,
      nextChunkInPart: null,
      indexInPart: chunksForPart.length
    }; // Previous chunk in part should point to this chunk.

    if (chunksForPart.length > 0) {
      chunksForPart[chunksForPart.length - 1].nextChunkInPart = chunk;
    } // Push chunk to part.


    chunksForPart.push(chunk);
  } // Validation.


  if (partCount < 1) {
    throw new Error("Expected option 'partCount' to be greater than or equal to 1, was type 'number', value '".concat(partCount, "'"));
  }

  if (chunkSize < 1) {
    throw new Error("Expected option 'chunkSize' to be greater than or equal to 1, was type 'number', value '".concat(chunkSize, "'"));
  } // NOTE: Unexpected code flow. `uploadLargeFileRequest` in skynet-js should
  // not enable parallel uploads for this case.


  if (totalSize <= chunkSize) {
    throw new Error("Expected parameter 'totalSize' to be greater than the size of a chunk ('".concat(chunkSize, "'), was type 'number', value '").concat(totalSize, "'"));
  } // The lists of chunks for each part. Initialize all to empty arrays.


  var partsChunks = [];

  for (var i = 0; i < partCount; i++) {
    partsChunks.push([]);
  } // Assign chunks to parts in order, looping back to the beginning if we get to
  // the end of the parts array.


  var numFullChunks = Math.floor(totalSize / chunkSize);

  for (var _i2 = 0; _i2 < numFullChunks; _i2++) {
    newChunk(partsChunks, _i2 % partCount);
  } // Whether there is any leftover that has to go in the last part.


  var hasLeftover = totalSize % chunkSize > 0; // If there is non-chunk-aligned leftover, add a chunk for it.

  if (hasLeftover) {
    // Assign the leftover to the part after the last part that was visited, or
    // the last part in the array if all parts were used.
    //
    // NOTE: We don't need to worry about empty parts, tus ignores those.
    var lastIndex = Math.min(numFullChunks, partCount - 1);
    newChunk(partsChunks, lastIndex);
  } // Now assign the stagger order. We start at the part with the most chunks, so
  // we don't end up with any final pauses.
  //
  // NOTE: The first longest part is either the first part or the last. The latter
  // can happen. when all parts have one chunk and the last part gets the extra
  // leftover. We explicitly check all parts just to be defensive/futureproof
  // against our assumptions.


  var longestPartIndex = 0;
  var longestPartLength = partsChunks[0].length;

  for (var _i3 = 1; _i3 < partsChunks.length; _i3++) {
    if (partsChunks[_i3].length > longestPartLength) {
      longestPartIndex = _i3;
      longestPartLength = partsChunks[_i3].length;
    }
  } // Get the chunk at which to start uploading.


  var firstChunk = partsChunks[longestPartIndex][0]; // Build the stagger sequence.

  var lastChunk = null; // Loop over the chunk indices for the longest part.

  for (var _i4 = 0; _i4 < longestPartLength; _i4++) {
    // Loop over the parts, starting from the longest. This keeps a stagger
    // between chunks and prevents pauses. We roll over to the first part
    // if we need to.
    for (var j = longestPartIndex; j < longestPartIndex + partCount; j++) {
      // Roll over to the first part if we need to with the modulo.
      var index = j % partCount;

      if (partsChunks[index].length > _i4) {
        var chunk = partsChunks[index][_i4]; // Last chunk in stagger order should point to this one.

        if (lastChunk !== null) {
          lastChunk.nextChunkStagger = chunk;
        }

        lastChunk = chunk;
      }
    }
  }

  return [partsChunks, firstChunk];
}

BaseUpload.defaultOptions = defaultOptions;
var _default = BaseUpload;
exports["default"] = _default;

},{"./error":12,"./logger":13,"./uuid":16,"js-base64":52,"url-parse":57}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = uuid;
/**
 * Generate a UUID v4 based on random numbers. We intentioanlly use the less
 * secure Math.random function here since the more secure crypto.getRandomNumbers
 * is not available on all platforms.
 * This is not a problem for us since we use the UUID only for generating a
 * request ID, so we can correlate server logs to client errors.
 *
 * This function is taken from following site:
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 *
 * @return {string} The generate UUID
 */

function uuid() {
  /* eslint-disable no-bitwise */
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}

},{}],17:[function(require,module,exports){
module.exports = require('./lib/axios');
},{"./lib/axios":19}],18:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var settle = require('./../core/settle');
var cookies = require('./../helpers/cookies');
var buildURL = require('./../helpers/buildURL');
var buildFullPath = require('../core/buildFullPath');
var parseHeaders = require('./../helpers/parseHeaders');
var isURLSameOrigin = require('./../helpers/isURLSameOrigin');
var transitionalDefaults = require('../defaults/transitional');
var AxiosError = require('../core/AxiosError');
var CanceledError = require('../cancel/CanceledError');
var parseProtocol = require('../helpers/parseProtocol');

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData) && utils.isStandardBrowserEnv()) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);

    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(new AxiosError('Request aborted', AxiosError.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(new AxiosError('Network Error', AxiosError.ERR_NETWORK, config, request, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      var transitional = config.transitional || transitionalDefaults;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config,
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (!request) {
          return;
        }
        reject(!cancel || (cancel && cancel.type) ? new CanceledError() : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    var protocol = parseProtocol(fullPath);

    if (protocol && [ 'http', 'https', 'file' ].indexOf(protocol) === -1) {
      reject(new AxiosError('Unsupported protocol ' + protocol + ':', AxiosError.ERR_BAD_REQUEST, config));
      return;
    }


    // Send the request
    request.send(requestData);
  });
};

},{"../cancel/CanceledError":21,"../core/AxiosError":24,"../core/buildFullPath":26,"../defaults/transitional":32,"../helpers/parseProtocol":44,"./../core/settle":29,"./../helpers/buildURL":35,"./../helpers/cookies":37,"./../helpers/isURLSameOrigin":40,"./../helpers/parseHeaders":43,"./../utils":48}],19:[function(require,module,exports){
'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Expose Cancel & CancelToken
axios.CanceledError = require('./cancel/CanceledError');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');
axios.VERSION = require('./env/data').version;
axios.toFormData = require('./helpers/toFormData');

// Expose AxiosError class
axios.AxiosError = require('../lib/core/AxiosError');

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

// Expose isAxiosError
axios.isAxiosError = require('./helpers/isAxiosError');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

},{"../lib/core/AxiosError":24,"./cancel/CancelToken":20,"./cancel/CanceledError":21,"./cancel/isCancel":22,"./core/Axios":23,"./core/mergeConfig":28,"./defaults":31,"./env/data":33,"./helpers/bind":34,"./helpers/isAxiosError":39,"./helpers/spread":45,"./helpers/toFormData":46,"./utils":48}],20:[function(require,module,exports){
'use strict';

var CanceledError = require('./CanceledError');

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;

  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;

  // eslint-disable-next-line func-names
  this.promise.then(function(cancel) {
    if (!token._listeners) return;

    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  // eslint-disable-next-line func-names
  this.promise.then = function(onfulfilled) {
    var _resolve;
    // eslint-disable-next-line func-names
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new CanceledError(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `CanceledError` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Subscribe to the cancel signal
 */

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * Unsubscribe from the cancel signal
 */

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

},{"./CanceledError":21}],21:[function(require,module,exports){
'use strict';

var AxiosError = require('../core/AxiosError');
var utils = require('../utils');

/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function CanceledError(message) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  AxiosError.call(this, message == null ? 'canceled' : message, AxiosError.ERR_CANCELED);
  this.name = 'CanceledError';
}

utils.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});

module.exports = CanceledError;

},{"../core/AxiosError":24,"../utils":48}],22:[function(require,module,exports){
'use strict';

module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

},{}],23:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var buildURL = require('../helpers/buildURL');
var InterceptorManager = require('./InterceptorManager');
var dispatchRequest = require('./dispatchRequest');
var mergeConfig = require('./mergeConfig');
var buildFullPath = require('./buildFullPath');
var validator = require('../helpers/validator');

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(configOrUrl, config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof configOrUrl === 'string') {
    config = config || {};
    config.url = configOrUrl;
  } else {
    config = configOrUrl || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  var fullPath = buildFullPath(config.baseURL, config.url);
  return buildURL(fullPath, config.params, config.paramsSerializer);
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method: method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url: url,
        data: data
      }));
    };
  }

  Axios.prototype[method] = generateHTTPMethod();

  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});

module.exports = Axios;

},{"../helpers/buildURL":35,"../helpers/validator":47,"./../utils":48,"./InterceptorManager":25,"./buildFullPath":26,"./dispatchRequest":27,"./mergeConfig":28}],24:[function(require,module,exports){
'use strict';

var utils = require('../utils');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);
  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  response && (this.response = response);
}

utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});

var prototype = AxiosError.prototype;
var descriptors = {};

[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED'
// eslint-disable-next-line func-names
].forEach(function(code) {
  descriptors[code] = {value: code};
});

Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = function(error, code, config, request, response, customProps) {
  var axiosError = Object.create(prototype);

  utils.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  });

  AxiosError.call(axiosError, error.message, code, config, request, response);

  axiosError.name = error.name;

  customProps && Object.assign(axiosError, customProps);

  return axiosError;
};

module.exports = AxiosError;

},{"../utils":48}],25:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

},{"./../utils":48}],26:[function(require,module,exports){
'use strict';

var isAbsoluteURL = require('../helpers/isAbsoluteURL');
var combineURLs = require('../helpers/combineURLs');

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

},{"../helpers/combineURLs":36,"../helpers/isAbsoluteURL":38}],27:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var transformData = require('./transformData');
var isCancel = require('../cancel/isCancel');
var defaults = require('../defaults');
var CanceledError = require('../cancel/CanceledError');

/**
 * Throws a `CanceledError` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new CanceledError();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};

},{"../cancel/CanceledError":21,"../cancel/isCancel":22,"../defaults":31,"./../utils":48,"./transformData":30}],28:[function(require,module,exports){
'use strict';

var utils = require('../utils');

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'beforeRedirect': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };

  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
};

},{"../utils":48}],29:[function(require,module,exports){
'use strict';

var AxiosError = require('./AxiosError');

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new AxiosError(
      'Request failed with status code ' + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
};

},{"./AxiosError":24}],30:[function(require,module,exports){
'use strict';

var utils = require('./../utils');
var defaults = require('../defaults');

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};

},{"../defaults":31,"./../utils":48}],31:[function(require,module,exports){
(function (process){(function (){
'use strict';

var utils = require('../utils');
var normalizeHeaderName = require('../helpers/normalizeHeaderName');
var AxiosError = require('../core/AxiosError');
var transitionalDefaults = require('./transitional');
var toFormData = require('../helpers/toFormData');

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = require('../adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = require('../adapters/http');
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: transitionalDefaults,

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }

    var isObjectPayload = utils.isObject(data);
    var contentType = headers && headers['Content-Type'];

    var isFileList;

    if ((isFileList = utils.isFileList(data)) || (isObjectPayload && contentType === 'multipart/form-data')) {
      var _FormData = this.env && this.env.FormData;
      return toFormData(isFileList ? {'files[]': data} : data, _FormData && new _FormData());
    } else if (isObjectPayload || contentType === 'application/json') {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }

    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  env: {
    FormData: require('./env/FormData')
  },

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

}).call(this)}).call(this,require('_process'))

},{"../adapters/http":18,"../adapters/xhr":18,"../core/AxiosError":24,"../helpers/normalizeHeaderName":41,"../helpers/toFormData":46,"../utils":48,"./env/FormData":42,"./transitional":32,"_process":53}],32:[function(require,module,exports){
'use strict';

module.exports = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};

},{}],33:[function(require,module,exports){
module.exports = {
  "version": "0.27.2"
};
},{}],34:[function(require,module,exports){
'use strict';

module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

},{}],35:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

},{"./../utils":48}],36:[function(require,module,exports){
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

},{}],37:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);

},{"./../utils":48}],38:[function(require,module,exports){
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};

},{}],39:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return utils.isObject(payload) && (payload.isAxiosError === true);
};

},{"./../utils":48}],40:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);

},{"./../utils":48}],41:[function(require,module,exports){
'use strict';

var utils = require('../utils');

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

},{"../utils":48}],42:[function(require,module,exports){
// eslint-disable-next-line strict
module.exports = null;

},{}],43:[function(require,module,exports){
'use strict';

var utils = require('./../utils');

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

},{"./../utils":48}],44:[function(require,module,exports){
'use strict';

module.exports = function parseProtocol(url) {
  var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
};

},{}],45:[function(require,module,exports){
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

},{}],46:[function(require,module,exports){
(function (Buffer){(function (){
'use strict';

var utils = require('../utils');

/**
 * Convert a data object to FormData
 * @param {Object} obj
 * @param {?Object} [formData]
 * @returns {Object}
 **/

function toFormData(obj, formData) {
  // eslint-disable-next-line no-param-reassign
  formData = formData || new FormData();

  var stack = [];

  function convertValue(value) {
    if (value === null) return '';

    if (utils.isDate(value)) {
      return value.toISOString();
    }

    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }

    return value;
  }

  function build(data, parentKey) {
    if (utils.isPlainObject(data) || utils.isArray(data)) {
      if (stack.indexOf(data) !== -1) {
        throw Error('Circular reference detected in ' + parentKey);
      }

      stack.push(data);

      utils.forEach(data, function each(value, key) {
        if (utils.isUndefined(value)) return;
        var fullKey = parentKey ? parentKey + '.' + key : key;
        var arr;

        if (value && !parentKey && typeof value === 'object') {
          if (utils.endsWith(key, '{}')) {
            // eslint-disable-next-line no-param-reassign
            value = JSON.stringify(value);
          } else if (utils.endsWith(key, '[]') && (arr = utils.toArray(value))) {
            // eslint-disable-next-line func-names
            arr.forEach(function(el) {
              !utils.isUndefined(el) && formData.append(fullKey, convertValue(el));
            });
            return;
          }
        }

        build(value, fullKey);
      });

      stack.pop();
    } else {
      formData.append(parentKey, convertValue(data));
    }
  }

  build(obj);

  return formData;
}

module.exports = toFormData;

}).call(this)}).call(this,require("buffer").Buffer)

},{"../utils":48,"buffer":50}],47:[function(require,module,exports){
'use strict';

var VERSION = require('../env/data').version;
var AxiosError = require('../core/AxiosError');

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};

/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new AxiosError(
        formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
        AxiosError.ERR_DEPRECATED
      );
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new AxiosError('options must be an object', AxiosError.ERR_BAD_OPTION_VALUE);
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new AxiosError('option ' + opt + ' must be ' + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError('Unknown option ' + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
};

},{"../core/AxiosError":24,"../env/data":33}],48:[function(require,module,exports){
'use strict';

var bind = require('./helpers/bind');

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

// eslint-disable-next-line func-names
var kindOf = (function(cache) {
  // eslint-disable-next-line func-names
  return function(thing) {
    var str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  };
})(Object.create(null));

function kindOfTest(type) {
  type = type.toLowerCase();
  return function isKindOf(thing) {
    return kindOf(thing) === type;
  };
}

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return Array.isArray(val);
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
var isArrayBuffer = kindOfTest('ArrayBuffer');


/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (kindOf(val) !== 'object') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
var isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
var isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
var isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
var isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} thing The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(thing) {
  var pattern = '[object FormData]';
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) ||
    toString.call(thing) === pattern ||
    (isFunction(thing.toString) && thing.toString() === pattern)
  );
}

/**
 * Determine if a value is a URLSearchParams object
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
var isURLSearchParams = kindOfTest('URLSearchParams');

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 */

function inherits(constructor, superConstructor, props, descriptors) {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  props && Object.assign(constructor.prototype, props);
}

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function} [filter]
 * @returns {Object}
 */

function toFlatObject(sourceObj, destObj, filter) {
  var props;
  var i;
  var prop;
  var merged = {};

  destObj = destObj || {};

  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if (!merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = Object.getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

/*
 * determines whether a string ends with the characters of a specified string
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 * @returns {boolean}
 */
function endsWith(str, searchString, position) {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  var lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}


/**
 * Returns new array from array like object
 * @param {*} [thing]
 * @returns {Array}
 */
function toArray(thing) {
  if (!thing) return null;
  var i = thing.length;
  if (isUndefined(i)) return null;
  var arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}

// eslint-disable-next-line func-names
var isTypedArray = (function(TypedArray) {
  // eslint-disable-next-line func-names
  return function(thing) {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM,
  inherits: inherits,
  toFlatObject: toFlatObject,
  kindOf: kindOf,
  kindOfTest: kindOfTest,
  endsWith: endsWith,
  toArray: toArray,
  isTypedArray: isTypedArray,
  isFileList: isFileList
};

},{"./helpers/bind":34}],49:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],50:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)

},{"base64-js":49,"buffer":50,"ieee754":51}],51:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],52:[function(require,module,exports){
(function (global,Buffer){(function (){
//
// THIS FILE IS AUTOMATICALLY GENERATED! DO NOT EDIT BY HAND!
//
;
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory()
        : typeof define === 'function' && define.amd
            ? define(factory) :
            // cf. https://github.com/dankogai/js-base64/issues/119
            (function () {
                // existing version for noConflict()
                var _Base64 = global.Base64;
                var gBase64 = factory();
                gBase64.noConflict = function () {
                    global.Base64 = _Base64;
                    return gBase64;
                };
                if (global.Meteor) { // Meteor.js
                    Base64 = gBase64;
                }
                global.Base64 = gBase64;
            })();
}((typeof self !== 'undefined' ? self
    : typeof window !== 'undefined' ? window
        : typeof global !== 'undefined' ? global
            : this), function () {
    'use strict';
    /**
     *  base64.ts
     *
     *  Licensed under the BSD 3-Clause License.
     *    http://opensource.org/licenses/BSD-3-Clause
     *
     *  References:
     *    http://en.wikipedia.org/wiki/Base64
     *
     * @author Dan Kogai (https://github.com/dankogai)
     */
    var version = '3.7.2';
    /**
     * @deprecated use lowercase `version`.
     */
    var VERSION = version;
    var _hasatob = typeof atob === 'function';
    var _hasbtoa = typeof btoa === 'function';
    var _hasBuffer = typeof Buffer === 'function';
    var _TD = typeof TextDecoder === 'function' ? new TextDecoder() : undefined;
    var _TE = typeof TextEncoder === 'function' ? new TextEncoder() : undefined;
    var b64ch = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var b64chs = Array.prototype.slice.call(b64ch);
    var b64tab = (function (a) {
        var tab = {};
        a.forEach(function (c, i) { return tab[c] = i; });
        return tab;
    })(b64chs);
    var b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
    var _fromCC = String.fromCharCode.bind(String);
    var _U8Afrom = typeof Uint8Array.from === 'function'
        ? Uint8Array.from.bind(Uint8Array)
        : function (it, fn) {
            if (fn === void 0) { fn = function (x) { return x; }; }
            return new Uint8Array(Array.prototype.slice.call(it, 0).map(fn));
        };
    var _mkUriSafe = function (src) { return src
        .replace(/=/g, '').replace(/[+\/]/g, function (m0) { return m0 == '+' ? '-' : '_'; }); };
    var _tidyB64 = function (s) { return s.replace(/[^A-Za-z0-9\+\/]/g, ''); };
    /**
     * polyfill version of `btoa`
     */
    var btoaPolyfill = function (bin) {
        // console.log('polyfilled');
        var u32, c0, c1, c2, asc = '';
        var pad = bin.length % 3;
        for (var i = 0; i < bin.length;) {
            if ((c0 = bin.charCodeAt(i++)) > 255 ||
                (c1 = bin.charCodeAt(i++)) > 255 ||
                (c2 = bin.charCodeAt(i++)) > 255)
                throw new TypeError('invalid character found');
            u32 = (c0 << 16) | (c1 << 8) | c2;
            asc += b64chs[u32 >> 18 & 63]
                + b64chs[u32 >> 12 & 63]
                + b64chs[u32 >> 6 & 63]
                + b64chs[u32 & 63];
        }
        return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
    };
    /**
     * does what `window.btoa` of web browsers do.
     * @param {String} bin binary string
     * @returns {string} Base64-encoded string
     */
    var _btoa = _hasbtoa ? function (bin) { return btoa(bin); }
        : _hasBuffer ? function (bin) { return Buffer.from(bin, 'binary').toString('base64'); }
            : btoaPolyfill;
    var _fromUint8Array = _hasBuffer
        ? function (u8a) { return Buffer.from(u8a).toString('base64'); }
        : function (u8a) {
            // cf. https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/12713326#12713326
            var maxargs = 0x1000;
            var strs = [];
            for (var i = 0, l = u8a.length; i < l; i += maxargs) {
                strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
            }
            return _btoa(strs.join(''));
        };
    /**
     * converts a Uint8Array to a Base64 string.
     * @param {boolean} [urlsafe] URL-and-filename-safe a la RFC4648 §5
     * @returns {string} Base64 string
     */
    var fromUint8Array = function (u8a, urlsafe) {
        if (urlsafe === void 0) { urlsafe = false; }
        return urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
    };
    // This trick is found broken https://github.com/dankogai/js-base64/issues/130
    // const utob = (src: string) => unescape(encodeURIComponent(src));
    // reverting good old fationed regexp
    var cb_utob = function (c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (_fromCC(0xc0 | (cc >>> 6))
                    + _fromCC(0x80 | (cc & 0x3f)))
                    : (_fromCC(0xe0 | ((cc >>> 12) & 0x0f))
                        + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
                        + _fromCC(0x80 | (cc & 0x3f)));
        }
        else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (_fromCC(0xf0 | ((cc >>> 18) & 0x07))
                + _fromCC(0x80 | ((cc >>> 12) & 0x3f))
                + _fromCC(0x80 | ((cc >>> 6) & 0x3f))
                + _fromCC(0x80 | (cc & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    /**
     * @deprecated should have been internal use only.
     * @param {string} src UTF-8 string
     * @returns {string} UTF-16 string
     */
    var utob = function (u) { return u.replace(re_utob, cb_utob); };
    //
    var _encode = _hasBuffer
        ? function (s) { return Buffer.from(s, 'utf8').toString('base64'); }
        : _TE
            ? function (s) { return _fromUint8Array(_TE.encode(s)); }
            : function (s) { return _btoa(utob(s)); };
    /**
     * converts a UTF-8-encoded string to a Base64 string.
     * @param {boolean} [urlsafe] if `true` make the result URL-safe
     * @returns {string} Base64 string
     */
    var encode = function (src, urlsafe) {
        if (urlsafe === void 0) { urlsafe = false; }
        return urlsafe
            ? _mkUriSafe(_encode(src))
            : _encode(src);
    };
    /**
     * converts a UTF-8-encoded string to URL-safe Base64 RFC4648 §5.
     * @returns {string} Base64 string
     */
    var encodeURI = function (src) { return encode(src, true); };
    // This trick is found broken https://github.com/dankogai/js-base64/issues/130
    // const btou = (src: string) => decodeURIComponent(escape(src));
    // reverting good old fationed regexp
    var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
    var cb_btou = function (cccc) {
        switch (cccc.length) {
            case 4:
                var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                    | ((0x3f & cccc.charCodeAt(1)) << 12)
                    | ((0x3f & cccc.charCodeAt(2)) << 6)
                    | (0x3f & cccc.charCodeAt(3)), offset = cp - 0x10000;
                return (_fromCC((offset >>> 10) + 0xD800)
                    + _fromCC((offset & 0x3FF) + 0xDC00));
            case 3:
                return _fromCC(((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    | (0x3f & cccc.charCodeAt(2)));
            default:
                return _fromCC(((0x1f & cccc.charCodeAt(0)) << 6)
                    | (0x3f & cccc.charCodeAt(1)));
        }
    };
    /**
     * @deprecated should have been internal use only.
     * @param {string} src UTF-16 string
     * @returns {string} UTF-8 string
     */
    var btou = function (b) { return b.replace(re_btou, cb_btou); };
    /**
     * polyfill version of `atob`
     */
    var atobPolyfill = function (asc) {
        // console.log('polyfilled');
        asc = asc.replace(/\s+/g, '');
        if (!b64re.test(asc))
            throw new TypeError('malformed base64.');
        asc += '=='.slice(2 - (asc.length & 3));
        var u24, bin = '', r1, r2;
        for (var i = 0; i < asc.length;) {
            u24 = b64tab[asc.charAt(i++)] << 18
                | b64tab[asc.charAt(i++)] << 12
                | (r1 = b64tab[asc.charAt(i++)]) << 6
                | (r2 = b64tab[asc.charAt(i++)]);
            bin += r1 === 64 ? _fromCC(u24 >> 16 & 255)
                : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255)
                    : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
        }
        return bin;
    };
    /**
     * does what `window.atob` of web browsers do.
     * @param {String} asc Base64-encoded string
     * @returns {string} binary string
     */
    var _atob = _hasatob ? function (asc) { return atob(_tidyB64(asc)); }
        : _hasBuffer ? function (asc) { return Buffer.from(asc, 'base64').toString('binary'); }
            : atobPolyfill;
    //
    var _toUint8Array = _hasBuffer
        ? function (a) { return _U8Afrom(Buffer.from(a, 'base64')); }
        : function (a) { return _U8Afrom(_atob(a), function (c) { return c.charCodeAt(0); }); };
    /**
     * converts a Base64 string to a Uint8Array.
     */
    var toUint8Array = function (a) { return _toUint8Array(_unURI(a)); };
    //
    var _decode = _hasBuffer
        ? function (a) { return Buffer.from(a, 'base64').toString('utf8'); }
        : _TD
            ? function (a) { return _TD.decode(_toUint8Array(a)); }
            : function (a) { return btou(_atob(a)); };
    var _unURI = function (a) { return _tidyB64(a.replace(/[-_]/g, function (m0) { return m0 == '-' ? '+' : '/'; })); };
    /**
     * converts a Base64 string to a UTF-8 string.
     * @param {String} src Base64 string.  Both normal and URL-safe are supported
     * @returns {string} UTF-8 string
     */
    var decode = function (src) { return _decode(_unURI(src)); };
    /**
     * check if a value is a valid Base64 string
     * @param {String} src a value to check
      */
    var isValid = function (src) {
        if (typeof src !== 'string')
            return false;
        var s = src.replace(/\s+/g, '').replace(/={0,2}$/, '');
        return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
    };
    //
    var _noEnum = function (v) {
        return {
            value: v, enumerable: false, writable: true, configurable: true
        };
    };
    /**
     * extend String.prototype with relevant methods
     */
    var extendString = function () {
        var _add = function (name, body) { return Object.defineProperty(String.prototype, name, _noEnum(body)); };
        _add('fromBase64', function () { return decode(this); });
        _add('toBase64', function (urlsafe) { return encode(this, urlsafe); });
        _add('toBase64URI', function () { return encode(this, true); });
        _add('toBase64URL', function () { return encode(this, true); });
        _add('toUint8Array', function () { return toUint8Array(this); });
    };
    /**
     * extend Uint8Array.prototype with relevant methods
     */
    var extendUint8Array = function () {
        var _add = function (name, body) { return Object.defineProperty(Uint8Array.prototype, name, _noEnum(body)); };
        _add('toBase64', function (urlsafe) { return fromUint8Array(this, urlsafe); });
        _add('toBase64URI', function () { return fromUint8Array(this, true); });
        _add('toBase64URL', function () { return fromUint8Array(this, true); });
    };
    /**
     * extend Builtin prototypes with relevant methods
     */
    var extendBuiltins = function () {
        extendString();
        extendUint8Array();
    };
    var gBase64 = {
        version: version,
        VERSION: VERSION,
        atob: _atob,
        atobPolyfill: atobPolyfill,
        btoa: _btoa,
        btoaPolyfill: btoaPolyfill,
        fromBase64: decode,
        toBase64: encode,
        encode: encode,
        encodeURI: encodeURI,
        encodeURL: encodeURI,
        utob: utob,
        btou: btou,
        decode: decode,
        isValid: isValid,
        fromUint8Array: fromUint8Array,
        toUint8Array: toUint8Array,
        extendString: extendString,
        extendUint8Array: extendUint8Array,
        extendBuiltins: extendBuiltins
    };
    //
    // export Base64 to the namespace
    //
    // ES5 is yet to have Object.assign() that may make transpilers unhappy.
    // gBase64.Base64 = Object.assign({}, gBase64);
    gBase64.Base64 = {};
    Object.keys(gBase64).forEach(function (k) { return gBase64.Base64[k] = gBase64[k]; });
    return gBase64;
}));

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer)

},{"buffer":50}],53:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],54:[function(require,module,exports){
'use strict';

var has = Object.prototype.hasOwnProperty
  , undef;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 * @api private
 */
function decode(input) {
  try {
    return decodeURIComponent(input.replace(/\+/g, ' '));
  } catch (e) {
    return null;
  }
}

/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 * @api private
 */
function encode(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return null;
  }
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 * @api public
 */
function querystring(query) {
  var parser = /([^=?#&]+)=?([^&]*)/g
    , result = {}
    , part;

  while (part = parser.exec(query)) {
    var key = decode(part[1])
      , value = decode(part[2]);

    //
    // Prevent overriding of existing properties. This ensures that build-in
    // methods like `toString` or __proto__ are not overriden by malicious
    // querystrings.
    //
    // In the case if failed decoding, we want to omit the key/value pairs
    // from the result.
    //
    if (key === null || value === null || key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 * @api public
 */
function querystringify(obj, prefix) {
  prefix = prefix || '';

  var pairs = []
    , value
    , key;

  //
  // Optionally prefix with a '?' if needed
  //
  if ('string' !== typeof prefix) prefix = '?';

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];

      //
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      //
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = '';
      }

      key = encode(key);
      value = encode(value);

      //
      // If we failed to encode the strings, we should bail out as we don't
      // want to add invalid strings to the query.
      //
      if (key === null || value === null) continue;
      pairs.push(key +'='+ value);
    }
  }

  return pairs.length ? prefix + pairs.join('&') : '';
}

//
// Expose the module.
//
exports.stringify = querystringify;
exports.parse = querystring;

},{}],55:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

},{}],56:[function(require,module,exports){
'use strict';

/**
 * Check if we're required to add a port number.
 *
 * @see https://url.spec.whatwg.org/#default-port
 * @param {Number|String} port Port number we need to check
 * @param {String} protocol Protocol we need to check against.
 * @returns {Boolean} Is it a default port for the given protocol
 * @api private
 */
module.exports = function required(port, protocol) {
  protocol = protocol.split(':')[0];
  port = +port;

  if (!port) return false;

  switch (protocol) {
    case 'http':
    case 'ws':
    return port !== 80;

    case 'https':
    case 'wss':
    return port !== 443;

    case 'ftp':
    return port !== 21;

    case 'gopher':
    return port !== 70;

    case 'file':
    return false;
  }

  return port !== 0;
};

},{}],57:[function(require,module,exports){
(function (global){(function (){
'use strict';

var required = require('requires-port')
  , qs = require('querystringify')
  , controlOrWhitespace = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/
  , CRHTLF = /[\n\r\t]/g
  , slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//
  , port = /:\d+$/
  , protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i
  , windowsDriveLetter = /^[a-zA-Z]:/;

/**
 * Remove control characters and whitespace from the beginning of a string.
 *
 * @param {Object|String} str String to trim.
 * @returns {String} A new string representing `str` stripped of control
 *     characters and whitespace from its beginning.
 * @public
 */
function trimLeft(str) {
  return (str ? str : '').toString().replace(controlOrWhitespace, '');
}

/**
 * These are the parse rules for the URL parser, it informs the parser
 * about:
 *
 * 0. The char it Needs to parse, if it's a string it should be done using
 *    indexOf, RegExp using exec and NaN means set as current value.
 * 1. The property we should set when parsing this value.
 * 2. Indication if it's backwards or forward parsing, when set as number it's
 *    the value of extra chars that should be split off.
 * 3. Inherit from location if non existing in the parser.
 * 4. `toLowerCase` the resulting value.
 */
var rules = [
  ['#', 'hash'],                        // Extract from the back.
  ['?', 'query'],                       // Extract from the back.
  function sanitize(address, url) {     // Sanitize what is left of the address
    return isSpecial(url.protocol) ? address.replace(/\\/g, '/') : address;
  },
  ['/', 'pathname'],                    // Extract from the back.
  ['@', 'auth', 1],                     // Extract from the front.
  [NaN, 'host', undefined, 1, 1],       // Set left over value.
  [/:(\d*)$/, 'port', undefined, 1],    // RegExp the back.
  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
];

/**
 * These properties should not be copied or inherited from. This is only needed
 * for all non blob URL's as a blob URL does not include a hash, only the
 * origin.
 *
 * @type {Object}
 * @private
 */
var ignore = { hash: 1, query: 1 };

/**
 * The location object differs when your code is loaded through a normal page,
 * Worker or through a worker using a blob. And with the blobble begins the
 * trouble as the location object will contain the URL of the blob, not the
 * location of the page where our code is loaded in. The actual origin is
 * encoded in the `pathname` so we can thankfully generate a good "default"
 * location from it so we can generate proper relative URL's again.
 *
 * @param {Object|String} loc Optional default location object.
 * @returns {Object} lolcation object.
 * @public
 */
function lolcation(loc) {
  var globalVar;

  if (typeof window !== 'undefined') globalVar = window;
  else if (typeof global !== 'undefined') globalVar = global;
  else if (typeof self !== 'undefined') globalVar = self;
  else globalVar = {};

  var location = globalVar.location || {};
  loc = loc || location;

  var finaldestination = {}
    , type = typeof loc
    , key;

  if ('blob:' === loc.protocol) {
    finaldestination = new Url(unescape(loc.pathname), {});
  } else if ('string' === type) {
    finaldestination = new Url(loc, {});
    for (key in ignore) delete finaldestination[key];
  } else if ('object' === type) {
    for (key in loc) {
      if (key in ignore) continue;
      finaldestination[key] = loc[key];
    }

    if (finaldestination.slashes === undefined) {
      finaldestination.slashes = slashes.test(loc.href);
    }
  }

  return finaldestination;
}

/**
 * Check whether a protocol scheme is special.
 *
 * @param {String} The protocol scheme of the URL
 * @return {Boolean} `true` if the protocol scheme is special, else `false`
 * @private
 */
function isSpecial(scheme) {
  return (
    scheme === 'file:' ||
    scheme === 'ftp:' ||
    scheme === 'http:' ||
    scheme === 'https:' ||
    scheme === 'ws:' ||
    scheme === 'wss:'
  );
}

/**
 * @typedef ProtocolExtract
 * @type Object
 * @property {String} protocol Protocol matched in the URL, in lowercase.
 * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
 * @property {String} rest Rest of the URL that is not part of the protocol.
 */

/**
 * Extract protocol information from a URL with/without double slash ("//").
 *
 * @param {String} address URL we want to extract from.
 * @param {Object} location
 * @return {ProtocolExtract} Extracted information.
 * @private
 */
function extractProtocol(address, location) {
  address = trimLeft(address);
  address = address.replace(CRHTLF, '');
  location = location || {};

  var match = protocolre.exec(address);
  var protocol = match[1] ? match[1].toLowerCase() : '';
  var forwardSlashes = !!match[2];
  var otherSlashes = !!match[3];
  var slashesCount = 0;
  var rest;

  if (forwardSlashes) {
    if (otherSlashes) {
      rest = match[2] + match[3] + match[4];
      slashesCount = match[2].length + match[3].length;
    } else {
      rest = match[2] + match[4];
      slashesCount = match[2].length;
    }
  } else {
    if (otherSlashes) {
      rest = match[3] + match[4];
      slashesCount = match[3].length;
    } else {
      rest = match[4]
    }
  }

  if (protocol === 'file:') {
    if (slashesCount >= 2) {
      rest = rest.slice(2);
    }
  } else if (isSpecial(protocol)) {
    rest = match[4];
  } else if (protocol) {
    if (forwardSlashes) {
      rest = rest.slice(2);
    }
  } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
    rest = match[4];
  }

  return {
    protocol: protocol,
    slashes: forwardSlashes || isSpecial(protocol),
    slashesCount: slashesCount,
    rest: rest
  };
}

/**
 * Resolve a relative URL pathname against a base URL pathname.
 *
 * @param {String} relative Pathname of the relative URL.
 * @param {String} base Pathname of the base URL.
 * @return {String} Resolved pathname.
 * @private
 */
function resolve(relative, base) {
  if (relative === '') return base;

  var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/'))
    , i = path.length
    , last = path[i - 1]
    , unshift = false
    , up = 0;

  while (i--) {
    if (path[i] === '.') {
      path.splice(i, 1);
    } else if (path[i] === '..') {
      path.splice(i, 1);
      up++;
    } else if (up) {
      if (i === 0) unshift = true;
      path.splice(i, 1);
      up--;
    }
  }

  if (unshift) path.unshift('');
  if (last === '.' || last === '..') path.push('');

  return path.join('/');
}

/**
 * The actual URL instance. Instead of returning an object we've opted-in to
 * create an actual constructor as it's much more memory efficient and
 * faster and it pleases my OCD.
 *
 * It is worth noting that we should not use `URL` as class name to prevent
 * clashes with the global URL instance that got introduced in browsers.
 *
 * @constructor
 * @param {String} address URL we want to parse.
 * @param {Object|String} [location] Location defaults for relative paths.
 * @param {Boolean|Function} [parser] Parser for the query string.
 * @private
 */
function Url(address, location, parser) {
  address = trimLeft(address);
  address = address.replace(CRHTLF, '');

  if (!(this instanceof Url)) {
    return new Url(address, location, parser);
  }

  var relative, extracted, parse, instruction, index, key
    , instructions = rules.slice()
    , type = typeof location
    , url = this
    , i = 0;

  //
  // The following if statements allows this module two have compatibility with
  // 2 different API:
  //
  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
  //    where the boolean indicates that the query string should also be parsed.
  //
  // 2. The `URL` interface of the browser which accepts a URL, object as
  //    arguments. The supplied object will be used as default values / fall-back
  //    for relative paths.
  //
  if ('object' !== type && 'string' !== type) {
    parser = location;
    location = null;
  }

  if (parser && 'function' !== typeof parser) parser = qs.parse;

  location = lolcation(location);

  //
  // Extract protocol information before running the instructions.
  //
  extracted = extractProtocol(address || '', location);
  relative = !extracted.protocol && !extracted.slashes;
  url.slashes = extracted.slashes || relative && location.slashes;
  url.protocol = extracted.protocol || location.protocol || '';
  address = extracted.rest;

  //
  // When the authority component is absent the URL starts with a path
  // component.
  //
  if (
    extracted.protocol === 'file:' && (
      extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) ||
    (!extracted.slashes &&
      (extracted.protocol ||
        extracted.slashesCount < 2 ||
        !isSpecial(url.protocol)))
  ) {
    instructions[3] = [/(.*)/, 'pathname'];
  }

  for (; i < instructions.length; i++) {
    instruction = instructions[i];

    if (typeof instruction === 'function') {
      address = instruction(address, url);
      continue;
    }

    parse = instruction[0];
    key = instruction[1];

    if (parse !== parse) {
      url[key] = address;
    } else if ('string' === typeof parse) {
      index = parse === '@'
        ? address.lastIndexOf(parse)
        : address.indexOf(parse);

      if (~index) {
        if ('number' === typeof instruction[2]) {
          url[key] = address.slice(0, index);
          address = address.slice(index + instruction[2]);
        } else {
          url[key] = address.slice(index);
          address = address.slice(0, index);
        }
      }
    } else if ((index = parse.exec(address))) {
      url[key] = index[1];
      address = address.slice(0, index.index);
    }

    url[key] = url[key] || (
      relative && instruction[3] ? location[key] || '' : ''
    );

    //
    // Hostname, host and protocol should be lowercased so they can be used to
    // create a proper `origin`.
    //
    if (instruction[4]) url[key] = url[key].toLowerCase();
  }

  //
  // Also parse the supplied query string in to an object. If we're supplied
  // with a custom parser as function use that instead of the default build-in
  // parser.
  //
  if (parser) url.query = parser(url.query);

  //
  // If the URL is relative, resolve the pathname against the base URL.
  //
  if (
      relative
    && location.slashes
    && url.pathname.charAt(0) !== '/'
    && (url.pathname !== '' || location.pathname !== '')
  ) {
    url.pathname = resolve(url.pathname, location.pathname);
  }

  //
  // Default to a / for pathname if none exists. This normalizes the URL
  // to always have a /
  //
  if (url.pathname.charAt(0) !== '/' && isSpecial(url.protocol)) {
    url.pathname = '/' + url.pathname;
  }

  //
  // We should not add port numbers if they are already the default port number
  // for a given protocol. As the host also contains the port number we're going
  // override it with the hostname which contains no port number.
  //
  if (!required(url.port, url.protocol)) {
    url.host = url.hostname;
    url.port = '';
  }

  //
  // Parse down the `auth` for the username and password.
  //
  url.username = url.password = '';

  if (url.auth) {
    index = url.auth.indexOf(':');

    if (~index) {
      url.username = url.auth.slice(0, index);
      url.username = encodeURIComponent(decodeURIComponent(url.username));

      url.password = url.auth.slice(index + 1);
      url.password = encodeURIComponent(decodeURIComponent(url.password))
    } else {
      url.username = encodeURIComponent(decodeURIComponent(url.auth));
    }

    url.auth = url.password ? url.username +':'+ url.password : url.username;
  }

  url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
    ? url.protocol +'//'+ url.host
    : 'null';

  //
  // The href is just the compiled result.
  //
  url.href = url.toString();
}

/**
 * This is convenience method for changing properties in the URL instance to
 * insure that they all propagate correctly.
 *
 * @param {String} part          Property we need to adjust.
 * @param {Mixed} value          The newly assigned value.
 * @param {Boolean|Function} fn  When setting the query, it will be the function
 *                               used to parse the query.
 *                               When setting the protocol, double slash will be
 *                               removed from the final url if it is true.
 * @returns {URL} URL instance for chaining.
 * @public
 */
function set(part, value, fn) {
  var url = this;

  switch (part) {
    case 'query':
      if ('string' === typeof value && value.length) {
        value = (fn || qs.parse)(value);
      }

      url[part] = value;
      break;

    case 'port':
      url[part] = value;

      if (!required(value, url.protocol)) {
        url.host = url.hostname;
        url[part] = '';
      } else if (value) {
        url.host = url.hostname +':'+ value;
      }

      break;

    case 'hostname':
      url[part] = value;

      if (url.port) value += ':'+ url.port;
      url.host = value;
      break;

    case 'host':
      url[part] = value;

      if (port.test(value)) {
        value = value.split(':');
        url.port = value.pop();
        url.hostname = value.join(':');
      } else {
        url.hostname = value;
        url.port = '';
      }

      break;

    case 'protocol':
      url.protocol = value.toLowerCase();
      url.slashes = !fn;
      break;

    case 'pathname':
    case 'hash':
      if (value) {
        var char = part === 'pathname' ? '/' : '#';
        url[part] = value.charAt(0) !== char ? char + value : value;
      } else {
        url[part] = value;
      }
      break;

    case 'username':
    case 'password':
      url[part] = encodeURIComponent(value);
      break;

    case 'auth':
      var index = value.indexOf(':');

      if (~index) {
        url.username = value.slice(0, index);
        url.username = encodeURIComponent(decodeURIComponent(url.username));

        url.password = value.slice(index + 1);
        url.password = encodeURIComponent(decodeURIComponent(url.password));
      } else {
        url.username = encodeURIComponent(decodeURIComponent(value));
      }
  }

  for (var i = 0; i < rules.length; i++) {
    var ins = rules[i];

    if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
  }

  url.auth = url.password ? url.username +':'+ url.password : url.username;

  url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host
    ? url.protocol +'//'+ url.host
    : 'null';

  url.href = url.toString();

  return url;
}

/**
 * Transform the properties back in to a valid and full URL string.
 *
 * @param {Function} stringify Optional query stringify function.
 * @returns {String} Compiled version of the URL.
 * @public
 */
function toString(stringify) {
  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;

  var query
    , url = this
    , host = url.host
    , protocol = url.protocol;

  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';

  var result =
    protocol +
    ((url.protocol && url.slashes) || isSpecial(url.protocol) ? '//' : '');

  if (url.username) {
    result += url.username;
    if (url.password) result += ':'+ url.password;
    result += '@';
  } else if (url.password) {
    result += ':'+ url.password;
    result += '@';
  } else if (
    url.protocol !== 'file:' &&
    isSpecial(url.protocol) &&
    !host &&
    url.pathname !== '/'
  ) {
    //
    // Add back the empty userinfo, otherwise the original invalid URL
    // might be transformed into a valid one with `url.pathname` as host.
    //
    result += '@';
  }

  //
  // Trailing colon is removed from `url.host` when it is parsed. If it still
  // ends with a colon, then add back the trailing colon that was removed. This
  // prevents an invalid URL from being transformed into a valid one.
  //
  if (host[host.length - 1] === ':' || (port.test(url.hostname) && !url.port)) {
    host += ':';
  }

  result += host + url.pathname;

  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;

  if (url.hash) result += url.hash;

  return result;
}

Url.prototype = { set: set, toString: toString };

//
// Expose the URL parser and some additional properties that might be useful for
// others or testing.
//
Url.extractProtocol = extractProtocol;
Url.location = lolcation;
Url.trimLeft = trimLeft;
Url.qs = qs;

module.exports = Url;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"querystringify":54,"requires-port":56}],58:[function(require,module,exports){
"use strict";

require("regenerator-runtime/runtime");

// The regenerator runtime is needed since the test use functions
// with the async/await keywords. See
// https://babeljs.io/docs/en/babel-plugin-transform-regenerator
beforeEach(function () {
  // Clear localStorage before every test to prevent stored URLs to
  // interfere with our setup.
  localStorage.clear();
});

require('./test-common');

require('./test-browser-specific');

require('./test-parallel-uploads');

require('./test-parallel-stagger-uploads');

require('./test-terminate');

require('./test-end-to-end');

},{"./test-browser-specific":61,"./test-common":62,"./test-end-to-end":63,"./test-parallel-stagger-uploads":64,"./test-parallel-uploads":65,"./test-terminate":66,"regenerator-runtime/runtime":55}],59:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

module.exports = /*#__PURE__*/function () {
  var _assertUrlStorage = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(urlStorage) {
    var result, key1, key2, key3;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return urlStorage.findAllUploads();

          case 2:
            result = _context.sent;
            expect(result).toEqual([]); // Add a few uploads into the storage

            _context.next = 6;
            return urlStorage.addUpload('fingerprintA', {
              id: 1
            });

          case 6:
            key1 = _context.sent;
            _context.next = 9;
            return urlStorage.addUpload('fingerprintA', {
              id: 2
            });

          case 9:
            key2 = _context.sent;
            _context.next = 12;
            return urlStorage.addUpload('fingerprintB', {
              id: 3
            });

          case 12:
            key3 = _context.sent;
            expect(/^tus::fingerprintA::/.test(key1)).toBe(true);
            expect(/^tus::fingerprintA::/.test(key2)).toBe(true);
            expect(/^tus::fingerprintB::/.test(key3)).toBe(true); // Query the just stored uploads individually

            _context.next = 18;
            return urlStorage.findUploadsByFingerprint('fingerprintA');

          case 18:
            result = _context.sent;
            sort(result);
            expect(result).toEqual([{
              id: 1,
              urlStorageKey: key1
            }, {
              id: 2,
              urlStorageKey: key2
            }]);
            _context.next = 23;
            return urlStorage.findUploadsByFingerprint('fingerprintB');

          case 23:
            result = _context.sent;
            sort(result);
            expect(result).toEqual([{
              id: 3,
              urlStorageKey: key3
            }]); // Check that we can retrieve all stored uploads

            _context.next = 28;
            return urlStorage.findAllUploads();

          case 28:
            result = _context.sent;
            sort(result);
            expect(result).toEqual([{
              id: 1,
              urlStorageKey: key1
            }, {
              id: 2,
              urlStorageKey: key2
            }, {
              id: 3,
              urlStorageKey: key3
            }]); // Check that it can remove an upload and will not return it back

            _context.next = 33;
            return urlStorage.removeUpload(key2);

          case 33:
            _context.next = 35;
            return urlStorage.removeUpload(key3);

          case 35:
            _context.next = 37;
            return urlStorage.findUploadsByFingerprint('fingerprintA');

          case 37:
            result = _context.sent;
            expect(result).toEqual([{
              id: 1,
              urlStorageKey: key1
            }]);
            _context.next = 41;
            return urlStorage.findUploadsByFingerprint('fingerprintB');

          case 41:
            result = _context.sent;
            expect(result).toEqual([]);

          case 43:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  function assertUrlStorage(_x) {
    return _assertUrlStorage.apply(this, arguments);
  }

  return assertUrlStorage;
}(); // Sort the results from the URL storage since the order in not deterministic.


function sort(result) {
  result.sort(function (a, b) {
    return a.id - b.id;
  });
}

},{}],60:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/* eslint-disable max-classes-per-file */
var isBrowser = typeof window !== 'undefined';
var isNode = !isBrowser;
/**
 * Obtain a platform specific buffer object, which can be
 * handled by tus-js-client.
 */

function getBlob(str) {
  if (isNode) {
    return Buffer.from(str);
  }

  return new Blob(str.split(''));
}
/**
 * Create a promise and obtain the resolve/reject functions
 * outside of the Promise callback.
 */


function flatPromise() {
  var resolveFn;
  var rejectFn;
  var p = new Promise(function (resolve, reject) {
    resolveFn = resolve;
    rejectFn = reject;
  });
  return [p, resolveFn, rejectFn];
}
/**
 * Create a spy-able function which resolves a Promise
 * once it is called.
 */


function waitableFunction() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'func';

  var _flatPromise = flatPromise(),
      _flatPromise2 = _slicedToArray(_flatPromise, 2),
      promise = _flatPromise2[0],
      resolve = _flatPromise2[1];

  var fn = jasmine.createSpy(name, resolve).and.callThrough();
  fn.toBeCalled = promise;
  return fn;
}
/**
 * Create a Promise that resolves after the specified duration.
 */


function wait(delay) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, delay, 'timed out');
  });
}
/**
 * TestHttpStack implements the HTTP stack interface for tus-js-client
 * and can be used to assert outgoing requests and respond with mock data.
 */


var TestHttpStack = /*#__PURE__*/function () {
  function TestHttpStack() {
    _classCallCheck(this, TestHttpStack);

    this._pendingRequests = [];
    this._pendingWaits = [];
  }

  _createClass(TestHttpStack, [{
    key: "createRequest",
    value: function createRequest(method, url) {
      var _this = this;

      return new TestRequest(method, url, function (req) {
        if (_this._pendingWaits.length >= 1) {
          var handler = _this._pendingWaits.shift();

          handler(req);
          return;
        }

        _this._pendingRequests.push(req);
      });
    }
  }, {
    key: "nextRequest",
    value: function nextRequest() {
      var _this2 = this;

      if (this._pendingRequests.length >= 1) {
        return Promise.resolve(this._pendingRequests.shift());
      }

      return new Promise(function (resolve) {
        _this2._pendingWaits.push(resolve);
      });
    }
  }]);

  return TestHttpStack;
}();

var TestRequest = /*#__PURE__*/function () {
  function TestRequest(method, url, onRequestSend) {
    _classCallCheck(this, TestRequest);

    this.method = method;
    this.url = url;
    this.requestHeaders = {};
    this.body = null;
    this._onRequestSend = onRequestSend;

    this._onProgress = function () {};

    var _flatPromise3 = flatPromise();

    var _flatPromise4 = _slicedToArray(_flatPromise3, 3);

    this._requestPromise = _flatPromise4[0];
    this._resolveRequest = _flatPromise4[1];
    this._rejectRequest = _flatPromise4[2];
  }

  _createClass(TestRequest, [{
    key: "getMethod",
    value: function getMethod() {
      return this.method;
    }
  }, {
    key: "getURL",
    value: function getURL() {
      return this.url;
    }
  }, {
    key: "setHeader",
    value: function setHeader(header, value) {
      this.requestHeaders[header] = value;
    }
  }, {
    key: "getHeader",
    value: function getHeader(header) {
      return this.requestHeaders[header] || null;
    }
  }, {
    key: "setProgressHandler",
    value: function setProgressHandler(progressHandler) {
      this._onProgress = progressHandler;
    }
  }, {
    key: "send",
    value: function send() {
      var body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.body = body;

      if (body) {
        this._onProgress(0);

        this._onProgress(body.length || body.size || 0);
      }

      this._onRequestSend(this);

      return this._requestPromise;
    }
  }, {
    key: "abort",
    value: function abort() {
      this._rejectRequest(new Error('request aborted'));
    }
  }, {
    key: "getUnderlyingObject",
    value: function getUnderlyingObject() {
      throw new Error('not implemented');
    }
  }, {
    key: "respondWith",
    value: function respondWith(resData) {
      resData.responseHeaders = resData.responseHeaders || {};
      var res = new TestResponse(resData);

      this._resolveRequest(res);
    }
  }, {
    key: "responseError",
    value: function responseError(err) {
      this._rejectRequest(err);
    }
  }]);

  return TestRequest;
}();

var TestResponse = /*#__PURE__*/function () {
  function TestResponse(res) {
    _classCallCheck(this, TestResponse);

    this._response = res;
  }

  _createClass(TestResponse, [{
    key: "getStatus",
    value: function getStatus() {
      return this._response.status;
    }
  }, {
    key: "getHeader",
    value: function getHeader(header) {
      return this._response.responseHeaders[header];
    }
  }, {
    key: "getBody",
    value: function getBody() {
      return this._response.responseText;
    }
  }, {
    key: "getUnderlyingObject",
    value: function getUnderlyingObject() {
      throw new Error('not implemented');
    }
  }]);

  return TestResponse;
}();

module.exports = {
  TestHttpStack: TestHttpStack,
  waitableFunction: waitableFunction,
  wait: wait,
  getBlob: getBlob
};

}).call(this)}).call(this,require("buffer").Buffer)

},{"buffer":50}],61:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var assertUrlStorage = require('./helpers/assertUrlStorage');

var _require = require('./helpers/utils'),
    TestHttpStack = _require.TestHttpStack,
    waitableFunction = _require.waitableFunction,
    wait = _require.wait;

var tus = require('../..');

describe('tus', function () {
  beforeEach(function () {
    localStorage.clear();
  });
  describe('#Upload', function () {
    it('should resume an upload from a stored url', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var testStack, file, options, upload, previousUploads, req;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              localStorage.setItem('tus::fingerprinted::1337', JSON.stringify({
                uploadUrl: 'http://tus.io/uploads/resuming'
              }));
              testStack = new TestHttpStack();
              file = new Blob('hello world'.split(''));
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/uploads',
                onProgress: function onProgress() {},
                fingerprint: function fingerprint() {}
              };
              spyOn(options, 'fingerprint').and.resolveTo('fingerprinted');
              spyOn(options, 'onProgress');
              upload = new tus.Upload(file, options);
              _context.next = 9;
              return upload.findPreviousUploads();

            case 9:
              previousUploads = _context.sent;
              expect(previousUploads).toEqual([{
                uploadUrl: 'http://tus.io/uploads/resuming',
                urlStorageKey: 'tus::fingerprinted::1337'
              }]);
              upload.resumeFromPreviousUpload(previousUploads[0]);
              upload.start();
              expect(options.fingerprint).toHaveBeenCalledWith(file, upload.options);
              _context.next = 16;
              return testStack.nextRequest();

            case 16:
              req = _context.sent;
              expect(req.url).toBe('http://tus.io/uploads/resuming');
              expect(req.method).toBe('HEAD');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Length': 11,
                  'Upload-Offset': 3
                }
              });
              _context.next = 23;
              return testStack.nextRequest();

            case 23:
              req = _context.sent;
              expect(req.url).toBe('http://tus.io/uploads/resuming');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(3);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(11 - 3);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 11
                }
              });
              expect(upload.url).toBe('http://tus.io/uploads/resuming');
              expect(options.onProgress).toHaveBeenCalledWith(11, 11);

            case 33:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    describe('storing of upload urls', function () {
      var testStack = new TestHttpStack();
      var options = {
        httpStack: testStack,
        endpoint: 'http://tus.io/uploads',
        fingerprint: function fingerprint() {}
      };

      function startUpload() {
        return _startUpload.apply(this, arguments);
      }

      function _startUpload() {
        _startUpload = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
          var file, upload, req;
          return _regeneratorRuntime().wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  file = new Blob('hello world'.split(''));
                  spyOn(options, 'fingerprint').and.resolveTo('fingerprinted');
                  options.onSuccess = waitableFunction('onSuccess');
                  upload = new tus.Upload(file, options);
                  upload.start();
                  expect(options.fingerprint).toHaveBeenCalled();
                  _context5.next = 8;
                  return testStack.nextRequest();

                case 8:
                  req = _context5.sent;
                  expect(req.url).toBe('http://tus.io/uploads');
                  expect(req.method).toBe('POST');
                  req.respondWith({
                    status: 201,
                    responseHeaders: {
                      Location: '/uploads/blargh'
                    }
                  }); // Wait a short delay to allow the Promises to settle

                  _context5.next = 14;
                  return wait(10);

                case 14:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5);
        }));
        return _startUpload.apply(this, arguments);
      }

      function finishUpload() {
        return _finishUpload.apply(this, arguments);
      }

      function _finishUpload() {
        _finishUpload = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
          var req;
          return _regeneratorRuntime().wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  _context6.next = 2;
                  return testStack.nextRequest();

                case 2:
                  req = _context6.sent;
                  expect(req.url).toBe('http://tus.io/uploads/blargh');
                  expect(req.method).toBe('PATCH');
                  req.respondWith({
                    status: 204,
                    responseHeaders: {
                      'Upload-Offset': 11
                    }
                  });
                  _context6.next = 8;
                  return options.onSuccess.toBeCalled;

                case 8:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6);
        }));
        return _finishUpload.apply(this, arguments);
      }

      it('should store and retain with default options', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var key, storedUpload;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options.removeFingerprintOnSuccess = false;
                _context2.next = 3;
                return startUpload();

              case 3:
                key = localStorage.key(0);
                expect(key.indexOf('tus::fingerprinted::')).toBe(0);
                storedUpload = JSON.parse(localStorage.getItem(key));
                expect(storedUpload.uploadUrl).toBe('http://tus.io/uploads/blargh');
                expect(storedUpload.size).toBe(11);
                _context2.next = 10;
                return finishUpload();

              case 10:
                expect(localStorage.getItem(key)).toBe(JSON.stringify(storedUpload));

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      })));
      it('should store and remove with option removeFingerprintOnSuccess set', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        var key, storedUpload;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                options.removeFingerprintOnSuccess = true;
                _context3.next = 3;
                return startUpload();

              case 3:
                key = localStorage.key(0);
                expect(key.indexOf('tus::fingerprinted::')).toBe(0);
                storedUpload = JSON.parse(localStorage.getItem(key));
                expect(storedUpload.uploadUrl).toBe('http://tus.io/uploads/blargh');
                expect(storedUpload.size).toBe(11);
                _context3.next = 10;
                return finishUpload();

              case 10:
                expect(localStorage.getItem(key)).toBe(null);

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      })));
      it('should store URLs passed in using the uploadUrl option', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
        var file, options2, upload, req, key, storedUpload;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                file = new Blob('hello world'.split(''));
                options2 = {
                  httpStack: testStack,
                  uploadUrl: 'http://tus.io/uploads/storedUrl',
                  fingerprint: function fingerprint() {},
                  onSuccess: waitableFunction('onSuccess'),
                  removeFingerprintOnSuccess: true
                };
                spyOn(options2, 'fingerprint').and.resolveTo('fingerprinted');
                upload = new tus.Upload(file, options2);
                upload.start();
                expect(options2.fingerprint).toHaveBeenCalled();
                _context4.next = 8;
                return testStack.nextRequest();

              case 8:
                req = _context4.sent;
                expect(req.url).toBe('http://tus.io/uploads/storedUrl');
                expect(req.method).toBe('HEAD');
                expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
                req.respondWith({
                  status: 204,
                  responseHeaders: {
                    'Upload-Length': 11,
                    'Upload-Offset': 3
                  }
                }); // Wait a short delay to allow the Promises to settle

                _context4.next = 15;
                return wait(10);

              case 15:
                key = localStorage.key(0);
                expect(key.indexOf('tus::fingerprinted::')).toBe(0);
                storedUpload = JSON.parse(localStorage.getItem(key));
                expect(storedUpload.uploadUrl).toBe('http://tus.io/uploads/storedUrl');
                expect(storedUpload.size).toBe(11);
                _context4.next = 22;
                return testStack.nextRequest();

              case 22:
                req = _context4.sent;
                expect(req.url).toBe('http://tus.io/uploads/storedUrl');
                expect(req.method).toBe('PATCH');
                expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
                expect(req.requestHeaders['Upload-Offset']).toBe(3);
                expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
                expect(req.body.size).toBe(11 - 3);
                req.respondWith({
                  status: 204,
                  responseHeaders: {
                    'Upload-Offset': 11
                  }
                });
                _context4.next = 32;
                return options2.onSuccess.toBeCalled;

              case 32:
                // Entry in localStorage should be removed after successful upload
                expect(localStorage.getItem(key)).toBe(null);

              case 33:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      })));
    });
    it('should delete upload urls on a 4XX', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              testStack = new TestHttpStack();
              file = new Blob('hello world'.split(''));
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/uploads',
                fingerprint: function fingerprint() {}
              };
              spyOn(options, 'fingerprint').and.resolveTo('fingerprinted');
              upload = new tus.Upload(file, options);
              upload.resumeFromPreviousUpload({
                uploadUrl: 'http://tus.io/uploads/resuming',
                urlStorageKey: 'tus::fingerprinted::1337'
              });
              upload.start();
              _context7.next = 9;
              return testStack.nextRequest();

            case 9:
              req = _context7.sent;
              expect(req.url).toBe('http://tus.io/uploads/resuming');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 400
              });
              _context7.next = 15;
              return wait(10);

            case 15:
              expect(localStorage.getItem('tus::fingerprinted::1337')).toBe(null);

            case 16:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    })));
    describe('uploading data from a Reader', function () {
      function makeReader(content) {
        var readSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : content.length;
        var reader = {
          value: content.split(''),
          read: function read() {
            var value;
            var done = false;

            if (this.value.length > 0) {
              value = this.value.slice(0, readSize);
              this.value = this.value.slice(readSize);
            } else {
              done = true;
            }

            return Promise.resolve({
              value: value,
              done: done
            });
          },
          cancel: waitableFunction('cancel')
        };
        return reader;
      }

      function assertReaderUpload(_x) {
        return _assertReaderUpload.apply(this, arguments);
      }

      function _assertReaderUpload() {
        _assertReaderUpload = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(_ref6) {
          var readSize, chunkSize, reader, testStack, options, upload, req;
          return _regeneratorRuntime().wrap(function _callee14$(_context14) {
            while (1) {
              switch (_context14.prev = _context14.next) {
                case 0:
                  readSize = _ref6.readSize, chunkSize = _ref6.chunkSize;
                  reader = makeReader('hello world', readSize);
                  testStack = new TestHttpStack();
                  options = {
                    httpStack: testStack,
                    endpoint: 'http://tus.io/uploads',
                    chunkSize: chunkSize,
                    onProgress: waitableFunction('onProgress'),
                    onSuccess: waitableFunction('onSuccess'),
                    fingerprint: function fingerprint() {},
                    uploadLengthDeferred: true
                  };
                  spyOn(options, 'fingerprint').and.resolveTo('fingerprinted');
                  upload = new tus.Upload(reader, options);
                  upload.start();
                  expect(options.fingerprint).toHaveBeenCalledWith(reader, upload.options);
                  _context14.next = 10;
                  return testStack.nextRequest();

                case 10:
                  req = _context14.sent;
                  expect(req.url).toBe('http://tus.io/uploads');
                  expect(req.method).toBe('POST');
                  expect(req.requestHeaders['Upload-Length']).toBe(undefined);
                  expect(req.requestHeaders['Upload-Defer-Length']).toBe(1);
                  req.respondWith({
                    status: 201,
                    responseHeaders: {
                      Location: 'http://tus.io/uploads/blargh'
                    }
                  });
                  _context14.next = 18;
                  return testStack.nextRequest();

                case 18:
                  req = _context14.sent;
                  expect(req.url).toBe('http://tus.io/uploads/blargh');
                  expect(req.method).toBe('PATCH');
                  expect(req.requestHeaders['Upload-Offset']).toBe(0);
                  expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
                  expect(req.body.length).toBe(11);
                  req.respondWith({
                    status: 204,
                    responseHeaders: {
                      'Upload-Offset': 11
                    }
                  });
                  _context14.next = 27;
                  return options.onProgress.toBeCalled;

                case 27:
                  expect(options.onProgress).toHaveBeenCalledWith(11, null);
                  _context14.next = 30;
                  return testStack.nextRequest();

                case 30:
                  req = _context14.sent;
                  expect(req.url).toBe('http://tus.io/uploads/blargh');
                  expect(req.method).toBe('PATCH');
                  expect(req.requestHeaders['Upload-Offset']).toBe(11);
                  expect(req.requestHeaders['Upload-Length']).toBe(11);
                  expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
                  expect(req.body).toBe(null);
                  req.respondWith({
                    status: 204,
                    responseHeaders: {
                      'Upload-Offset': 11
                    }
                  });
                  _context14.next = 40;
                  return options.onSuccess.toBeCalled;

                case 40:
                  expect(upload.url).toBe('http://tus.io/uploads/blargh');
                  expect(options.onProgress).toHaveBeenCalledWith(11, 11);

                case 42:
                case "end":
                  return _context14.stop();
              }
            }
          }, _callee14);
        }));
        return _assertReaderUpload.apply(this, arguments);
      }

      it('should upload data', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return assertReaderUpload({
                  chunkSize: 100,
                  readSize: 100
                });

              case 2:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      })));
      it('should read multiple times from the reader', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return assertReaderUpload({
                  chunkSize: 100,
                  readSize: 6
                });

              case 2:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      })));
      it('should use multiple PATCH requests', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
        var reader, testStack, options, upload, req;
        return _regeneratorRuntime().wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                reader = makeReader('hello world', 1);
                testStack = new TestHttpStack();
                options = {
                  httpStack: testStack,
                  endpoint: 'http://tus.io/uploads',
                  chunkSize: 6,
                  onProgress: waitableFunction('onProgress'),
                  onSuccess: waitableFunction('onSuccess'),
                  fingerprint: function fingerprint() {},
                  uploadLengthDeferred: true
                };
                spyOn(options, 'fingerprint').and.resolveTo('fingerprinted');
                upload = new tus.Upload(reader, options);
                upload.start();
                expect(options.fingerprint).toHaveBeenCalledWith(reader, upload.options);
                _context10.next = 9;
                return testStack.nextRequest();

              case 9:
                req = _context10.sent;
                expect(req.url).toBe('http://tus.io/uploads');
                expect(req.method).toBe('POST');
                expect(req.requestHeaders['Upload-Length']).toBe(undefined);
                expect(req.requestHeaders['Upload-Defer-Length']).toBe(1);
                req.respondWith({
                  status: 201,
                  responseHeaders: {
                    Location: 'http://tus.io/uploads/blargh'
                  }
                });
                _context10.next = 17;
                return testStack.nextRequest();

              case 17:
                req = _context10.sent;
                expect(req.url).toBe('http://tus.io/uploads/blargh');
                expect(req.method).toBe('PATCH');
                expect(req.requestHeaders['Upload-Offset']).toBe(0);
                expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
                expect(req.body.length).toBe(6);
                req.respondWith({
                  status: 204,
                  responseHeaders: {
                    'Upload-Offset': 6
                  }
                });
                _context10.next = 26;
                return options.onProgress.toBeCalled;

              case 26:
                expect(options.onProgress).toHaveBeenCalledWith(6, null);
                _context10.next = 29;
                return testStack.nextRequest();

              case 29:
                req = _context10.sent;
                expect(req.url).toBe('http://tus.io/uploads/blargh');
                expect(req.method).toBe('PATCH');
                expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
                expect(req.requestHeaders['Upload-Offset']).toBe(6);
                expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
                expect(req.body.length).toBe(5);
                req.respondWith({
                  status: 204,
                  responseHeaders: {
                    'Upload-Offset': 11
                  }
                });
                _context10.next = 39;
                return testStack.nextRequest();

              case 39:
                req = _context10.sent;
                expect(req.url).toBe('http://tus.io/uploads/blargh');
                expect(req.method).toBe('PATCH');
                expect(req.requestHeaders['Upload-Offset']).toBe(11);
                expect(req.requestHeaders['Upload-Length']).toBe(11);
                expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
                expect(req.body).toBe(null);
                req.respondWith({
                  status: 204,
                  responseHeaders: {
                    'Upload-Offset': 11
                  }
                });
                _context10.next = 49;
                return options.onSuccess.toBeCalled;

              case 49:
                expect(upload.url).toBe('http://tus.io/uploads/blargh');
                expect(options.onProgress).toHaveBeenCalledWith(11, 11);

              case 51:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      })));
      it('should retry the POST request', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
        var reader, testStack, options, upload, req;
        return _regeneratorRuntime().wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                reader = makeReader('hello world', 1);
                testStack = new TestHttpStack();
                options = {
                  httpStack: testStack,
                  endpoint: 'http://tus.io/files/',
                  chunkSize: 11,
                  retryDelays: [10, 10, 10],
                  onSuccess: waitableFunction('onSuccess'),
                  uploadLengthDeferred: true
                };
                upload = new tus.Upload(reader, options);
                upload.start();
                _context11.next = 7;
                return testStack.nextRequest();

              case 7:
                req = _context11.sent;
                expect(req.url).toBe('http://tus.io/files/');
                expect(req.method).toBe('POST');
                req.respondWith({
                  status: 500
                });
                _context11.next = 13;
                return testStack.nextRequest();

              case 13:
                req = _context11.sent;
                expect(req.url).toBe('http://tus.io/files/');
                expect(req.method).toBe('POST');
                req.respondWith({
                  status: 201,
                  responseHeaders: {
                    Location: '/files/foo'
                  }
                });
                _context11.next = 19;
                return testStack.nextRequest();

              case 19:
                req = _context11.sent;
                expect(req.url).toBe('http://tus.io/files/foo');
                expect(req.method).toBe('PATCH');
                req.respondWith({
                  status: 204,
                  responseHeaders: {
                    'Upload-Offset': 11
                  }
                });
                _context11.next = 25;
                return testStack.nextRequest();

              case 25:
                req = _context11.sent;
                expect(req.url).toBe('http://tus.io/files/foo');
                expect(req.method).toBe('PATCH');
                expect(req.requestHeaders['Upload-Length']).toBe(11);
                req.respondWith({
                  status: 204,
                  responseHeaders: {
                    'Upload-Offset': 11
                  }
                });
                _context11.next = 32;
                return options.onSuccess.toBeCalled;

              case 32:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      })));
      it('should retry the first PATCH request', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12() {
        var reader, testStack, options, upload, req;
        return _regeneratorRuntime().wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                reader = makeReader('hello world', 1);
                testStack = new TestHttpStack();
                options = {
                  httpStack: testStack,
                  endpoint: 'http://tus.io/files/',
                  chunkSize: 11,
                  retryDelays: [10, 10, 10],
                  onSuccess: waitableFunction('onSuccess'),
                  uploadLengthDeferred: true
                };
                upload = new tus.Upload(reader, options);
                upload.start();
                _context12.next = 7;
                return testStack.nextRequest();

              case 7:
                req = _context12.sent;
                expect(req.url).toBe('http://tus.io/files/');
                expect(req.method).toBe('POST');
                req.respondWith({
                  status: 201,
                  responseHeaders: {
                    Location: '/files/foo'
                  }
                });
                _context12.next = 13;
                return testStack.nextRequest();

              case 13:
                req = _context12.sent;
                expect(req.url).toBe('http://tus.io/files/foo');
                expect(req.method).toBe('PATCH');
                req.respondWith({
                  status: 500
                });
                _context12.next = 19;
                return testStack.nextRequest();

              case 19:
                req = _context12.sent;
                expect(req.url).toBe('http://tus.io/files/foo');
                expect(req.method).toBe('HEAD');
                req.respondWith({
                  status: 204,
                  responseHeaders: {
                    'Upload-Offset': 0
                  }
                });
                _context12.next = 25;
                return testStack.nextRequest();

              case 25:
                req = _context12.sent;
                expect(req.url).toBe('http://tus.io/files/foo');
                expect(req.method).toBe('PATCH');
                req.respondWith({
                  status: 204,
                  responseHeaders: {
                    'Upload-Offset': 11
                  }
                });
                _context12.next = 31;
                return testStack.nextRequest();

              case 31:
                req = _context12.sent;
                expect(req.url).toBe('http://tus.io/files/foo');
                expect(req.method).toBe('PATCH');
                expect(req.requestHeaders['Upload-Length']).toBe(11);
                req.respondWith({
                  status: 204,
                  responseHeaders: {
                    'Upload-Offset': 11
                  }
                });
                _context12.next = 38;
                return options.onSuccess.toBeCalled;

              case 38:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12);
      })));
      it('should retry following PATCH requests', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13() {
        var reader, testStack, options, upload, req;
        return _regeneratorRuntime().wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                reader = makeReader('hello world there!');
                testStack = new TestHttpStack();
                options = {
                  httpStack: testStack,
                  endpoint: 'http://tus.io/files/',
                  chunkSize: 6,
                  retryDelays: [10, 10, 10],
                  onSuccess: function onSuccess() {},
                  uploadLengthDeferred: true
                };
                upload = new tus.Upload(reader, options);
                upload.start();
                _context13.next = 7;
                return testStack.nextRequest();

              case 7:
                req = _context13.sent;
                expect(req.url).toBe('http://tus.io/files/');
                expect(req.method).toBe('POST');
                req.respondWith({
                  status: 201,
                  responseHeaders: {
                    Location: '/files/foo'
                  }
                });
                _context13.next = 13;
                return testStack.nextRequest();

              case 13:
                req = _context13.sent;
                expect(req.url).toBe('http://tus.io/files/foo');
                expect(req.method).toBe('PATCH');
                req.respondWith({
                  status: 204,
                  responseHeaders: {
                    'Upload-Offset': 6
                  }
                });
                _context13.next = 19;
                return testStack.nextRequest();

              case 19:
                req = _context13.sent;
                expect(req.url).toBe('http://tus.io/files/foo');
                expect(req.method).toBe('PATCH');
                req.respondWith({
                  status: 500
                });
                _context13.next = 25;
                return testStack.nextRequest();

              case 25:
                req = _context13.sent;
                expect(req.url).toBe('http://tus.io/files/foo');
                expect(req.method).toBe('HEAD');
                req.respondWith({
                  status: 204,
                  responseHeaders: {
                    'Upload-Offset': 6
                  }
                });
                _context13.next = 31;
                return testStack.nextRequest();

              case 31:
                req = _context13.sent;
                expect(req.url).toBe('http://tus.io/files/foo');
                expect(req.method).toBe('PATCH');
                req.respondWith({
                  status: 204,
                  responseHeaders: {
                    'Upload-Offset': 12
                  }
                });
                _context13.next = 37;
                return testStack.nextRequest();

              case 37:
                req = _context13.sent;
                expect(req.url).toBe('http://tus.io/files/foo');
                expect(req.method).toBe('PATCH');
                req.respondWith({
                  status: 204,
                  responseHeaders: {
                    'Upload-Offset': 18
                  }
                });
                _context13.next = 43;
                return testStack.nextRequest();

              case 43:
                req = _context13.sent;
                expect(req.url).toBe('http://tus.io/files/foo');
                expect(req.method).toBe('PATCH');
                expect(req.requestHeaders['Upload-Length']).toBe(18);
                req.respondWith({
                  status: 204,
                  responseHeaders: {
                    'Upload-Offset': 18
                  }
                });
                _context13.next = 50;
                return options.onSuccess.toBeCalled;

              case 50:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13);
      })));
    });
    describe('resolving of URIs', function () {
      // Disable these tests for IE 10 and 11 because it's not possible to overwrite
      // the navigator.product property.
      var isIE = navigator.userAgent.indexOf('Trident/') > 0;

      if (isIE) {
        console.log('Skipping tests for React Native in Internet Explorer'); // eslint-disable-line no-console

        return;
      }

      var originalProduct = navigator.product;
      beforeEach(function () {
        jasmine.Ajax.install(); // Simulate React Native environment to enable URIs as input objects.

        Object.defineProperty(navigator, 'product', {
          value: 'ReactNative',
          configurable: true
        });
      });
      afterEach(function () {
        jasmine.Ajax.uninstall();
        Object.defineProperty(navigator, 'product', {
          value: originalProduct,
          configurable: true
        });
      });
      it('should upload a file from an URI', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15() {
        var file, testStack, options, upload, req;
        return _regeneratorRuntime().wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                file = {
                  uri: 'file:///my/file.dat'
                };
                testStack = new TestHttpStack();
                options = {
                  httpStack: testStack,
                  endpoint: 'http://tus.io/uploads',
                  onSuccess: waitableFunction('onSuccess')
                };
                upload = new tus.Upload(file, options);
                upload.start(); // Wait a short interval to make sure that the XHR has been sent.

                _context15.next = 7;
                return wait(0);

              case 7:
                req = jasmine.Ajax.requests.mostRecent();
                expect(req.url).toBe('file:///my/file.dat');
                expect(req.method).toBe('GET');
                expect(req.responseType).toBe('blob');
                req.respondWith({
                  status: 200,
                  responseHeaders: {
                    'Upload-Length': 11,
                    'Upload-Offset': 3
                  },
                  response: new Blob('hello world'.split(''))
                });
                _context15.next = 14;
                return testStack.nextRequest();

              case 14:
                req = _context15.sent;
                expect(req.url).toBe('http://tus.io/uploads');
                expect(req.method).toBe('POST');
                expect(req.requestHeaders['Upload-Length']).toBe(11);
                req.respondWith({
                  status: 201,
                  responseHeaders: {
                    Location: '/uploads/blargh'
                  }
                });
                _context15.next = 21;
                return testStack.nextRequest();

              case 21:
                req = _context15.sent;
                expect(req.url).toBe('http://tus.io/uploads/blargh');
                expect(req.method).toBe('PATCH');
                expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
                expect(req.requestHeaders['Upload-Offset']).toBe(0);
                expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
                expect(req.body.size).toBe(11);
                req.respondWith({
                  status: 204,
                  responseHeaders: {
                    'Upload-Offset': 11
                  }
                });
                _context15.next = 31;
                return options.onSuccess.toBeCalled;

              case 31:
                expect(upload.url).toBe('http://tus.io/uploads/blargh');

              case 32:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15);
      })));
      it("should emit an error if it can't resolve the URI", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16() {
        var file, options, upload, req;
        return _regeneratorRuntime().wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                file = {
                  uri: 'file:///my/file.dat'
                };
                options = {
                  endpoint: 'http://tus.io/uploads',
                  onError: waitableFunction('onError')
                };
                upload = new tus.Upload(file, options);
                upload.start(); // Wait a short interval to make sure that the XHR has been sent.

                _context16.next = 6;
                return wait(0);

              case 6:
                req = jasmine.Ajax.requests.mostRecent();
                expect(req.url).toBe('file:///my/file.dat');
                expect(req.method).toBe('GET');
                expect(req.responseType).toBe('blob');
                req.responseError();
                _context16.next = 13;
                return options.onError.toBeCalled;

              case 13:
                expect(options.onError).toHaveBeenCalledWith(new Error('tus: cannot fetch `file.uri` as Blob, make sure the uri is correct and accessible. [object Object]'));

              case 14:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16);
      })));
    });
  });
  describe('#LocalStorageUrlStorage', function () {
    it('should allow storing and retrieving uploads', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17() {
      return _regeneratorRuntime().wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              _context17.next = 2;
              return assertUrlStorage(tus.defaultOptions.urlStorage);

            case 2:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17);
    })));
  });
});

},{"../..":4,"./helpers/assertUrlStorage":59,"./helpers/utils":60}],62:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('./helpers/utils'),
    TestHttpStack = _require.TestHttpStack,
    waitableFunction = _require.waitableFunction,
    wait = _require.wait,
    getBlob = _require.getBlob;

var tus = require('../..'); // Uncomment to enable debug log from tus-js-client
// tus.enableDebugLog();


describe('tus', function () {
  describe('#isSupported', function () {
    it('should be true', function () {
      expect(tus.isSupported).toBe(true);
    });
  });
  describe('#Upload', function () {
    it('should throw if no error handler is available', function () {
      var upload = new tus.Upload(null);
      expect(upload.start.bind(upload)).toThrowError('tus: no file or stream to upload provided');
    });
    it('should throw if no endpoint and upload URL is provided', function () {
      var file = getBlob('hello world');
      var upload = new tus.Upload(file);
      expect(upload.start.bind(upload)).toThrowError('tus: neither an endpoint or an upload URL is provided');
    });
    it('should upload a file', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'https://tus.io/uploads',
                headers: {
                  Custom: 'blargh'
                },
                metadata: {
                  foo: 'hello',
                  bar: 'world',
                  nonlatin: 'słońce',
                  number: 100
                },
                withCredentials: true,
                onProgress: function onProgress() {},
                onSuccess: waitableFunction()
              };
              spyOn(options, 'onProgress');
              upload = new tus.Upload(file, options);
              upload.start();
              _context.next = 8;
              return testStack.nextRequest();

            case 8:
              req = _context.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(11); // if (isBrowser) expect(req.withCredentials).toBe(true);

              expect(req.requestHeaders['Upload-Metadata']).toBe('foo aGVsbG8=,bar d29ybGQ=,nonlatin c8WCb8WEY2U=,number MTAw');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/blargh'
                }
              });
              _context.next = 18;
              return testStack.nextRequest();

            case 18:
              req = _context.sent;
              expect(req.url).toBe('https://tus.io/uploads/blargh');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(11); // if (isBrowser) expect(req.withCredentials).toBe(true);

              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 11
                }
              });
              _context.next = 29;
              return options.onSuccess.toBeCalled;

            case 29:
              expect(upload.url).toBe('https://tus.io/uploads/blargh');
              expect(options.onProgress).toHaveBeenCalledWith(11, 11);

            case 31:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    it('should create an upload if resuming fails', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/uploads',
                uploadUrl: 'http://tus.io/uploads/resuming'
              };
              upload = new tus.Upload(file, options);
              upload.start();
              _context2.next = 7;
              return testStack.nextRequest();

            case 7:
              req = _context2.sent;
              expect(req.url).toBe('http://tus.io/uploads/resuming');
              expect(req.method).toBe('HEAD');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              req.respondWith({
                status: 404
              });
              _context2.next = 14;
              return testStack.nextRequest();

            case 14:
              req = _context2.sent;
              expect(req.url).toBe('http://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(11); // The upload URL should be cleared when tus-js.client tries to create a new upload.

              expect(upload.url).toBe(null);

            case 20:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
    it('should create an upload using the creation-with-data extension', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/uploads',
                uploadDataDuringCreation: true,
                onProgress: function onProgress() {},
                onChunkComplete: function onChunkComplete() {},
                onSuccess: waitableFunction('onSuccess')
              };
              spyOn(options, 'onProgress');
              spyOn(options, 'onChunkComplete');
              upload = new tus.Upload(file, options);
              upload.start();
              _context3.next = 9;
              return testStack.nextRequest();

            case 9:
              req = _context3.sent;
              expect(req.url).toBe('http://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(11);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(11);
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'http://tus.io/uploads/blargh',
                  'Upload-Offset': 11
                }
              });
              _context3.next = 19;
              return options.onSuccess.toBeCalled;

            case 19:
              expect(options.onProgress).toHaveBeenCalledWith(11, 11);
              expect(options.onChunkComplete).toHaveBeenCalledWith(11, 11, 11);
              expect(options.onSuccess).toHaveBeenCalled();
              expect(upload.url).toBe('http://tus.io/uploads/blargh');

            case 23:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
    it('should create an upload with partial data and continue', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/uploads',
                uploadDataDuringCreation: true,
                chunkSize: 6,
                onProgress: function onProgress() {},
                onChunkComplete: function onChunkComplete() {},
                onSuccess: waitableFunction('onSuccess')
              };
              spyOn(options, 'onProgress');
              spyOn(options, 'onChunkComplete');
              upload = new tus.Upload(file, options);
              upload.start();
              _context4.next = 9;
              return testStack.nextRequest();

            case 9:
              req = _context4.sent;
              expect(req.url).toBe('http://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(11);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(6);
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'http://tus.io/uploads/blargh',
                  'Upload-Offset': 6
                }
              });
              _context4.next = 19;
              return testStack.nextRequest();

            case 19:
              req = _context4.sent;
              // Once the second request has been sent, the progress handler must have been invoked.
              expect(options.onProgress).toHaveBeenCalledWith(6, 11);
              expect(options.onChunkComplete).toHaveBeenCalledWith(6, 6, 11);
              expect(options.onSuccess).not.toHaveBeenCalled();
              expect(upload.url).toBe('http://tus.io/uploads/blargh');
              expect(req.url).toBe('http://tus.io/uploads/blargh');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(6);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(5);
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'http://tus.io/uploads/blargh',
                  'Upload-Offset': 11
                }
              });
              _context4.next = 33;
              return options.onSuccess.toBeCalled;

            case 33:
              expect(options.onProgress).toHaveBeenCalledWith(11, 11);
              expect(options.onChunkComplete).toHaveBeenCalledWith(5, 11, 11);
              expect(options.onSuccess).toHaveBeenCalled();

            case 36:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
    it("should add the request's body and ID to errors", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      var testStack, file, options, upload, req, reqId, err;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/uploads',
                addRequestId: true,
                retryDelays: null,
                onError: waitableFunction('onError')
              };
              upload = new tus.Upload(file, options);
              upload.start();
              _context5.next = 7;
              return testStack.nextRequest();

            case 7:
              req = _context5.sent;
              expect(req.url).toBe('http://tus.io/uploads');
              expect(req.method).toBe('POST');
              reqId = req.requestHeaders['X-Request-ID'];
              expect(_typeof(reqId)).toBe('string');
              expect(reqId.length).toBe(36);
              req.respondWith({
                status: 500,
                responseText: 'server_error'
              });
              _context5.next = 16;
              return options.onError.toBeCalled;

            case 16:
              err = _context5.sent;
              expect(err.message).toBe("tus: unexpected response while creating upload, originated from request (method: POST, url: http://tus.io/uploads, response code: 500, response text: server_error, request id: ".concat(reqId, ")"));
              expect(err.originalRequest).toBeDefined();
              expect(err.originalResponse).toBeDefined();

            case 20:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));
    it('should invoke the request and response callbacks', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                uploadUrl: 'http://tus.io/uploads/foo',
                onBeforeRequest: function onBeforeRequest(req) {
                  expect(req.getURL()).toBe('http://tus.io/uploads/foo');
                  expect(req.getMethod()).toBe('HEAD');
                },
                onAfterResponse: function onAfterResponse(req, res) {
                  expect(req.getURL()).toBe('http://tus.io/uploads/foo');
                  expect(req.getMethod()).toBe('HEAD');
                  expect(res.getStatus()).toBe(204);
                  expect(res.getHeader('Upload-Offset')).toBe(11);
                },
                onSuccess: waitableFunction('onSuccess')
              };
              spyOn(options, 'onBeforeRequest');
              spyOn(options, 'onAfterResponse');
              upload = new tus.Upload(file, options);
              upload.start();
              _context6.next = 9;
              return testStack.nextRequest();

            case 9:
              req = _context6.sent;
              expect(req.url).toBe('http://tus.io/uploads/foo');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 11,
                  'Upload-Length': 11
                }
              });
              _context6.next = 15;
              return options.onSuccess.toBeCalled;

            case 15:
              expect(options.onBeforeRequest).toHaveBeenCalled();
              expect(options.onAfterResponse).toHaveBeenCalled();

            case 17:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    })));
    it('should throw an error if resuming fails and no endpoint is provided', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
      var testStack, file, options, upload, req, err;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                uploadUrl: 'http://tus.io/uploads/resuming',
                onError: waitableFunction('onError')
              };
              upload = new tus.Upload(file, options);
              upload.start();
              _context7.next = 7;
              return testStack.nextRequest();

            case 7:
              req = _context7.sent;
              expect(req.url).toBe('http://tus.io/uploads/resuming');
              expect(req.method).toBe('HEAD');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              req.respondWith({
                status: 404
              });
              _context7.next = 14;
              return options.onError.toBeCalled;

            case 14:
              err = _context7.sent;
              expect(err.message).toBe('tus: unable to resume upload (new upload cannot be created without an endpoint), originated from request (method: HEAD, url: http://tus.io/uploads/resuming, response code: 404, response text: , request id: n/a)');

            case 16:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    })));
    it('should resolve relative URLs', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io:1080/files/'
              };
              upload = new tus.Upload(file, options);
              upload.start();
              _context8.next = 7;
              return testStack.nextRequest();

            case 7:
              req = _context8.sent;
              expect(req.url).toBe('http://tus.io:1080/files/');
              expect(req.method).toBe('POST');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: '//localhost/uploads/foo'
                }
              });
              _context8.next = 13;
              return testStack.nextRequest();

            case 13:
              req = _context8.sent;
              expect(req.url).toBe('http://localhost/uploads/foo');
              expect(req.method).toBe('PATCH');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 11
                }
              });
              expect(upload.url).toBe('http://localhost/uploads/foo');

            case 18:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    })));
    it('should upload a file in chunks', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/uploads',
                chunkSize: 7,
                onSuccess: waitableFunction('onSuccess'),
                onProgress: function onProgress() {},
                onChunkComplete: function onChunkComplete() {}
              };
              spyOn(options, 'onProgress');
              spyOn(options, 'onChunkComplete');
              upload = new tus.Upload(file, options);
              upload.start();
              _context9.next = 9;
              return testStack.nextRequest();

            case 9:
              req = _context9.sent;
              expect(req.url).toBe('http://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(11);
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: '/uploads/blargh'
                }
              });
              _context9.next = 17;
              return testStack.nextRequest();

            case 17:
              req = _context9.sent;
              expect(req.url).toBe('http://tus.io/uploads/blargh');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(7);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 7
                }
              });
              _context9.next = 27;
              return testStack.nextRequest();

            case 27:
              req = _context9.sent;
              expect(req.url).toBe('http://tus.io/uploads/blargh');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(7);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(4);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 11
                }
              });
              _context9.next = 37;
              return options.onSuccess.toBeCalled;

            case 37:
              expect(upload.url).toBe('http://tus.io/uploads/blargh');
              expect(options.onProgress).toHaveBeenCalledWith(11, 11);
              expect(options.onChunkComplete).toHaveBeenCalledWith(7, 7, 11);
              expect(options.onChunkComplete).toHaveBeenCalledWith(4, 11, 11);

            case 41:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    })));
    it('should add the original request to errors', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
      var testStack, file, options, upload, req, err;
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/uploads',
                retryDelays: null,
                onError: waitableFunction('onError')
              };
              upload = new tus.Upload(file, options);
              upload.start();
              _context10.next = 7;
              return testStack.nextRequest();

            case 7:
              req = _context10.sent;
              expect(req.url).toBe('http://tus.io/uploads');
              expect(req.method).toBe('POST');
              req.respondWith({
                status: 500,
                responseHeaders: {
                  Custom: 'blargh'
                }
              });
              _context10.next = 13;
              return options.onError.toBeCalled;

            case 13:
              err = _context10.sent;
              expect(upload.url).toBe(null);
              expect(err.message).toBe('tus: unexpected response while creating upload, originated from request (method: POST, url: http://tus.io/uploads, response code: 500, response text: , request id: n/a)');
              expect(err.originalRequest).toBeDefined();
              expect(err.originalResponse).toBeDefined();
              expect(err.originalResponse.getHeader('Custom')).toBe('blargh');

            case 19:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    })));
    it('should only create an upload for empty files', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/uploads',
                onSuccess: waitableFunction('onSuccess')
              };
              upload = new tus.Upload(file, options);
              upload.start();
              _context11.next = 7;
              return testStack.nextRequest();

            case 7:
              req = _context11.sent;
              expect(req.url).toBe('http://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(0);
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'http://tus.io/uploads/empty'
                }
              });
              _context11.next = 15;
              return options.onSuccess.toBeCalled;

            case 15:
              expect(options.onSuccess).toHaveBeenCalled();

            case 16:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    })));
    it('should not resume a finished upload', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/uploads',
                onProgress: function onProgress() {},
                onSuccess: waitableFunction('onSuccess'),
                uploadUrl: 'http://tus.io/uploads/resuming'
              };
              spyOn(options, 'onProgress');
              upload = new tus.Upload(file, options);
              upload.start();
              _context12.next = 8;
              return testStack.nextRequest();

            case 8:
              req = _context12.sent;
              expect(req.url).toBe('http://tus.io/uploads/resuming');
              expect(req.method).toBe('HEAD');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Length': '11',
                  'Upload-Offset': '11'
                }
              });
              _context12.next = 15;
              return options.onSuccess.toBeCalled;

            case 15:
              expect(options.onProgress).toHaveBeenCalledWith(11, 11);
              expect(options.onSuccess).toHaveBeenCalled();

            case 17:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    })));
    it('should resume an upload from a specified url', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/uploads',
                uploadUrl: 'http://tus.io/files/upload',
                onProgress: function onProgress() {},
                onSuccess: waitableFunction('onSuccess'),
                fingerprint: function fingerprint() {}
              };
              spyOn(options, 'fingerprint').and.resolveTo('fingerprinted');
              spyOn(options, 'onProgress');
              upload = new tus.Upload(file, options);
              upload.start();
              expect(options.fingerprint).toHaveBeenCalled();
              _context13.next = 10;
              return testStack.nextRequest();

            case 10:
              req = _context13.sent;
              expect(req.url).toBe('http://tus.io/files/upload');
              expect(req.method).toBe('HEAD');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Length': 11,
                  'Upload-Offset': 3
                }
              });
              _context13.next = 17;
              return testStack.nextRequest();

            case 17:
              req = _context13.sent;
              expect(req.url).toBe('http://tus.io/files/upload');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(3);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(11 - 3);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 11
                }
              });
              _context13.next = 27;
              return options.onSuccess.toBeCalled;

            case 27:
              expect(options.onProgress).toHaveBeenCalledWith(11, 11);
              expect(upload.url).toBe('http://tus.io/files/upload');

            case 29:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    })));
    it('should resume a previously started upload', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/uploads',
                onSuccess: waitableFunction('onSuccess'),
                onError: function onError() {}
              };
              upload = new tus.Upload(file, options);
              upload.start();
              _context14.next = 7;
              return testStack.nextRequest();

            case 7:
              req = _context14.sent;
              expect(req.url).toBe('http://tus.io/uploads');
              expect(req.method).toBe('POST');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'http://tus.io/uploads/blargh'
                }
              });
              _context14.next = 13;
              return testStack.nextRequest();

            case 13:
              req = _context14.sent;
              expect(req.url).toBe('http://tus.io/uploads/blargh');
              expect(req.method).toBe('PATCH');
              upload.abort();
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 5
                }
              });
              upload.start();
              _context14.next = 21;
              return testStack.nextRequest();

            case 21:
              req = _context14.sent;
              expect(req.url).toBe('http://tus.io/uploads/blargh');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 5,
                  'Upload-Length': 11
                }
              });
              _context14.next = 27;
              return testStack.nextRequest();

            case 27:
              req = _context14.sent;
              expect(req.url).toBe('http://tus.io/uploads/blargh');
              expect(req.method).toBe('PATCH');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 11
                }
              });
              _context14.next = 33;
              return options.onSuccess.toBeCalled;

            case 33:
              expect(options.onSuccess).toHaveBeenCalled();

            case 34:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    })));
    it('should override the PATCH method', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/uploads',
                uploadUrl: 'http://tus.io/files/upload',
                overridePatchMethod: true
              };
              upload = new tus.Upload(file, options);
              upload.start();
              _context15.next = 7;
              return testStack.nextRequest();

            case 7:
              req = _context15.sent;
              expect(req.url).toBe('http://tus.io/files/upload');
              expect(req.method).toBe('HEAD');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Length': 11,
                  'Upload-Offset': 3
                }
              });
              _context15.next = 14;
              return testStack.nextRequest();

            case 14:
              req = _context15.sent;
              expect(req.url).toBe('http://tus.io/files/upload');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(3);
              expect(req.requestHeaders['X-HTTP-Method-Override']).toBe('PATCH');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 11
                }
              });

            case 21:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    })));
    it('should emit an error if an upload is locked', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/uploads',
                uploadUrl: 'http://tus.io/files/upload',
                onError: waitableFunction('onError'),
                retryDelays: null
              };
              upload = new tus.Upload(file, options);
              upload.start();
              _context16.next = 7;
              return testStack.nextRequest();

            case 7:
              req = _context16.sent;
              expect(req.url).toBe('http://tus.io/files/upload');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 423 // Locked

              });
              _context16.next = 13;
              return options.onError.toBeCalled;

            case 13:
              expect(options.onError).toHaveBeenCalledWith(new Error('tus: upload is currently locked; retry later, originated from request (method: HEAD, url: http://tus.io/files/upload, response code: 423, response text: , request id: n/a)'));

            case 14:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    })));
    it('should emit an error if no Location header is presented', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/uploads',
                onError: waitableFunction('onError'),
                retryDelays: null
              };
              upload = new tus.Upload(file, options);
              upload.start();
              _context17.next = 7;
              return testStack.nextRequest();

            case 7:
              req = _context17.sent;
              expect(req.url).toBe('http://tus.io/uploads');
              expect(req.method).toBe('POST'); // The Location header is omitted on purpose here

              req.respondWith({
                status: 201
              });
              _context17.next = 13;
              return options.onError.toBeCalled;

            case 13:
              expect(options.onError).toHaveBeenCalledWith(new Error('tus: invalid or missing Location header, originated from request (method: POST, url: http://tus.io/uploads, response code: 201, response text: , request id: n/a)'));

            case 14:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17);
    })));
    it('should throw if retryDelays is not an array', function () {
      var file = getBlob('hello world');
      var upload = new tus.Upload(file, {
        endpoint: 'http://endpoint/',
        retryDelays: 44
      });
      expect(upload.start.bind(upload)).toThrowError('tus: the `retryDelays` option must either be an array or null');
    }); // This tests ensures that tus-js-client correctly retries if the
    // response has the code 500 Internal Error, 423 Locked or 409 Conflict.

    it('should retry the upload', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee18() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/files/',
                retryDelays: [10, 10, 10],
                onSuccess: waitableFunction('onSuccess')
              };
              upload = new tus.Upload(file, options);
              upload.start();
              _context18.next = 7;
              return testStack.nextRequest();

            case 7:
              req = _context18.sent;
              expect(req.url).toBe('http://tus.io/files/');
              expect(req.method).toBe('POST');
              req.respondWith({
                status: 500
              });
              _context18.next = 13;
              return testStack.nextRequest();

            case 13:
              req = _context18.sent;
              expect(req.url).toBe('http://tus.io/files/');
              expect(req.method).toBe('POST');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: '/files/foo'
                }
              });
              _context18.next = 19;
              return testStack.nextRequest();

            case 19:
              req = _context18.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('PATCH');
              req.respondWith({
                status: 423
              });
              _context18.next = 25;
              return testStack.nextRequest();

            case 25:
              req = _context18.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  'Upload-Offset': 0,
                  'Upload-Length': 11
                }
              });
              _context18.next = 31;
              return testStack.nextRequest();

            case 31:
              req = _context18.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('PATCH');
              req.respondWith({
                status: 409
              });
              _context18.next = 37;
              return testStack.nextRequest();

            case 37:
              req = _context18.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  'Upload-Offset': 0,
                  'Upload-Length': 11
                }
              });
              _context18.next = 43;
              return testStack.nextRequest();

            case 43:
              req = _context18.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('PATCH');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 11
                }
              });
              _context18.next = 49;
              return options.onSuccess.toBeCalled;

            case 49:
              expect(options.onSuccess).toHaveBeenCalled();

            case 50:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18);
    }))); // This tests ensures that tus-js-client correctly retries if the
    // return value of onShouldRetry is true.

    it('should retry the upload when onShouldRetry specified and returns true', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee19() {
      var testStack, file, options, upload, req, _upload$_emitError$ca, _upload$_emitError$ca2, error1, _upload$_emitError$ca3, _upload$_emitError$ca4, error2;

      return _regeneratorRuntime().wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/files/',
                retryDelays: [10, 10, 10],
                onSuccess: waitableFunction('onSuccess'),
                onShouldRetry: function onShouldRetry() {
                  return true;
                }
              };
              spyOn(options, 'onShouldRetry').and.callThrough();
              spyOn(tus.Upload.prototype, '_emitError').and.callThrough();
              upload = new tus.Upload(file, options);
              upload.start();
              _context19.next = 9;
              return testStack.nextRequest();

            case 9:
              req = _context19.sent;
              expect(req.url).toBe('http://tus.io/files/');
              expect(req.method).toBe('POST');
              req.respondWith({
                status: 500
              });
              _context19.next = 15;
              return testStack.nextRequest();

            case 15:
              req = _context19.sent;
              expect(req.url).toBe('http://tus.io/files/');
              expect(req.method).toBe('POST');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: '/files/foo'
                }
              });
              _context19.next = 21;
              return testStack.nextRequest();

            case 21:
              req = _context19.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('PATCH');
              req.respondWith({
                status: 423
              });
              _context19.next = 27;
              return testStack.nextRequest();

            case 27:
              req = _context19.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  'Upload-Offset': 0,
                  'Upload-Length': 11
                }
              });
              _context19.next = 33;
              return testStack.nextRequest();

            case 33:
              req = _context19.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('PATCH');
              req.respondWith({
                status: 409
              });
              _context19.next = 39;
              return testStack.nextRequest();

            case 39:
              req = _context19.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  'Upload-Offset': 0,
                  'Upload-Length': 11
                }
              });
              _context19.next = 45;
              return testStack.nextRequest();

            case 45:
              req = _context19.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('PATCH');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 11
                }
              });
              _context19.next = 51;
              return options.onSuccess.toBeCalled;

            case 51:
              expect(options.onSuccess).toHaveBeenCalled();
              _upload$_emitError$ca = upload._emitError.calls.argsFor(0), _upload$_emitError$ca2 = _slicedToArray(_upload$_emitError$ca, 1), error1 = _upload$_emitError$ca2[0];
              expect(options.onShouldRetry).toHaveBeenCalled();
              expect(options.onShouldRetry.calls.argsFor(0)).toEqual([error1, 0, upload.options]);
              _upload$_emitError$ca3 = upload._emitError.calls.argsFor(1), _upload$_emitError$ca4 = _slicedToArray(_upload$_emitError$ca3, 1), error2 = _upload$_emitError$ca4[0];
              expect(options.onShouldRetry.calls.argsFor(1)).toEqual([error2, 1, upload.options]);

            case 57:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19);
    }))); // This tests ensures that tus-js-client correctly aborts if the
    // return value of onShouldRetry is false.

    it('should not retry the upload when callback specified and returns false', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee20() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/files/',
                retryDelays: [10, 10, 10],
                onSuccess: waitableFunction('onSuccess'),
                onError: waitableFunction('onError'),
                onShouldRetry: function onShouldRetry() {
                  return false;
                }
              };
              upload = new tus.Upload(file, options);
              upload.start();
              _context20.next = 7;
              return testStack.nextRequest();

            case 7:
              req = _context20.sent;
              expect(req.url).toBe('http://tus.io/files/');
              expect(req.method).toBe('POST'); // The error callback should not be invoked for the first error response.

              expect(options.onError).not.toHaveBeenCalled();
              req.respondWith({
                status: 500
              });
              _context20.next = 14;
              return options.onError.toBeCalled;

            case 14:
              expect(options.onSuccess).not.toHaveBeenCalled();
              expect(options.onError).toHaveBeenCalledTimes(1);

            case 16:
            case "end":
              return _context20.stop();
          }
        }
      }, _callee20);
    })));
    it('should not retry if the error has not been caused by a request', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee21() {
      var file, options, upload, error;
      return _regeneratorRuntime().wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              file = getBlob('hello world');
              options = {
                httpStack: new TestHttpStack(),
                endpoint: 'http://tus.io/files/',
                retryDelays: [10, 10, 10],
                onSuccess: function onSuccess() {},
                onError: function onError() {}
              };
              spyOn(options, 'onSuccess');
              spyOn(options, 'onError');
              upload = new tus.Upload(file, options);
              spyOn(upload, '_createUpload');
              upload.start();
              _context21.next = 9;
              return wait(200);

            case 9:
              error = new Error('custom error');

              upload._emitError(error);

              expect(upload._createUpload).toHaveBeenCalledTimes(1);
              expect(options.onError).toHaveBeenCalledWith(error);
              expect(options.onSuccess).not.toHaveBeenCalled();

            case 14:
            case "end":
              return _context21.stop();
          }
        }
      }, _callee21);
    })));
    it('should stop retrying after all delays have been used', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee22() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/files/',
                retryDelays: [10],
                onSuccess: function onSuccess() {},
                onError: waitableFunction('onError')
              };
              spyOn(options, 'onSuccess');
              upload = new tus.Upload(file, options);
              upload.start();
              _context22.next = 8;
              return testStack.nextRequest();

            case 8:
              req = _context22.sent;
              expect(req.url).toBe('http://tus.io/files/');
              expect(req.method).toBe('POST');
              req.respondWith({
                status: 500
              });
              _context22.next = 14;
              return testStack.nextRequest();

            case 14:
              req = _context22.sent;
              expect(req.url).toBe('http://tus.io/files/');
              expect(req.method).toBe('POST'); // The error callback should not be invoked for the first error response.

              expect(options.onError).not.toHaveBeenCalled();
              req.respondWith({
                status: 500
              });
              _context22.next = 21;
              return options.onError.toBeCalled;

            case 21:
              expect(options.onSuccess).not.toHaveBeenCalled();
              expect(options.onError).toHaveBeenCalledTimes(1);

            case 23:
            case "end":
              return _context22.stop();
          }
        }
      }, _callee22);
    })));
    it('should stop retrying when the abort function is called', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee23() {
      var testStack, file, options, upload, req, result;
      return _regeneratorRuntime().wrap(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/files/',
                retryDelays: [10],
                onError: function onError() {}
              };
              spyOn(options, 'onError');
              upload = new tus.Upload(file, options);
              upload.start();
              _context23.next = 8;
              return testStack.nextRequest();

            case 8:
              req = _context23.sent;
              expect(req.url).toBe('http://tus.io/files/');
              expect(req.method).toBe('POST');
              spyOn(upload, 'start').and.callThrough();
              upload.abort();
              req.respondWith({
                status: 500
              });
              _context23.next = 16;
              return Promise.race([testStack.nextRequest(), wait(100)]);

            case 16:
              result = _context23.sent;
              expect(result).toBe('timed out');

            case 18:
            case "end":
              return _context23.stop();
          }
        }
      }, _callee23);
    })));
    it('should stop upload when the abort function is called during a callback', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee24() {
      var testStack, file, options, upload, req, result;
      return _regeneratorRuntime().wrap(function _callee24$(_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/files/',
                chunkSize: 5,
                onChunkComplete: function onChunkComplete() {
                  upload.abort();
                }
              };
              spyOn(options, 'onChunkComplete').and.callThrough();
              upload = new tus.Upload(file, options);
              upload.start();
              _context24.next = 8;
              return testStack.nextRequest();

            case 8:
              req = _context24.sent;
              expect(req.url).toBe('http://tus.io/files/');
              expect(req.method).toBe('POST');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: '/files/foo'
                }
              });
              _context24.next = 14;
              return testStack.nextRequest();

            case 14:
              req = _context24.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('PATCH');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 5
                }
              });
              _context24.next = 20;
              return Promise.race([testStack.nextRequest(), wait(200)]);

            case 20:
              result = _context24.sent;
              expect(options.onChunkComplete).toHaveBeenCalled();
              expect(result).toBe('timed out');

            case 23:
            case "end":
              return _context24.stop();
          }
        }
      }, _callee24);
    })));
    it('should stop upload when the abort function is called during the POST request', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee25() {
      var testStack, file, options, upload, req, result;
      return _regeneratorRuntime().wrap(function _callee25$(_context25) {
        while (1) {
          switch (_context25.prev = _context25.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/files/',
                onError: function onError() {}
              };
              spyOn(options, 'onError').and.callThrough();
              upload = new tus.Upload(file, options);
              upload.start();
              _context25.next = 8;
              return testStack.nextRequest();

            case 8:
              req = _context25.sent;
              expect(req.url).toBe('http://tus.io/files/');
              expect(req.method).toBe('POST');
              upload.abort();
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: '/files/foo'
                }
              });
              _context25.next = 15;
              return Promise.race([testStack.nextRequest(), wait(200)]);

            case 15:
              result = _context25.sent;
              expect(options.onError).not.toHaveBeenCalled();
              expect(result).toBe('timed out');

            case 18:
            case "end":
              return _context25.stop();
          }
        }
      }, _callee25);
    })));
    it('should reset the attempt counter if an upload proceeds', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee26() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee26$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/files/',
                retryDelays: [10],
                onError: function onError() {},
                onSuccess: waitableFunction('onSuccess')
              };
              spyOn(options, 'onError');
              upload = new tus.Upload(file, options);
              upload.start();
              _context26.next = 8;
              return testStack.nextRequest();

            case 8:
              req = _context26.sent;
              expect(req.url).toBe('http://tus.io/files/');
              expect(req.method).toBe('POST');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: '/files/foo'
                }
              });
              _context26.next = 14;
              return testStack.nextRequest();

            case 14:
              req = _context26.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('PATCH');
              req.respondWith({
                status: 500
              });
              _context26.next = 20;
              return testStack.nextRequest();

            case 20:
              req = _context26.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 0,
                  'Upload-Length': 11
                }
              });
              _context26.next = 26;
              return testStack.nextRequest();

            case 26:
              req = _context26.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('PATCH');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 5
                }
              });
              _context26.next = 32;
              return testStack.nextRequest();

            case 32:
              req = _context26.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('PATCH');
              req.respondWith({
                status: 500
              });
              _context26.next = 38;
              return testStack.nextRequest();

            case 38:
              req = _context26.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 5,
                  'Upload-Length': 11
                }
              });
              _context26.next = 44;
              return testStack.nextRequest();

            case 44:
              req = _context26.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('PATCH');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 11
                }
              });
              _context26.next = 50;
              return options.onSuccess.toBeCalled;

            case 50:
              expect(options.onError).not.toHaveBeenCalled();
              expect(options.onSuccess).toHaveBeenCalled();

            case 52:
            case "end":
              return _context26.stop();
          }
        }
      }, _callee26);
    })));
  });
});

},{"../..":4,"./helpers/utils":60}],63:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var axios = require('axios');

var _require = require('./helpers/utils'),
    getBlob = _require.getBlob;

var tus = require('../..'); // Test timeout for end-to-end tests when uploading to real server.


var END_TO_END_TIMEOUT = 20 * 1000;
describe('tus', function () {
  describe('end-to-end', function () {
    it('should upload to a real tus server', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", new Promise(function (resolve, reject) {
                var file = getBlob('hello world');
                var options = {
                  endpoint: 'https://tusd.tusdemo.net/files/',
                  metadata: {
                    nonlatin: 'słońce',
                    number: 100,
                    filename: 'hello.txt',
                    filetype: 'text/plain'
                  },
                  onSuccess: function onSuccess() {
                    expect(upload.url).toMatch(/^https:\/\/tusd\.tusdemo\.net\/files\//);
                    console.log('Upload URL:', upload.url); // eslint-disable-line no-console

                    resolve(upload);
                  },
                  onError: function onError(err) {
                    reject(err);
                  }
                };
                var upload = new tus.Upload(file, options);
                upload.start();
              }).then(validateUploadContent).then(function (upload) {
                return upload.abort(true).then(function () {
                  return upload;
                });
              }).then(validateUploadDeletion));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })), END_TO_END_TIMEOUT);
    it('should upload to a real tus server with creation-with-upload', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt("return", new Promise(function (resolve, reject) {
                var file = getBlob('hello world');
                var options = {
                  endpoint: 'https://tusd.tusdemo.net/files/',
                  metadata: {
                    nonlatin: 'słońce',
                    number: 100,
                    filename: 'hello.txt',
                    filetype: 'text/plain'
                  },
                  onSuccess: function onSuccess() {
                    expect(upload.url).toMatch(/^https:\/\/tusd\.tusdemo\.net\/files\//);
                    console.log('Upload URL:', upload.url); // eslint-disable-line no-console

                    resolve(upload);
                  },
                  onError: function onError(err) {
                    reject(err);
                  }
                };
                var upload = new tus.Upload(file, options);
                upload.start();
              }).then(validateUploadContent));

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })), END_TO_END_TIMEOUT);
  });
});

function validateUploadContent(upload) {
  return axios.get(upload.url).then(function (res) {
    expect(res.status).toBe(200);
    expect(res.data).toBe('hello world');
    return validateUploadMetadata(upload);
  });
}

function validateUploadMetadata(upload) {
  return axios.head(upload.url, {
    headers: {
      'Tus-Resumable': '1.0.0'
    }
  }).then(function (res) {
    expect(res.status).toBe(200);
    expect(res.data).toBe('');
    expect(res.headers['tus-resumable']).toBe('1.0.0');
    expect(res.headers['upload-offset']).toBe('11');
    expect(res.headers['upload-length']).toBe('11'); // The values in the Upload-Metadata header may not be in the same
    // order as we submitted them (the specification does not require
    // that). Therefore, we split the values and verify that each one
    // is present.

    var metadataStr = res.headers['upload-metadata'];
    expect(metadataStr).toBeTruthy();
    var metadata = metadataStr.split(',');
    expect(metadata).toContain('filename aGVsbG8udHh0');
    expect(metadata).toContain('filetype dGV4dC9wbGFpbg==');
    expect(metadata).toContain('nonlatin c8WCb8WEY2U=');
    expect(metadata).toContain('number MTAw');
    expect(metadata.length).toBe(4);
    return upload;
  });
}

function validateUploadDeletion(upload) {
  return axios.get(upload.url, {
    validateStatus: function validateStatus(status) {
      return status === 404;
    }
  }).then(function (res) {
    expect(res.status).toBe(404);
    return upload;
  });
}

},{"../..":4,"./helpers/utils":60,"axios":17}],64:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* eslint-disable no-lone-blocks */
var _require = require('./helpers/utils'),
    TestHttpStack = _require.TestHttpStack,
    waitableFunction = _require.waitableFunction,
    getBlob = _require.getBlob;

var tus = require('../..');

describe('tus', function () {
  describe('parallel uploading with stagger', function () {
    it('should throw if staggerPercent is passed without parallelUploads', function () {
      var file = getBlob('hello world');
      var upload = new tus.Upload(file, {
        endpoint: 'https://tus.io/uploads',
        staggerPercent: 50,
        uploadUrl: 'foo'
      });
      expect(upload.start.bind(upload)).toThrowError('tus: cannot use the staggerPercent option when parallelUploads is disabled');
    });
    it('should stagger a multi-part upload, one chunk per part', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var testStack, testUrlStorage, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              testStack = new TestHttpStack();
              testUrlStorage = {
                addUpload: function addUpload(fingerprint, upload) {
                  expect(fingerprint).toBe('fingerprinted');
                  expect(upload.uploadUrl).toBeUndefined();
                  expect(upload.size).toBe(10);
                  expect(upload.parallelUploadUrls).toEqual(['https://tus.io/uploads/upload1', 'https://tus.io/uploads/upload2']);
                  return Promise.resolve('tus::fingerprinted::1337');
                },
                removeUpload: function removeUpload(urlStorageKey) {
                  expect(urlStorageKey).toBe('tus::fingerprinted::1337');
                  return Promise.resolve();
                }
              };
              spyOn(testUrlStorage, 'removeUpload').and.callThrough();
              spyOn(testUrlStorage, 'addUpload').and.callThrough();
              file = getBlob('helloworld');
              options = {
                httpStack: testStack,
                urlStorage: testUrlStorage,
                storeFingerprintForResuming: true,
                removeFingerprintOnSuccess: true,
                chunkSize: 5,
                parallelUploads: 2,
                splitSizeIntoParts: function splitSizeIntoParts() {
                  return [{
                    start: 0,
                    end: 5
                  }, {
                    start: 5,
                    end: 10
                  }];
                },
                staggerPercent: 50,
                retryDelays: [10],
                endpoint: 'https://tus.io/uploads',
                headers: {
                  Custom: 'blargh'
                },
                metadata: {
                  foo: 'hello'
                },
                onProgress: function onProgress() {},
                onSuccess: waitableFunction(),
                fingerprint: function fingerprint() {
                  return Promise.resolve('fingerprinted');
                }
              };
              spyOn(options, 'onProgress');
              upload = new tus.Upload(file, options);
              upload.start();
              _context.next = 11;
              return testStack.nextRequest();

            case 11:
              req = _context.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(5);
              expect(req.requestHeaders['Upload-Concat']).toBe('partial');
              expect(req.requestHeaders['Upload-Metadata']).toBeUndefined();
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload1'
                }
              });
              _context.next = 22;
              return testStack.nextRequest();

            case 22:
              req = _context.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload1');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(5);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 5
                }
              });
              _context.next = 33;
              return testStack.nextRequest();

            case 33:
              req = _context.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(5);
              expect(req.requestHeaders['Upload-Concat']).toBe('partial');
              expect(req.requestHeaders['Upload-Metadata']).toBeUndefined();
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload2'
                }
              });
              _context.next = 44;
              return testStack.nextRequest();

            case 44:
              req = _context.sent;
              // Assert that the URLs have been stored.
              expect(testUrlStorage.addUpload).toHaveBeenCalled();
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(5); // Return an error to ensure that the individual partial upload is properly retried.

              req.respondWith({
                status: 500
              });
              _context.next = 56;
              return testStack.nextRequest();

            case 56:
              req = _context.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Length': 10,
                  'Upload-Offset': 0
                }
              });
              _context.next = 62;
              return testStack.nextRequest();

            case 62:
              req = _context.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(5);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 5
                }
              });
              _context.next = 73;
              return testStack.nextRequest();

            case 73:
              req = _context.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBeUndefined();
              expect(req.requestHeaders['Upload-Concat']).toBe('final;https://tus.io/uploads/upload1 https://tus.io/uploads/upload2');
              expect(req.requestHeaders['Upload-Metadata']).toBe('foo aGVsbG8=');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload3'
                }
              });
              _context.next = 84;
              return options.onSuccess.toBeCalled;

            case 84:
              expect(upload.url).toBe('https://tus.io/uploads/upload3');
              expect(options.onProgress).toHaveBeenCalledWith(5, 10);
              expect(options.onProgress).toHaveBeenCalledWith(10, 10);
              expect(testUrlStorage.removeUpload).toHaveBeenCalled();

            case 88:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    it('should stagger a multi-part upload, mix of chunk amounts per part', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var testStack, testUrlStorage, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              testStack = new TestHttpStack();
              testUrlStorage = {
                addUpload: function addUpload(fingerprint, upload) {
                  expect(fingerprint).toBe('fingerprinted');
                  expect(upload.uploadUrl).toBeUndefined();
                  expect(upload.size).toBe(15);
                  expect(upload.parallelUploadUrls).toEqual(['https://tus.io/uploads/upload1', 'https://tus.io/uploads/upload2']);
                  return Promise.resolve('tus::fingerprinted::1337');
                },
                removeUpload: function removeUpload(urlStorageKey) {
                  expect(urlStorageKey).toBe('tus::fingerprinted::1337');
                  return Promise.resolve();
                }
              };
              spyOn(testUrlStorage, 'removeUpload').and.callThrough();
              spyOn(testUrlStorage, 'addUpload').and.callThrough();
              file = getBlob('hello world1234');
              options = {
                httpStack: testStack,
                urlStorage: testUrlStorage,
                storeFingerprintForResuming: true,
                removeFingerprintOnSuccess: true,
                chunkSize: 5,
                parallelUploads: 2,
                splitSizeIntoParts: function splitSizeIntoParts() {
                  return [{
                    start: 0,
                    end: 10
                  }, {
                    start: 10,
                    end: 15
                  }];
                },
                staggerPercent: 50,
                retryDelays: [10],
                endpoint: 'https://tus.io/uploads',
                headers: {
                  Custom: 'blargh'
                },
                metadata: {
                  foo: 'hello'
                },
                onProgress: function onProgress() {},
                onSuccess: waitableFunction(),
                fingerprint: function fingerprint() {
                  return Promise.resolve('fingerprinted');
                }
              };
              spyOn(options, 'onProgress');
              upload = new tus.Upload(file, options);
              upload.start();
              _context2.next = 11;
              return testStack.nextRequest();

            case 11:
              req = _context2.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(10);
              expect(req.requestHeaders['Upload-Concat']).toBe('partial');
              expect(req.requestHeaders['Upload-Metadata']).toBeUndefined();
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload1'
                }
              });
              _context2.next = 22;
              return testStack.nextRequest();

            case 22:
              req = _context2.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload1');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(5);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 5
                }
              });
              _context2.next = 33;
              return testStack.nextRequest();

            case 33:
              req = _context2.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(5);
              expect(req.requestHeaders['Upload-Concat']).toBe('partial');
              expect(req.requestHeaders['Upload-Metadata']).toBeUndefined();
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload2'
                }
              });
              _context2.next = 44;
              return testStack.nextRequest();

            case 44:
              req = _context2.sent;
              // Assert that the URLs have been stored.
              expect(testUrlStorage.addUpload).toHaveBeenCalled();
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(5); // Return an error to ensure that the individual partial upload is properly retried.

              req.respondWith({
                status: 500
              });
              _context2.next = 56;
              return testStack.nextRequest();

            case 56:
              req = _context2.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload1');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(5);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(5);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 10
                }
              });
              _context2.next = 67;
              return testStack.nextRequest();

            case 67:
              req = _context2.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Length': 15,
                  'Upload-Offset': 0
                }
              });
              _context2.next = 73;
              return testStack.nextRequest();

            case 73:
              req = _context2.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(5);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 5
                }
              });
              _context2.next = 84;
              return testStack.nextRequest();

            case 84:
              req = _context2.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBeUndefined();
              expect(req.requestHeaders['Upload-Concat']).toBe('final;https://tus.io/uploads/upload1 https://tus.io/uploads/upload2');
              expect(req.requestHeaders['Upload-Metadata']).toBe('foo aGVsbG8=');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload3'
                }
              });
              _context2.next = 95;
              return options.onSuccess.toBeCalled;

            case 95:
              expect(upload.url).toBe('https://tus.io/uploads/upload3');
              expect(options.onProgress).toHaveBeenCalledWith(5, 15);
              expect(options.onProgress).toHaveBeenCalledWith(10, 15);
              expect(options.onProgress).toHaveBeenCalledWith(15, 15);
              expect(testUrlStorage.removeUpload).toHaveBeenCalled();

            case 100:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
    it('should stagger a multi-part upload, one chunk per part, last part having leftover', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var testStack, testUrlStorage, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              testStack = new TestHttpStack();
              testUrlStorage = {
                addUpload: function addUpload(fingerprint, upload) {
                  expect(fingerprint).toBe('fingerprinted');
                  expect(upload.uploadUrl).toBeUndefined();
                  expect(upload.size).toBe(11);
                  expect(upload.parallelUploadUrls).toEqual(['https://tus.io/uploads/upload1', 'https://tus.io/uploads/upload2']);
                  return Promise.resolve('tus::fingerprinted::1337');
                },
                removeUpload: function removeUpload(urlStorageKey) {
                  expect(urlStorageKey).toBe('tus::fingerprinted::1337');
                  return Promise.resolve();
                }
              };
              spyOn(testUrlStorage, 'removeUpload').and.callThrough();
              spyOn(testUrlStorage, 'addUpload').and.callThrough();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                urlStorage: testUrlStorage,
                storeFingerprintForResuming: true,
                removeFingerprintOnSuccess: true,
                chunkSize: 5,
                parallelUploads: 2,
                splitSizeIntoParts: function splitSizeIntoParts() {
                  return [{
                    start: 0,
                    end: 5
                  }, {
                    start: 5,
                    end: 11
                  }];
                },
                staggerPercent: 50,
                retryDelays: [10],
                endpoint: 'https://tus.io/uploads',
                headers: {
                  Custom: 'blargh'
                },
                metadata: {
                  foo: 'hello'
                },
                onProgress: function onProgress() {},
                onSuccess: waitableFunction(),
                fingerprint: function fingerprint() {
                  return Promise.resolve('fingerprinted');
                }
              };
              spyOn(options, 'onProgress');
              upload = new tus.Upload(file, options);
              upload.start();
              _context3.next = 11;
              return testStack.nextRequest();

            case 11:
              req = _context3.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(6);
              expect(req.requestHeaders['Upload-Concat']).toBe('partial');
              expect(req.requestHeaders['Upload-Metadata']).toBeUndefined();
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload2'
                }
              });
              _context3.next = 22;
              return testStack.nextRequest();

            case 22:
              req = _context3.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(5); // Return an error to ensure that the individual partial upload is properly retried.

              req.respondWith({
                status: 500
              });
              _context3.next = 33;
              return testStack.nextRequest();

            case 33:
              req = _context3.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(5);
              expect(req.requestHeaders['Upload-Concat']).toBe('partial');
              expect(req.requestHeaders['Upload-Metadata']).toBeUndefined();
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload1'
                }
              });
              _context3.next = 44;
              return testStack.nextRequest();

            case 44:
              req = _context3.sent;
              // Assert that the URLs have been stored.
              expect(testUrlStorage.addUpload).toHaveBeenCalled();
              expect(req.url).toBe('https://tus.io/uploads/upload1');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(5);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 5
                }
              });
              _context3.next = 56;
              return testStack.nextRequest();

            case 56:
              req = _context3.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Length': 11,
                  'Upload-Offset': 0
                }
              });
              _context3.next = 62;
              return testStack.nextRequest();

            case 62:
              req = _context3.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(5);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 6
                }
              });
              _context3.next = 73;
              return testStack.nextRequest();

            case 73:
              req = _context3.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBeUndefined();
              expect(req.requestHeaders['Upload-Concat']).toBe('final;https://tus.io/uploads/upload1 https://tus.io/uploads/upload2');
              expect(req.requestHeaders['Upload-Metadata']).toBe('foo aGVsbG8=');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload3'
                }
              });
              _context3.next = 84;
              return options.onSuccess.toBeCalled;

            case 84:
              expect(upload.url).toBe('https://tus.io/uploads/upload3');
              expect(options.onProgress).toHaveBeenCalledWith(5, 11);
              expect(options.onProgress).toHaveBeenCalledWith(10, 11);
              expect(options.onProgress).toHaveBeenCalledWith(11, 11);
              expect(testUrlStorage.removeUpload).toHaveBeenCalled();

            case 89:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
    it('should stagger a multi-part upload, mix of chunk amounts per part, last part having leftover', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var testStack, testUrlStorage, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              testStack = new TestHttpStack();
              testUrlStorage = {
                addUpload: function addUpload(fingerprint, upload) {
                  expect(fingerprint).toBe('fingerprinted');
                  expect(upload.uploadUrl).toBeUndefined();
                  expect(upload.size).toBe(16);
                  expect(upload.parallelUploadUrls).toEqual(['https://tus.io/uploads/upload1', 'https://tus.io/uploads/upload2']);
                  return Promise.resolve('tus::fingerprinted::1337');
                },
                removeUpload: function removeUpload(urlStorageKey) {
                  expect(urlStorageKey).toBe('tus::fingerprinted::1337');
                  return Promise.resolve();
                }
              };
              spyOn(testUrlStorage, 'removeUpload').and.callThrough();
              spyOn(testUrlStorage, 'addUpload').and.callThrough();
              file = getBlob('hello world12345');
              options = {
                httpStack: testStack,
                urlStorage: testUrlStorage,
                storeFingerprintForResuming: true,
                removeFingerprintOnSuccess: true,
                chunkSize: 5,
                parallelUploads: 2,
                splitSizeIntoParts: function splitSizeIntoParts() {
                  return [{
                    start: 0,
                    end: 10
                  }, {
                    start: 10,
                    end: 16
                  }];
                },
                staggerPercent: 50,
                retryDelays: [10],
                endpoint: 'https://tus.io/uploads',
                headers: {
                  Custom: 'blargh'
                },
                metadata: {
                  foo: 'hello'
                },
                onProgress: function onProgress() {},
                onSuccess: waitableFunction(),
                fingerprint: function fingerprint() {
                  return Promise.resolve('fingerprinted');
                }
              };
              spyOn(options, 'onProgress');
              upload = new tus.Upload(file, options);
              upload.start();
              _context4.next = 11;
              return testStack.nextRequest();

            case 11:
              req = _context4.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(10);
              expect(req.requestHeaders['Upload-Concat']).toBe('partial');
              expect(req.requestHeaders['Upload-Metadata']).toBeUndefined();
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload1'
                }
              });
              _context4.next = 22;
              return testStack.nextRequest();

            case 22:
              req = _context4.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload1');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(5);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 5
                }
              });
              _context4.next = 33;
              return testStack.nextRequest();

            case 33:
              req = _context4.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(6);
              expect(req.requestHeaders['Upload-Concat']).toBe('partial');
              expect(req.requestHeaders['Upload-Metadata']).toBeUndefined();
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload2'
                }
              });
              _context4.next = 44;
              return testStack.nextRequest();

            case 44:
              req = _context4.sent;
              // Assert that the URLs have been stored.
              expect(testUrlStorage.addUpload).toHaveBeenCalled();
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(5); // Return an error to ensure that the individual partial upload is properly retried.

              req.respondWith({
                status: 500
              });
              _context4.next = 56;
              return testStack.nextRequest();

            case 56:
              req = _context4.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload1');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(5);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(5);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 10
                }
              });
              _context4.next = 67;
              return testStack.nextRequest();

            case 67:
              req = _context4.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Length': 15,
                  'Upload-Offset': 0
                }
              });
              _context4.next = 73;
              return testStack.nextRequest();

            case 73:
              req = _context4.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(5);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 5
                }
              });
              _context4.next = 84;
              return testStack.nextRequest();

            case 84:
              req = _context4.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(5);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(1);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 6
                }
              });
              _context4.next = 95;
              return testStack.nextRequest();

            case 95:
              req = _context4.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBeUndefined();
              expect(req.requestHeaders['Upload-Concat']).toBe('final;https://tus.io/uploads/upload1 https://tus.io/uploads/upload2');
              expect(req.requestHeaders['Upload-Metadata']).toBe('foo aGVsbG8=');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload3'
                }
              });
              _context4.next = 106;
              return options.onSuccess.toBeCalled;

            case 106:
              expect(upload.url).toBe('https://tus.io/uploads/upload3');
              expect(options.onProgress).toHaveBeenCalledWith(5, 16);
              expect(options.onProgress).toHaveBeenCalledWith(10, 16);
              expect(options.onProgress).toHaveBeenCalledWith(15, 16);
              expect(options.onProgress).toHaveBeenCalledWith(16, 16);
              expect(testUrlStorage.removeUpload).toHaveBeenCalled();

            case 112:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
  });
});

},{"../..":4,"./helpers/utils":60}],65:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('./helpers/utils'),
    TestHttpStack = _require.TestHttpStack,
    waitableFunction = _require.waitableFunction,
    wait = _require.wait,
    getBlob = _require.getBlob;

var tus = require('../..');

describe('tus', function () {
  describe('parallel uploading', function () {
    it('should throw if incompatible options are used', function () {
      var file = getBlob('hello world');
      var upload = new tus.Upload(file, {
        endpoint: 'https://tus.io/uploads',
        parallelUploads: 2,
        uploadUrl: 'foo'
      });
      expect(upload.start.bind(upload)).toThrowError('tus: cannot use the uploadUrl option when parallelUploads is enabled');
    });
    it('should throw if splitSizeIntoParts is passed without parallelUploads', function () {
      var file = getBlob('hello world');
      var upload = new tus.Upload(file, {
        endpoint: 'https://tus.io/uploads',
        splitSizeIntoParts: function splitSizeIntoParts() {},
        uploadUrl: 'foo'
      });
      expect(upload.start.bind(upload)).toThrowError('tus: cannot use the splitSizeIntoParts option when parallelUploads is disabled');
    });
    it('should split a file into multiple parts and create an upload for each', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var testStack, testUrlStorage, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              testStack = new TestHttpStack();
              testUrlStorage = {
                addUpload: function addUpload(fingerprint, upload) {
                  expect(fingerprint).toBe('fingerprinted');
                  expect(upload.uploadUrl).toBeUndefined();
                  expect(upload.size).toBe(11);
                  expect(upload.parallelUploadUrls).toEqual(['https://tus.io/uploads/upload1', 'https://tus.io/uploads/upload2']);
                  return Promise.resolve('tus::fingerprinted::1337');
                },
                removeUpload: function removeUpload(urlStorageKey) {
                  expect(urlStorageKey).toBe('tus::fingerprinted::1337');
                  return Promise.resolve();
                }
              };
              spyOn(testUrlStorage, 'removeUpload').and.callThrough();
              spyOn(testUrlStorage, 'addUpload').and.callThrough();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                urlStorage: testUrlStorage,
                storeFingerprintForResuming: true,
                removeFingerprintOnSuccess: true,
                parallelUploads: 2,
                retryDelays: [10],
                endpoint: 'https://tus.io/uploads',
                headers: {
                  Custom: 'blargh'
                },
                metadata: {
                  foo: 'hello'
                },
                onProgress: function onProgress() {},
                onSuccess: waitableFunction(),
                fingerprint: function fingerprint() {
                  return Promise.resolve('fingerprinted');
                }
              };
              spyOn(options, 'onProgress');
              upload = new tus.Upload(file, options);
              upload.start();
              _context.next = 11;
              return testStack.nextRequest();

            case 11:
              req = _context.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(5);
              expect(req.requestHeaders['Upload-Concat']).toBe('partial');
              expect(req.requestHeaders['Upload-Metadata']).toBeUndefined();
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload1'
                }
              });
              _context.next = 22;
              return testStack.nextRequest();

            case 22:
              req = _context.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(6);
              expect(req.requestHeaders['Upload-Concat']).toBe('partial');
              expect(req.requestHeaders['Upload-Metadata']).toBeUndefined();
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload2'
                }
              });
              _context.next = 33;
              return testStack.nextRequest();

            case 33:
              req = _context.sent;
              // Assert that the URLs have been stored.
              expect(testUrlStorage.addUpload).toHaveBeenCalled();
              expect(req.url).toBe('https://tus.io/uploads/upload1');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(5);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 5
                }
              });
              _context.next = 45;
              return testStack.nextRequest();

            case 45:
              req = _context.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(6); // Return an error to ensure that the individual partial upload is properly retried.

              req.respondWith({
                status: 500
              });
              _context.next = 56;
              return testStack.nextRequest();

            case 56:
              req = _context.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Length': 11,
                  'Upload-Offset': 0
                }
              });
              _context.next = 62;
              return testStack.nextRequest();

            case 62:
              req = _context.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(6);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 6
                }
              });
              _context.next = 73;
              return testStack.nextRequest();

            case 73:
              req = _context.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBeUndefined();
              expect(req.requestHeaders['Upload-Concat']).toBe('final;https://tus.io/uploads/upload1 https://tus.io/uploads/upload2');
              expect(req.requestHeaders['Upload-Metadata']).toBe('foo aGVsbG8=');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload3'
                }
              });
              _context.next = 84;
              return options.onSuccess.toBeCalled;

            case 84:
              expect(upload.url).toBe('https://tus.io/uploads/upload3');
              expect(options.onProgress).toHaveBeenCalledWith(5, 11);
              expect(options.onProgress).toHaveBeenCalledWith(11, 11);
              expect(testUrlStorage.removeUpload).toHaveBeenCalled();

            case 88:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    it('should split a file into multiple parts based on custom splitSizeIntoParts', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var testStack, testUrlStorage, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              testStack = new TestHttpStack();
              testUrlStorage = {
                addUpload: function addUpload(fingerprint, upload) {
                  expect(fingerprint).toBe('fingerprinted');
                  expect(upload.uploadUrl).toBeUndefined();
                  expect(upload.size).toBe(11);
                  expect(upload.parallelUploadUrls).toEqual(['https://tus.io/uploads/upload1', 'https://tus.io/uploads/upload2']);
                  return Promise.resolve('tus::fingerprinted::1337');
                },
                removeUpload: function removeUpload(urlStorageKey) {
                  expect(urlStorageKey).toBe('tus::fingerprinted::1337');
                  return Promise.resolve();
                }
              };
              spyOn(testUrlStorage, 'removeUpload').and.callThrough();
              spyOn(testUrlStorage, 'addUpload').and.callThrough();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                urlStorage: testUrlStorage,
                storeFingerprintForResuming: true,
                removeFingerprintOnSuccess: true,
                parallelUploads: 2,
                // Expected output: [{ start: 0, end: 1 }, { start: 1, end: 11 }]
                splitSizeIntoParts: function splitSizeIntoParts(totalSize, partCount) {
                  var partSize = 1;
                  var parts = [];

                  for (var i = 0; i < partCount; i++) {
                    parts.push({
                      start: partSize * i,
                      end: partSize * (i + 1)
                    });
                  }

                  parts[partCount - 1].end = totalSize;
                  return parts;
                },
                retryDelays: [10],
                endpoint: 'https://tus.io/uploads',
                headers: {
                  Custom: 'blargh'
                },
                metadata: {
                  foo: 'hello'
                },
                onProgress: function onProgress() {},
                onSuccess: waitableFunction(),
                fingerprint: function fingerprint() {
                  return Promise.resolve('fingerprinted');
                }
              };
              spyOn(options, 'onProgress');
              upload = new tus.Upload(file, options);
              upload.start();
              _context2.next = 11;
              return testStack.nextRequest();

            case 11:
              req = _context2.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(1);
              expect(req.requestHeaders['Upload-Concat']).toBe('partial');
              expect(req.requestHeaders['Upload-Metadata']).toBeUndefined();
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload1'
                }
              });
              _context2.next = 22;
              return testStack.nextRequest();

            case 22:
              req = _context2.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(10);
              expect(req.requestHeaders['Upload-Concat']).toBe('partial');
              expect(req.requestHeaders['Upload-Metadata']).toBeUndefined();
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload2'
                }
              });
              _context2.next = 33;
              return testStack.nextRequest();

            case 33:
              req = _context2.sent;
              // Assert that the URLs have been stored.
              expect(testUrlStorage.addUpload).toHaveBeenCalled();
              expect(req.url).toBe('https://tus.io/uploads/upload1');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(1);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 1
                }
              });
              _context2.next = 45;
              return testStack.nextRequest();

            case 45:
              req = _context2.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(10); // Return an error to ensure that the individual partial upload is properly retried.

              req.respondWith({
                status: 500
              });
              _context2.next = 56;
              return testStack.nextRequest();

            case 56:
              req = _context2.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Length': 11,
                  'Upload-Offset': 0
                }
              });
              _context2.next = 62;
              return testStack.nextRequest();

            case 62:
              req = _context2.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('PATCH');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Offset']).toBe(0);
              expect(req.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req.body.size).toBe(10);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 10
                }
              });
              _context2.next = 73;
              return testStack.nextRequest();

            case 73:
              req = _context2.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders.Custom).toBe('blargh');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBeUndefined();
              expect(req.requestHeaders['Upload-Concat']).toBe('final;https://tus.io/uploads/upload1 https://tus.io/uploads/upload2');
              expect(req.requestHeaders['Upload-Metadata']).toBe('foo aGVsbG8=');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload3'
                }
              });
              _context2.next = 84;
              return options.onSuccess.toBeCalled;

            case 84:
              expect(upload.url).toBe('https://tus.io/uploads/upload3');
              expect(options.onProgress).toHaveBeenCalledWith(1, 11);
              expect(options.onProgress).toHaveBeenCalledWith(11, 11);
              expect(testUrlStorage.removeUpload).toHaveBeenCalled();

            case 88:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
    it('should emit error from a partial upload', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var testStack, file, options, upload, req, err;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                parallelUploads: 2,
                retryDelays: null,
                endpoint: 'https://tus.io/uploads',
                onError: waitableFunction('onError')
              };
              upload = new tus.Upload(file, options);
              upload.start();
              _context3.next = 7;
              return testStack.nextRequest();

            case 7:
              req = _context3.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(5);
              req.respondWith({
                status: 500
              });
              _context3.next = 15;
              return options.onError.toBeCalled;

            case 15:
              err = _context3.sent;
              expect(err.message).toBe('tus: unexpected response while creating upload, originated from request (method: POST, url: https://tus.io/uploads, response code: 500, response text: , request id: n/a)');
              expect(err.originalRequest).toBe(req);

            case 18:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
    it('should resume the partial uploads', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                // The client should resume the parallel uploads, even if it is not
                // configured for new uploads.
                parallelUploads: 1,
                endpoint: 'https://tus.io/uploads',
                onProgress: function onProgress() {},
                onSuccess: waitableFunction()
              };
              spyOn(options, 'onProgress');
              upload = new tus.Upload(file, options);
              upload.resumeFromPreviousUpload({
                urlStorageKey: 'tus::fingerprint::1337',
                parallelUploadUrls: ['https://tus.io/uploads/upload1', 'https://tus.io/uploads/upload2']
              });
              upload.start();
              _context4.next = 9;
              return testStack.nextRequest();

            case 9:
              req = _context4.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload1');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Length': 5,
                  'Upload-Offset': 2
                }
              });
              _context4.next = 15;
              return testStack.nextRequest();

            case 15:
              req = _context4.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Length': 6,
                  'Upload-Offset': 0
                }
              });
              _context4.next = 21;
              return testStack.nextRequest();

            case 21:
              req = _context4.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload1');
              expect(req.method).toBe('PATCH');
              expect(req.body.size).toBe(3);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 5
                }
              });
              _context4.next = 28;
              return testStack.nextRequest();

            case 28:
              req = _context4.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('PATCH');
              expect(req.body.size).toBe(6);
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 6
                }
              });
              _context4.next = 35;
              return testStack.nextRequest();

            case 35:
              req = _context4.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders['Upload-Concat']).toBe('final;https://tus.io/uploads/upload1 https://tus.io/uploads/upload2');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload3'
                }
              });
              _context4.next = 42;
              return options.onSuccess.toBeCalled;

            case 42:
              expect(upload.url).toBe('https://tus.io/uploads/upload3');
              expect(options.onProgress).toHaveBeenCalledWith(5, 11);
              expect(options.onProgress).toHaveBeenCalledWith(11, 11);

            case 45:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
    it('should abort all partial uploads and resume from them', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      var testStack, file, options, upload, req, req1, req2, reqPromise, result;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                parallelUploads: 2,
                endpoint: 'https://tus.io/uploads',
                onProgress: function onProgress() {},
                onSuccess: waitableFunction(),
                fingerprint: function fingerprint() {
                  return Promise.resolve('fingerprinted');
                }
              };
              spyOn(options, 'onProgress');
              upload = new tus.Upload(file, options);
              upload.start();
              _context5.next = 8;
              return testStack.nextRequest();

            case 8:
              req = _context5.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(5);
              expect(req.requestHeaders['Upload-Concat']).toBe('partial');
              expect(req.requestHeaders['Upload-Metadata']).toBeUndefined();
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload1'
                }
              });
              _context5.next = 18;
              return testStack.nextRequest();

            case 18:
              req = _context5.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBe(6);
              expect(req.requestHeaders['Upload-Concat']).toBe('partial');
              expect(req.requestHeaders['Upload-Metadata']).toBeUndefined();
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload2'
                }
              });
              _context5.next = 28;
              return testStack.nextRequest();

            case 28:
              req1 = _context5.sent;
              expect(req1.url).toBe('https://tus.io/uploads/upload1');
              expect(req1.method).toBe('PATCH');
              expect(req1.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req1.requestHeaders['Upload-Offset']).toBe(0);
              expect(req1.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req1.body.size).toBe(5);
              _context5.next = 37;
              return testStack.nextRequest();

            case 37:
              req2 = _context5.sent;
              expect(req2.url).toBe('https://tus.io/uploads/upload2');
              expect(req2.method).toBe('PATCH');
              expect(req2.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req2.requestHeaders['Upload-Offset']).toBe(0);
              expect(req2.requestHeaders['Content-Type']).toBe('application/offset+octet-stream');
              expect(req2.body.size).toBe(6);
              upload.abort();
              req1.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 5
                }
              });
              req2.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 6
                }
              }); // No further requests should be sent.

              reqPromise = testStack.nextRequest();
              _context5.next = 50;
              return Promise.race([reqPromise, wait(100)]);

            case 50:
              result = _context5.sent;
              expect(result).toBe('timed out'); // Restart the upload

              upload.start(); // Reuse the promise from before as it is not cancelled.

              _context5.next = 55;
              return reqPromise;

            case 55:
              req = _context5.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload1');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Length': 5,
                  'Upload-Offset': 5
                }
              });
              _context5.next = 61;
              return testStack.nextRequest();

            case 61:
              req = _context5.sent;
              expect(req.url).toBe('https://tus.io/uploads/upload2');
              expect(req.method).toBe('HEAD');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Length': 6,
                  'Upload-Offset': 6
                }
              });
              _context5.next = 67;
              return testStack.nextRequest();

            case 67:
              req = _context5.sent;
              expect(req.url).toBe('https://tus.io/uploads');
              expect(req.method).toBe('POST');
              expect(req.requestHeaders['Tus-Resumable']).toBe('1.0.0');
              expect(req.requestHeaders['Upload-Length']).toBeUndefined();
              expect(req.requestHeaders['Upload-Concat']).toBe('final;https://tus.io/uploads/upload1 https://tus.io/uploads/upload2');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: 'https://tus.io/uploads/upload3'
                }
              });
              _context5.next = 76;
              return options.onSuccess.toBeCalled;

            case 76:
              expect(upload.url).toBe('https://tus.io/uploads/upload3');
              expect(options.onProgress).toHaveBeenCalledWith(5, 11);
              expect(options.onProgress).toHaveBeenCalledWith(11, 11);

            case 79:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));
  });
});

},{"../..":4,"./helpers/utils":60}],66:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('./helpers/utils'),
    TestHttpStack = _require.TestHttpStack,
    getBlob = _require.getBlob;

var tus = require('../..');

describe('tus', function () {
  describe('terminate upload', function () {
    it('should terminate upload when abort is called with true', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var abortPromise, testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/files/',
                chunkSize: 5,
                onChunkComplete: function onChunkComplete() {
                  abortPromise = upload.abort(true);
                }
              };
              spyOn(options, 'onChunkComplete').and.callThrough();
              upload = new tus.Upload(file, options);
              upload.start();
              _context.next = 8;
              return testStack.nextRequest();

            case 8:
              req = _context.sent;
              expect(req.url).toBe('http://tus.io/files/');
              expect(req.method).toBe('POST');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: '/files/foo'
                }
              });
              _context.next = 14;
              return testStack.nextRequest();

            case 14:
              req = _context.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('PATCH');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 5
                }
              });
              _context.next = 20;
              return testStack.nextRequest();

            case 20:
              req = _context.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('DELETE');
              req.respondWith({
                status: 204
              });
              expect(options.onChunkComplete).toHaveBeenCalled();
              _context.next = 27;
              return abortPromise;

            case 27:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    it('should retry terminate when an error is returned on first try', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var abortPromise, testStack, file, options, upload, req;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              testStack = new TestHttpStack();
              file = getBlob('hello world');
              options = {
                httpStack: testStack,
                endpoint: 'http://tus.io/files/',
                chunkSize: 5,
                retryDelays: [10, 10, 10],
                onChunkComplete: function onChunkComplete() {
                  abortPromise = upload.abort(true);
                }
              };
              spyOn(options, 'onChunkComplete').and.callThrough();
              upload = new tus.Upload(file, options);
              upload.start();
              _context2.next = 8;
              return testStack.nextRequest();

            case 8:
              req = _context2.sent;
              expect(req.url).toBe('http://tus.io/files/');
              expect(req.method).toBe('POST');
              req.respondWith({
                status: 201,
                responseHeaders: {
                  Location: '/files/foo'
                }
              });
              _context2.next = 14;
              return testStack.nextRequest();

            case 14:
              req = _context2.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('PATCH');
              req.respondWith({
                status: 204,
                responseHeaders: {
                  'Upload-Offset': 5
                }
              });
              _context2.next = 20;
              return testStack.nextRequest();

            case 20:
              req = _context2.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('DELETE');
              req.respondWith({
                status: 423
              });
              _context2.next = 26;
              return testStack.nextRequest();

            case 26:
              req = _context2.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('DELETE');
              req.respondWith({
                status: 204
              });
              _context2.next = 32;
              return abortPromise;

            case 32:
              expect(options.onChunkComplete).toHaveBeenCalled();

            case 33:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
    it('should stop retrying when all delays are used up', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var testStack, options, terminatePromise, req;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              testStack = new TestHttpStack();
              options = {
                httpStack: testStack,
                retryDelays: [10, 10]
              };
              terminatePromise = tus.Upload.terminate('http://tus.io/files/foo', options);
              _context3.next = 5;
              return testStack.nextRequest();

            case 5:
              req = _context3.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('DELETE');
              req.respondWith({
                status: 500
              });
              _context3.next = 11;
              return testStack.nextRequest();

            case 11:
              req = _context3.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('DELETE');
              req.respondWith({
                status: 500
              });
              _context3.next = 17;
              return testStack.nextRequest();

            case 17:
              req = _context3.sent;
              expect(req.url).toBe('http://tus.io/files/foo');
              expect(req.method).toBe('DELETE');
              req.respondWith({
                status: 500
              });
              _context3.next = 23;
              return expectAsync(terminatePromise).toBeRejectedWithError(/tus: unexpected response while terminating upload/);

            case 23:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
    it('should invoke the request and response Promises', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var testStack, options, terminatePromise, req;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              testStack = new TestHttpStack();
              options = {
                httpStack: testStack,
                onBeforeRequest: function onBeforeRequest(req) {
                  return new Promise(function (resolve) {
                    expect(req.getURL()).toBe('http://tus.io/uploads/foo');
                    expect(req.getMethod()).toBe('DELETE');
                    resolve();
                  });
                },
                onAfterResponse: function onAfterResponse(req, res) {
                  return new Promise(function (resolve) {
                    expect(req.getURL()).toBe('http://tus.io/uploads/foo');
                    expect(req.getMethod()).toBe('DELETE');
                    expect(res.getStatus()).toBe(204);
                    resolve();
                  });
                }
              };
              spyOn(options, 'onBeforeRequest');
              spyOn(options, 'onAfterResponse');
              terminatePromise = tus.Upload.terminate('http://tus.io/uploads/foo', options);
              _context4.next = 7;
              return testStack.nextRequest();

            case 7:
              req = _context4.sent;
              expect(req.url).toBe('http://tus.io/uploads/foo');
              expect(req.method).toBe('DELETE');
              req.respondWith({
                status: 204
              });
              _context4.next = 13;
              return expectAsync(terminatePromise).toBeResolved();

            case 13:
              expect(options.onBeforeRequest).toHaveBeenCalled();
              expect(options.onAfterResponse).toHaveBeenCalled();

            case 15:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
  });
});

},{"../..":4,"./helpers/utils":60}]},{},[58])