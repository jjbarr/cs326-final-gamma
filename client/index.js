let map = null;
let userLocMarker = null;
let userLoc = [];
let landmarks = {};

async function getlandmarks() {
    //we should actually unbind landmarks and GC them, but for now we'll assume
    //that that's not an issue.
    const bounds = map.getBounds();
    const lat1 = bounds.getNorthWest().lat;
    const long1 = bounds.getNorthWest().lng;
    const lat2 = bounds.getSouthEast().lat;
    const long2 = bounds.getSouthEast().lng;
    (await (await fetch(
        `/landmarks_in?lat1=${lat1}&long1=${long1}&lat2=${lat2}&long2=${long2}`))
     .json())
        .filter((lmk) => {
            let r = landmarks[lmk.properties.id];
            landmarks[lmk.properties.id]=true;
            return r;
        })
        .forEach((lmk) => {
            console.log(`landmark ${lmk}`);
            let landmark = L.marker(lmk.geometry.coordinates);
            landmark.addTo(map);
            let popup = L.popup({keepInView:true, closeButton: true})
                .setContent(() => {
                    const content = document.createElement('div');
                    content.classList.add('container-fluid');
                    content.appendChild((()=>{
                        const h = document.createElement('h3');
                        h.innerText = lmk.properties.name;
                        return h;
                    })());
                    content.appendChild(document.createElement('hr'));
                    content.appendChild((()=>{
                        const desc = document.createElement('div');
                        desc.innerText = lmk.properties.description;
                        return desc;
                    })());
                    content.appendChild((()=>{
                        const reviews = document.createElement('div');
                        lmk.properties.review.forEach((rev) => {
                            const review = document.createElement('div');
                            review.appendChild((()=>{
                                const top = document.createElement('span');
                                top.appendChild((()=>{
                                    const user = document.createElement('span');
                                    user.innerText = rev.creator;
                                    return user;
                                })());
                                top.appendChild(
                                    document.createTextNode(
                                        Array(rev.stars).fill('★').join('')));
                                return top;
                            })());
                            review.appendChild((()=>{
                                const body = document.createElement('div');
                                body.innerText = rev.body;
                                return body;
                            })());
                            reviews.appendChild(review);
                        });
                        return reviews;
                    })());
                    content.appendChild((()=>{
                        const reviewform = document.createElement('form');
                        const title = document.createElement('input');
                        title.setAttribute('type','text');
                        title.setAttribute('placeholder','Title');
                        reviewform.appendChild(title);
                        const stars = document.createElement('input');
                        stars.setAttribute('type','number');
                        stars.setAttribute('min', '1');
                        stars.setAttribute('max', '5');
                        reviewform.appendChild(stars);
                        const body = document.createElement('textarea');
                        body.setAttribute('placeholder', 'your review');
                        reviewform.appendChild(body);
                        const add = document.createElement('input');
                        add.setAttribute('type', 'button');
                        add.setAttribute('value', 'Submit Review');
                        add.classList.add(['btn', 'btn-primary']);
                        reviewform.appendChild(add);
                        return reviewform;
                    })());
                    return content;
                });
        });
}



window.addEventListener('DOMContentLoaded', async () => {
    // Yes, I *know* that there are better ways to know about whether or not
    // we're logged in on the front end.
    let logged_in = (await (await fetch('/logged_in')).json()).result;
    if(logged_in) {
        document.getElementById("signin").style.display = "none";
    } else {
        document.getElementById("add-new-landmark").style.display = "none";
        document.getElementById("user-menu").style.display = "none";
    }
    navigator.geolocation.getCurrentPosition((pos) => {
        userLoc = [pos.coords.latitude, pos.coords.longitude];
        map = L.map('map-mountpoint').setView(userLoc, 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">\OpenStreetMap</a> contributors'
        }).addTo(map);
        userLocMarker =
            L.circleMarker(userLoc, {
                color: '#ffffff',
                fillOpacity: 1.0,
                fillColor: '#3388ff'
            });
        userLocMarker.addTo(map);
        (async ()=> await getlandmarks())();
        navigator.geolocation.watchPosition((pos) => {
            userLocMarker.setLatLng(new L.LatLng(pos.coords.latitude,
                                                 pos.coords.longitude));
        });
        document.getElementById('confirm-new-landmark')
            .addEventListener('click', async () => {
                const name = document.getElementById('landmark-name').value;
                const description = document
                      .getElementById('landmark-description').value;
                if(!name || !description){
                    alert('The landmark must have a name and description.');
                    return;
                }
                let resp = await fetch('/create_landmark', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'same-origin',
                    body: JSON.stringify({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: userLoc
                        },
                        'properties': {
                            name: name,
                            description: description
                        }
                    })
                });
                if(!resp.ok) {
                    alert('Something went wrong submitting the landmark!');
                } else {
                    bootstrap.Modal.getInstance(
                        document.getElementById('new-landmark-modal')).hide();
                }
            });
        map.on('zoomend', () => (async () => await getlandmarks())());
        map.on('moveend', () => (async () => await getlandmarks())());
    });
    
});
