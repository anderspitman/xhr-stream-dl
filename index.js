// This code was originally adapted from
// https://hpbn.co/xmlhttprequest/#streaming-data-with-xhr


const XHR_HEADERS_RECEIVED = 2;
const XHR_LOADING = 3;
const XHR_DONE = 4;

class Stream {
  constructor(xhr) {

    xhr.seenBytes = 0;

    xhr.onreadystatechange = () => { 
      switch (xhr.readyState) {
        //case XHR_HEADERS_RECEIVED:
        //  if (xhr.status !== 200) {
        //    this._onError(xhr.reponseText);
        //  }

        //  break;
        case XHR_LOADING:
          const newData = xhr.responseText.substr(xhr.seenBytes); 
          this._onData(newData);

          xhr.seenBytes = xhr.responseText.length; 
          break;
        case XHR_DONE:

          if (xhr.status === 200) {
            const lastData = xhr.responseText.substr(xhr.seenBytes); 
            this._onData(lastData);
            this._onEnd();
          }
          else {
            this._onError(xhr.responseText);
          }

          break;
        default:
          //console.error("Unhandle XHR code: " + xhr.readyState);
          break;
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
