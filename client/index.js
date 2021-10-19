
//Go!
window.addEventListener('DOMContentLoaded', () => {
    //in the real app, map view will track user location. We're not doing that
    //yet.
    let map = L.map('map-mountpoint').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">\
OpenStreetMap</a> contributors'
    }).addTo(map);
    let user = L.circleMarker([51.500,-0.08], {
        color: '#ffffff',
        fillOpacity: 1.0,
        fillColor: '#3388ff'
    });
    user.addTo(map);
    let landmark = L.marker([51.503, -0.07]);
    landmark.addTo(map);
    let popup = L.popup({keepInView:true, closeButton: true})
        .setContent('Blah blah blah blah blah description goes here');
    landmark.bindPopup(popup);
});
