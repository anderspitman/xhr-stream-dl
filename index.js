// This code was originally adapted from
// https://hpbn.co/xmlhttprequest/#streaming-data-with-xhr


const XHR_DONE = 4;

class Stream {
  constructor(xhr) {

    xhr.seenBytes = 0;

    xhr.onreadystatechange = () => { 
      if (xhr.readyState === XHR_DONE) {
        // TODO: remove this duplication
        const newData = xhr.responseText.substr(xhr.seenBytes); 

        this._onData(newData);
        this._onEnd();
      }
      else if (xhr.readyState > 2) {
        const newData = xhr.responseText.substr(xhr.seenBytes); 

        this._onData(newData);

        xhr.seenBytes = xhr.responseText.length; 
      }
    };

    this._xhr = xhr;
    this._started = false;
  }

  onData(callback) {
    if (!this._started) {
      this._started = true;
      this.start();
    }

    this._onData = callback;
  }

  onEnd(callback) {
    this._onEnd = callback;
  }

  onError(callback) {
    this._onError = callback;
  }

  start() {
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
