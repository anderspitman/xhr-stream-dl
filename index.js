// This code was originally adapted from
// https://hpbn.co/xmlhttprequest/#streaming-data-with-xhr


const XHR_DONE = 4;

class Producer {
  constructor(xhr) {
    this._onEnd = () => {};

    xhr.seenBytes = 0;

    xhr.onreadystatechange = () => { 
      if (xhr.readyState === XHR_DONE) {
        this._onEnd();
      }
      else if (xhr.readyState > 2) {
        const newData = xhr.responseText.substr(xhr.seenBytes); 

        this._onData(newData);

        xhr.seenBytes = xhr.responseText.length; 
      }
    };

    xhr.send();
  }

  onData(callback) {
    this._onData = callback;
  }

  onEnd(callback) {
    this._onEnd = callback;
  }
}


function request(url, options) {
  let method = 'GET';

  if (options !== undefined) {
    method = options.method ? options.method : method;
  }

  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  
  return new Producer(xhr);
}


export { request };
