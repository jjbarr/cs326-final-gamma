let map = null;
let userLocMarker = null;
let userLoc = [];
let landmarks = {};
let landmarks_on_map = {};
let selected_landmark = null;

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
            let v = landmarks[lmk.properties.id];
            landmarks[lmk.properties.id]=lmk;
            return v?true:false;
        })
        .forEach((lmk) => {
            console.log(`landmark ${lmk}`);
            let landmark = L.marker(lmk.geometry.coordinates);
            landmark.addTo(map);
            landmarks_on_map[lmk.properties.id] = landmark;
            landmark.on('click', () => {
                selected_landmark = lmk.properties.id;
                lmk = landmarks[lmk.properties.id];
                document.getElementById('landmark-info-title')
                    .innerText = lmk.properties.name;
                document.getElementById('landmark-info-description')
                    .innerText = lmk.properties.description;
                const revdisplay =
                      document.getElementById('landmark-info-reviews');
                while (revdisplay.firstChild)
                    revdisplay.removeChild(revdisplay.firstChild);
                lmk.properties.reviews.forEach((rev) => {
                    const review = document.createElement('li');
                    review.classList.add(['list-group-item']);
                    const top = document.createElement('div');
                    const stars = Array(rev.stars).fill('★').join('');
                    top.innerText = `${rev.creator} - ${stars}`;
                    review.appendChild(top);
                    const body = document.createElement('div');
                    body.innerText = rev.body;
                    review.appendChild(body);
                    revdisplay.appendChild(review);
                });
                bootstrap.Modal.getOrCreateInstance(
                    document.getElementById('landmark-info-modal')).show();
            });
        });
}



window.addEventListener('DOMContentLoaded', async () => {
    // Yes, I *know* that there are better ways to know about whether or not
    // we're logged in on the front end. You, the professors, don't seem to want
    // me to use them.
    let logged_in = (await (await fetch('/logged_in')).json()).result;
    if(logged_in) {
        document.getElementById("signin").style.display = "none";
    } else {
        document.getElementById("add-new-landmark").style.display = "none";
        document.getElementById("user-menu").style.display = "none";
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
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
        navigator.geolocation.watchPosition((pos) => {
            userLocMarker.setLatLng(new L.LatLng(pos.coords.latitude,
                                                 pos.coords.longitude));
        });
        await getlandmarks();
        document.getElementById('confirm-new-landmark')
            .addEventListener('click', async () => {
                const name = document.getElementById('landmark-name').value;
                const description = document
                      .getElementById('landmark-description').value;
                if(!name || !description){
                    alert('The landmark must have a name and description.');
                    return;
                }
                let res = await fetch('/create_landmark', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'same-origin',
                    body: JSON.stringify({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: userLoc
                        },
                        properties: {
                            name: name,
                            description: description
                        }
                    })
                });
                await getlandmarks();
                if(!res.ok) {
                    alert('Something went wrong submitting the landmark!');
                } else {
                    bootstrap.Modal.getOrCreateInstance(
                        document.getElementById('new-landmark-modal')).hide();
                }
            });
        document.getElementById('landmark-info-add-review')
            .addEventListener('click', async () => {
                if(!selected_landmark) return;
                let id = landmarks[selected_landmark].properties.id;
                let res = await fetch(`/landmark/${id}/add_review`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'same-origin',
                    body: JSON.stringify({
                        stars: document
                            .getElementById('landmark-info-review-stars').value,
                        body: document
                            .getElementById('landmark-info-review-body').value
                    })
                });
                if(!res.ok) {
                    alert('unable to submit review! Do you already have one?');
                } else {
                    alert('review submitted!');
                    await getlandmarks();
                    bootstrap.Modal.getOrCreateInstance(
                        document.getElementById('landmark-info-modal')).hide();
                }
            });
        map.on('zoomend', () => (async () => await getlandmarks())());
        map.on('moveend', () => (async () => await getlandmarks())());
    }); 
});
