window.addEventListener('DOMContentLoaded', () => {
    const login_condition = getURLParam("login");
    //in the real app, map view will track user location. We're not doing that
    //yet.
    let map = L.map('map-mountpoint').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">\OpenStreetMap</a> contributors'}).addTo(map);
    let user = L.circleMarker([51.500,-0.08], {
        color: '#ffffff',
        fillOpacity: 1.0,
        fillColor: '#3388ff'
    });
    user.addTo(map);
    let landmark = L.marker([51.503, -0.07]);
    landmark.addTo(map);
    let popup = L.popup({keepInView:true, closeButton: true})
        .setContent(mkPopupContent());
    landmark.bindPopup(popup);
    document.getElementById("addNewLandmark").style.visibility =
        login_condition? "visible":"hidden";
    document.getElementById("navbarDropdownMenuLink").style.visibility =
        login_condition? "visible":"hidden";    
    document.getElementById("signin").style.visibility =
        login_condition? "hidden":"visible";
});

function getURLParam(string){
    const reg = new RegExp("(^|&)" + string + "=([^&]*)(&|$)");
    const r = window.location.search.substr(1).match(reg);
    if (r !== null) {return unescape(r[2]);} return null;
}


function mkPopupContent() {
    //quick and dirty for the prototype
    return `
<div class='container-fluid'>
    <h3>Landmark Name</h3>
</div>
<p>Here's a description of what's going on with this here landmark, and all the 
cool stuff you can see here.</p>
<div class='row'>
<button class='btn btn-info'>Take me here!</button>
</div>
<hr/>
<div><b>Username</b>★★★★</div>
<p>I really liked this landmark</p>
<hr/>
<div><b>AnotherUser</b>★</div>
<p>This landmark sucked!</p>
`;
}

