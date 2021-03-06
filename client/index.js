//KNOWN BUGS: Landmarks don't draw in until you move the map for the first time.
//I'm not sure why this is, I think it's a leaflet bug.
let map = null;
let userLocMarker = null;
let userLoc = [];
let landmarks = {};
let landmarks_on_map = {};
let selected_landmark = null;
let picked_loc = null;
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
            return !v;
        })
        .forEach((lmk) => {
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
                    review.classList.add('list-group-item');
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

function showuser(user) {
    //draw a star rating of numstars inside element e
    function addStars(e, numstars) {
        let starArr = [];
        for (let k = 1; k <=5 ; k++){
            let s = document.createElement('div');
            s.setAttribute('class', 'fas fa-star');
            e.appendChild(s);
            starArr.push(s);
        }
        starArr.forEach((star, a) => {
            star.classList.toggle('full', a <= numstars - 1);
        });
    }
    //this really needs to get refactored for similarity reduction.
    //but it's sunday and I'm tired.
    document.getElementById('userpage-label').innerText
        = `${user.id}'s Reviews/Landmarks`;
    const landmarks_lst = document.getElementById('userpage-landmarks');
    while (landmarks_lst.firstChild)
        landmarks_lst.removeChild(landmarks_lst.firstChild);
    const reviews_lst = document.getElementById('userpage-reviews');
    while (reviews_lst.firstChild)
        reviews_lst.removeChild(reviews_lst.firstChild);
    user.reviews.forEach((rev) => {
        const review = document.createElement('tr');
        review.dataset.revid = rev.id;
        const lname = document.createElement('td');
        lname.innerText = rev.lname;
        review.appendChild(lname);
        const body = document.createElement('td');
        body.innerText = rev.body;
        review.appendChild(body);
        const stars = document.createElement('td');
        addStars(stars, rev.stars);
        review.appendChild(stars);
        const edit = document.createElement('td');
        const editBtn = document.createElement('button');
        editBtn.classList.add('btn', 'btn-secondary');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        edit.appendChild(editBtn);
        review.appendChild(edit);
        const del = document.createElement('td');
        const delBtn = document.createElement('button');
        delBtn.classList.add('btn', 'btn-danger');
        delBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        delBtn.addEventListener('click', async () => {
            if(!confirm('Are you sure you want to delete this review?'))
                return;
            let res = await fetch(`/review/${rev.id}`, {
                method: 'DELETE',
                credentials: 'same-origin'
            });
            if(!res.ok) {
                alert('unable to delete review!');
                return;
            }
            if(landmarks[rev.landmark]) {
            let revidx = landmarks[rev.landmark].properties.reviews
                .findIndex((e) => e.id === rev.id);
                if(revidx >= 0)
                    landmarks[rev.landmark].properties.reviews.splice(revidx,1);
            }
            reviews_lst.removeChild(review);
        });
        del.appendChild(delBtn);
        editBtn.addEventListener('click', () => {
            let inputDesc = document.createElement('textarea');
            inputDesc.classList.add('form-control');
            inputDesc.value = rev.body;
            body.innerText = '';
            body.appendChild(inputDesc);
            let inputStars = document.createElement('input');
            inputStars.classList.add('form-control');
            inputStars.setAttribute('type', 'number');
            inputStars.setAttribute('min', '1');
            inputStars.setAttribute('max', '5');
            inputStars.value = rev.stars;
            while(stars.firstChild) stars.removeChild(stars.firstChild);
            stars.appendChild(inputStars);
            let save = document.createElement('button');
            save.innerHTML = '<i class="fas fa-check"></i>';
            save.classList.add('btn', 'btn-success');
            edit.removeChild(editBtn);
            edit.appendChild(save);
            let cancel = document.createElement('button');
            cancel.innerHTML = '<i class="fas fa-times"></i>';
            cancel.classList.add('btn', 'btn-danger');
            del.removeChild(delBtn);
            del.appendChild(cancel);
            let restore = () => {
                body.removeChild(inputDesc);
                body.innerText = rev.body;
                stars.removeChild(inputStars);
                addStars(stars, rev.stars);
                edit.removeChild(save);
                edit.appendChild(editBtn);
                del.removeChild(cancel);
                del.appendChild(delBtn);
            };
            cancel.addEventListener('click', restore);
            save.addEventListener('click', async () => {
                let newrev = Object.assign({},rev);
                newrev.body = inputDesc.value;
                newrev.stars = inputStars.value;
                let result = await fetch(`/review/${rev.id}`, {
                    method: 'PATCH',
                    credentials: 'same-origin',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(newrev)
                });
                if(!result.ok){
                    alert('Could not update review!');
                } else {
                    rev = newrev;
                    if(landmarks[rev.landmark]) {
                        let revidx = landmarks[rev.landmark].properties.reviews
                            .findIndex((e) => e.id === rev.id);
                        if(revidx >= 0){
                            landmarks[rev.landmark].properties
                                .reviews.splice(revidx,1, rev);
                        }
                    }
                    restore();
                }
            });
        });
        review.appendChild(del);
        reviews_lst.appendChild(review);
    });
    user.landmarks.forEach((lmk) => {
        const landmark = document.createElement('tr');
        const name = document.createElement('td');
        name.innerText = lmk.properties.name;
        landmark.appendChild(name);
        const desc = document.createElement('td');
        desc.innerText = lmk.properties.description;
        landmark.appendChild(desc);
        const edit = document.createElement('td');
        const editBtn = document.createElement('button');
        editBtn.classList.add('btn', 'btn-secondary');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        edit.appendChild(editBtn);
        landmark.appendChild(edit);
        const del = document.createElement('td');
        const delBtn = document.createElement('button');
        delBtn.classList.add('btn', 'btn-danger');
        delBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        delBtn.addEventListener('click', async () => {
            if(!confirm('Are you sure you want to delete this landmark?'))
                return;
            let res = await fetch(`/landmark/${lmk.properties.id}`, {
                method: 'DELETE',
                credentials: 'same-origin'
            });
            if(!res.ok) {
                alert('unable to delete landmark!');
                return;
            }
            lmk.properties.reviews
                .filter((rev) => rev.creator === user.id)
                .forEach((rev) => {
                    let idx = user.reviews.findIndex((r) => r.id === rev.id);
                    if(idx >= 0) {
                        user.reviews.splice(idx,1);
                        Array.from(reviews_lst.children)
                            .filter((e) => parseInt(e.dataset.revid) === rev.id)
                            .forEach((e) => {
                                reviews_lst.removeChild(e);
                            });
                    }
                });
            if(landmarks_on_map[lmk.properties.id]) {
                map.removeLayer(landmarks_on_map[lmk.properties.id]);
                delete landmarks_on_map[lmk.properties.id];
            }
            if(landmarks[lmk.properties.id])
                delete landmarks[lmk.properties.id];
            landmarks_lst.removeChild(landmark);
        });
        del.appendChild(delBtn);
        landmark.appendChild(del);
        editBtn.addEventListener('click', () => {
            let inputName = document.createElement('input');
            inputName.classList.add('form-control');
            inputName.setAttribute('type', 'text');
            inputName.value = lmk.properties.name;
            name.innerText = '';
            name.appendChild(inputName);
            let inputDesc = document.createElement('textarea');
            inputDesc.value = lmk.properties.description;
            inputDesc.classList.add('form-control');
            desc.innerText = '';
            desc.appendChild(inputDesc);
            let save = document.createElement('button');
            save.innerHTML = '<i class="fas fa-check"></i>';
            save.classList.add('btn', 'btn-success');
            edit.removeChild(editBtn);
            edit.appendChild(save);
            let cancel = document.createElement('button');
            cancel.innerHTML = '<i class="fas fa-times"></i>';
            cancel.classList.add('btn', 'btn-danger');
            del.removeChild(delBtn);
            del.appendChild(cancel);
            let restore = () => {
                name.removeChild(inputName);
                name.innerText = lmk.properties.name;
                desc.removeChild(inputDesc);
                desc.innerText = lmk.properties.description;
                edit.removeChild(save);
                edit.appendChild(editBtn);
                del.removeChild(cancel);
                del.appendChild(delBtn);
            };
            cancel.addEventListener('click', restore);
            save.addEventListener('click', async () => {
                let newlmk = Object.assign({}, lmk);
                newlmk.properties = Object.assign({}, lmk.properties);
                newlmk.properties.name = inputName.value;
                newlmk.properties.description = inputDesc.value;
                console.log(JSON.stringify(newlmk));
                let res = await fetch(`/landmark/${lmk.properties.id}`, {
                    method: 'PATCH',
                    headers: {'Content-Type':'application/json'},
                    credentials: 'same-origin',
                    body: JSON.stringify(newlmk)
                });
                if(!res.ok){
                    alert('could not update landmark!');
                } else {
                    lmk = newlmk;
                    if(landmarks[lmk.properties.id])
                        landmarks[lmk.properties.id] = lmk;
                    restore();
                }
            });
        });
        landmarks_lst.appendChild(landmark);
    });
    bootstrap.Modal.getOrCreateInstance(
        document.getElementById('userpage-modal')).show();
}


function set_login_status(logged_in) {
    if(logged_in) {
        document.getElementById('signin').style.display = 'none';
        document.getElementById('add-new-landmark').style.display = 'inline';
        document.getElementById('user-menu').style.display = 'inline';
    } else {
        document.getElementById('signin').style.display = 'inline';
        document.getElementById('add-new-landmark').style.display = 'none';
        document.getElementById('user-menu').style.display = 'none';
    }
}

function enter_pickloc_mode() {
    document.getElementById('signin').style.display = 'none';
    document.getElementById('add-new-landmark').style.display = 'none';
    document.getElementById('user-menu').style.display = 'none';
    document.getElementById('pick-loc').style.display = 'inline-block';
    map.on('click', position_pick_marker);
}

function exit_pickloc_mode() {
    document.getElementById('pick-loc').style.display = 'none';
    set_login_status(true);
    map.off('click', position_pick_marker);
    if(picked_loc) {
        map.removeLayer(picked_loc);
        picked_loc = null;
    }
    //this is slightly a hack, but if we enetered pickloc legitimately we were
    //logged in, and we can't have been logged out in the interim by any means
    //I can think of.
}

function position_pick_marker(clickev) {
    if(!picked_loc) {
        picked_loc = L.marker(clickev.latlng).addTo(map);
        picked_loc._icon.classList.add('pick-loc-marker');
    } else {
        picked_loc.setLatLng(clickev.latlng);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    // Yes, I *know* that there are better ways to know about whether or not
    // we're logged in on the front end. You, the professors, don't seem to want
    // me to use them.
    let logged_in = (await (await fetch('/logged_in')).json()).result;
    set_login_status(logged_in);
    navigator.geolocation.getCurrentPosition(async (pos) => {
        userLoc = [pos.coords.latitude, pos.coords.longitude];
        map = L.map('map-mountpoint');
        map.setView(userLoc, 15);
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
        document.getElementById('pick-loc-confirm')
            .addEventListener('click', async () => {
                if(!picked_loc) {
                    alert('Please select a location!');
                    return;
                }
                let loc = picked_loc.getLatLng();
                await createLandmark([loc.lat, loc.lng]);
                exit_pickloc_mode();
            });
        document.getElementById('pick-loc-abort')
            .addEventListener('click', async() => {
                exit_pickloc_mode();
                bootstrap.Modal.getOrCreateInstance(
                    document.getElementById('new-landmark-modal')).show();
            });
        document.getElementById('confirm-new-landmark')
            .addEventListener('click', async () => {
                const name = document.getElementById('landmark-name').value;
                const description = document
                      .getElementById('landmark-description').value;
                const pickLoc = document
                      .getElementById('landmark-pickloc').checked;
                if(!name || !description){
                    alert('The landmark must have a name and description.');
                    return;
                }
                if(pickLoc) {
                    enter_pickloc_mode();
                    bootstrap.Modal.getOrCreateInstance(
                        document.getElementById('new-landmark-modal')).hide();
                } else {
                    await createLandmark(userLoc);
                }
            });
        document.getElementById('landmark-info-add-review')
            .addEventListener('click', async () => {
                if(!selected_landmark) return;
                if(!logged_in) {
                    alert('Please log in before leaving a review');
                    return;
                }
                let id = landmarks[selected_landmark].properties.id;
                let stars = starValue();
                let res = await fetch(`/landmark/${id}/add_review`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'same-origin',
                    body: JSON.stringify({
                        stars: stars,
                        body: document
                            .getElementById('landmark-info-review-body').value
                    })
                });
                if(!res.ok) {
                    alert('unable to submit review! '
                          +'Did you already submit one for this landmark?');
                } else {
                    alert('review submitted!');
                    document.getElementById('landmark-info-review-stars')
                        .value = '';  
                    document.getElementById('landmark-info-review-body')
                        .value = '';
                    await getlandmarks();
                    bootstrap.Modal.getOrCreateInstance(
                        document.getElementById('landmark-info-modal')).hide();
                }
            });
        document.getElementById('link-userpage')
            .addEventListener('click', async() => {
                let user = await (await fetch('/self')).json();
                showuser(user);
            });
        //change password
        document.getElementById('confirm-change-password')
            .addEventListener('click', async() => {
                let changed = await fetch('/self', {
                    method: 'PATCH',
                    credentials: 'same-origin',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        password:
                        document.getElementById('change-pwd-new-password').value
                    })
                });
                if (changed.ok) {
                    alert('your password has been changed successfully');
                    document.getElementById('change-pwd-new-password')
                        .value = '';
                    bootstrap.Modal.getOrCreateInstance(
                        document.getElementById('change-password-modal')).hide();
                } else {
                    alert('Error: could not change password');
                }
            });
        document.getElementById('logout')
            .addEventListener('click', async () => {
                await fetch('/logout', {
                    method:'POST',
                    credentials: 'same-origin'
                });
                logged_in = false;
                set_login_status(logged_in);
            });
        document.getElementById('signup-modal-link')
            .addEventListener('click', () => {
                bootstrap.Modal.getOrCreateInstance(
                    document.getElementById('login-modal')).hide();
                bootstrap.Modal.getOrCreateInstance(
                    document.getElementById('signup-modal')).show();
            });
        document.getElementById('confirm-login')
            .addEventListener('click', async () => {
                let res = await fetch('/login', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        username:
                        document.getElementById('login-username').value,
                        password:
                        document.getElementById('login-password').value
                    })
                });
                if(!res.ok) {
                    alert('Could not log in! (bad username or password?)');
                    return;
                }
                logged_in = true;
                set_login_status(logged_in);
                bootstrap.Modal.getOrCreateInstance(
                    document.getElementById('login-modal')).hide();
            });
        document.getElementById('confirm-signup')
            .addEventListener('click', async ()=> {
                let res = await fetch('/signup', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        username:
                        document.getElementById('signup-username').value,
                        password:
                        document.getElementById('signup-password').value
                    })
                });
                if(!res.ok) {
                    alert('Could not sign up! (Was your username taken?)');
                    return;
                }
                alert('You\'re signed up!');
                bootstrap.Modal.getOrCreateInstance(
                    document.getElementById('signup-modal')).hide();
                bootstrap.Modal.getOrCreateInstance(
                    document.getElementById('login-modal')).show();
            });
        window.addEventListener('resize', () => map.invalidateSize());
        map.on('zoomend', async () => await getlandmarks());
        map.on('moveend', async () => await getlandmarks());
        await getlandmarks();
    }); 
});

async function createLandmark(location) {
    const name = document.getElementById('landmark-name').value;
    const description = document
          .getElementById('landmark-description').value;
    let res = await fetch('/create_landmark', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
        body: JSON.stringify({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: location
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
        document.getElementById('landmark-name').value = '';
        document.getElementById('landmark-description').value = '';
        document.getElementById('landmark-userloc').checked = true;
    }
}

function starValue(){
    let data = 0;
    if(document.getElementById('rate-5').checked) {
        data = 5;
    }else if(document.getElementById('rate-4').checked) {
        data = 4;
    }else if(document.getElementById('rate-3').checked) {
        data = 3;
    }else if(document.getElementById('rate-2').checked) {
        data = 2;
    }else if(document.getElementById('rate-1').checked) {
        data = 1;
    }
    return data;
}
