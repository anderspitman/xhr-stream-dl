// This code was originally adapted from
// https://hpbn.co/xmlhttprequest/#streaming-data-with-xhr


const XHR_DONE = 4;

class Stream {
  constructor(xhr) {
    this._callbacks = {
      'data': null,
      'end': null,
      'error': null,
      'queue': null,
      'exit': null,
    };

    xhr.seenBytes = 0;

    xhr.onreadystatechange = () => { 
      if (xhr.readyState === XHR_DONE) {
        // TODO: remove this duplication
        const newData = xhr.responseText.substr(xhr.seenBytes); 

        if (this._callbacks['data']) {
          this._callbacks['data'](newData);
        }

        if (this._callbacks['end']) {
          this._callbacks['end']();
        }
      }
      else if (xhr.readyState > 2) {
        const newData = xhr.responseText.substr(xhr.seenBytes); 

        if (this._callbacks['data']) {
          this._callbacks['data'](newData);
        }

        xhr.seenBytes = xhr.responseText.length; 
      }
    };

    this._xhr = xhr;
  }

  on(eventName, callback) {
    if (this._callbacks[eventName] !== undefined) {
      this._callbacks[eventName] = callback;
    }
    else {
      throw new Error(`Invalid event name "${eventName}". Valid options are [${Object.keys(this._callbacks).join(', ')}]`);
    }
  }

  off(eventName) {
    delete this._callbacks[eventName];
  }

  run() {
    this._xhr.send();
  }
}


function request(url, options) {
  let method = 'GET';

  if (options !== undefined) {
    method = options.method ? options.method : method;
  }

  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  
  return new Stream(xhr);
}


export { request };
