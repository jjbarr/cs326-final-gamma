
function initialize(){
  document.getElementById('postbutton').addEventListener('click', postData);
  document.getElementById('getbutton').addEventListener('click', getData);
}

const url = 'http://localhost:3000/crud/data';
async function getData() {
    const response = await fetch(url);
    const json = await response.json();
    document.getElementById('message').innerText = "Your request is:" + json.request;
  }

async function postData(data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'text/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    const json = await response.json();
    document.getElementById('message').innerHTML = "Your request is:" + json.request;
  }

  window.onload = initialize;