// const { traceDeprecation } = require("process");

window.addEventListener('DOMContentLoaded', ()=>{   
    document.getElementById('remove-btn').addEventListener('click', deleteReview);
    document.getElementById('return-btn').addEventListener('click', returnHome);
    document.getElementById('add-btn').addEventListener('click', updateReview);
});

function returnHome(){
    location.href = "./index.html?login=true";
}

function deleteReview() {
    document.getElementById('row').remove();
}
  
function updateReview() {
    let x = document.getElementById('userReview');
    let newRow = x.rows[1].cloneNode(true);
    let length = x.rows.length;
  
    let lm = newRow.cells[0].getElementsByTagName('input')[0];
    lm.id += length;
    lm.value = '';

    let rev = newRow.cells[1].getElementsByTagName('input')[0];
    rev.id += length;
    rev.value = '';
    
    let rate = newRow.cells[2].getElementsByTagName('input')[0];
    rate.id += length;
    rate.value = '';

    x.appendChild(newRow);
}

async function reviewsReceivedFromServer(){
    
    const response = await fetch('/loadallreviews',{
        method: "GET"
    });
    let data = await response.json();
    render(data);
}

window.addEventListener('load', async () => reviewsReceivedFromServer());

function render(JSONObj){
    const labels = ['name', 'review', 'rating'];
    let reviews = JSON.parse(JSON.stringify(JSONObj));

    let element = document.getElementById('table');
    let table = document.createElement('table');
    let tableBody = document.createElement('tbody');
    table.appendChild(tableBody);
    for(let i = 0 ; i < reviews.length; i++){
        let tr = document.createElement('tr');
        for(let j = 0; j < 3; j++){
            let td = document.createElement('td');
            td.innerHTML = reviews[i][labels[j]];
            tr.appendChild(td);
        }
        tableBody.appendChild(tr); 
    }
    table.appendChild(tableBody);
    element.appendChild(table);
}

  