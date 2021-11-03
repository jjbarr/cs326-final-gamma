let map = null;
let userLoc = null;
let lastreqll = null;

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
        .forEach((lmk) => {
            let landmark = L.marker(lmk.geometry.coordinates);
            landmark.addTo(map);
            let popup = L.popup({keepInView:true, closeButton: true})
                .setContents(`
<div class='container-fluid'>
<h3>${lmk.properties.name}</h3>
</div>
<hr/>
${lmk.properties.description}
<hr/>
${lmk.properties.review
.map((rev) => `
                             <div>
                             <div>
                             <a href='/user/${rev.creator}'>${rev.creator}</a>
                             ${Array(rev.stars).fill('★').join('')}
                             </div>
                             <div>
                             ${rev.body}
                             </div>
                             </div>
                             `).join('')}
`);
            //TODO: Add review.
        });
}

window.addEventListener('DOMContentLoaded', () => {
    //TODO Login tokens
    let login_condition = false;
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
        if(login_condition) {
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
