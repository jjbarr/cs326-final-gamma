let map = null;
let userLoc = null;
let lastreqll = null;

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
                        lmk.properties.review.forEach((review) => {
                            const review = document.createElement('div');
                            review.appendChild((()=>{
                                const top = document.createElement('span');
                                top.appendChild((()=>{
                                    const user = document.createElement('a');
                                    user.href = `/user/${review.creator}`;
                                    user.innerText = review.creator;
                                    return user;
                                })());
                                top.appendChild(
                                    document.createTextNode(
                                        Array(review.stars).fill('★').join('')));
                                return top;
                            })());
                            review.appendChild((()=>{
                                const body = document.createElement('div');
                                body.innerText = review.body;
                                return body;
                            })());
                            reviews.appendChild(review);
                        });
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

window.addEventListener('DOMContentLoaded', () => {
    let login = false;
    //in the real app, map view will track user location. We're not doing that
    //yet.
    navigator.geolocation.getCurrentPosition((pos) => {
        map = L.map('map-mountpoint')
            .setView([pos.coords.latitude, pos.coords.longitude], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">\OpenStreetMap</a> contributors'})
            .addTo(map);
        userLoc = L.circleMarker([pos.coords.latitude,pos.coords.longitude], {
            color: '#ffffff',
            fillOpacity: 1.0,
            fillColor: '#3388ff'
        });
        userLoc.addTo(map);
        lastreqll = [pos.coords.latitude, pos.coords.longitude];
        (async ()=> await getlandmarks())();
        if(login) {
            document.getElementById("signin").style.display = "none";
        } else {
            document.getElementById("addNewLandmark").style.display = "none";
            document.getElementById("user-menu").style.display = "none";
        }
        navigator.geolocation.watchPosition((pos) => {
            userLoc.setLatLng(new L.LatLng(pos.coords.latitude,
                                           pos.coords.longitude));
        });
        map.on('zoomend', () => (async () => await getlandmarks())());
        map.on('moveend', () => (async () => await getlandmarks())());
    });
});
