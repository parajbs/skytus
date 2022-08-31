import BaseUpload from '../upload'
import NoopUrlStorage from '../noopUrlStorage'
import { enableDebugLog } from '../logger'
import DetailedError from '../error'

import { FileUrlStorage, canStoreURLs } from './urlStorage'
import DefaultHttpStack from './httpStack'
import FileReader from './fileReader'
import fingerprint from './fileSignature'
import StreamSource from './sources/StreamSource'

const defaultOptions = {
  ...BaseUpload.defaultOptions,
  httpStack : new DefaultHttpStack(),
  fileReader: new FileReader(),
  urlStorage: new NoopUrlStorage(),
  fingerprint,
}

class Upload extends BaseUpload {
  constructor (file = null, options = {}) {
    options = { ...defaultOptions, ...options }
    super(file, options)
  }

  static terminate (url, options = {}) {
    options = { ...defaultOptions, ...options }
    return BaseUpload.terminate(url, options)
  }
}

// The Node.js environment does not have restrictions which may cause
// tus-js-client not to function.
const isSupported = true

// The usage of the commonjs exporting syntax instead of the new ECMAScript
// one is actually inteded and prevents weird behaviour if we are trying to
// import this module in another module using Babel.
export {
  Upload,
  defaultOptions,
  isSupported,
  // Make FileUrlStorage module available as it will not be set by default.
  FileUrlStorage,
  canStoreURLs,
  enableDebugLog,
  DefaultHttpStack,
  DetailedError,
  StreamSource,
}