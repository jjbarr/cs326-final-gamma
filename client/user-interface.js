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

