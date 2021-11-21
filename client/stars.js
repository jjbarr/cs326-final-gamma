window.addEventListener('load', ()=>{
    document.getElementById("post").addEventListener('click', async () => {
        const review = document.getElementById('review').value;
        //console.log(review);
        let rating = display();
        console.log(rating, review);
        postReviews(rating, review);
    });
});

async function postReviews(rating, review) {
    await fetch('/review/:id', {
        method:"POST",
        headers: {
            "Content-Type" : "application/x-www-form-urlencoded"
        },
        body: "rating=" + rating + "&" + "review=" + review
    })
}

function display(){
    let data = 0;
    if(document.getElementById('rate-5').checked) {
        //console.log("The rating is 5");
        data = 5;
    }else if(document.getElementById('rate-4').checked) {
        //console.log("The rating is 4");
        data = 4;
    }else if(document.getElementById('rate-3').checked) {
        //console.log("The rating is 3");
        data = 3;
    }else if(document.getElementById('rate-2').checked) {
        //console.log("The rating is 2");
        data = 2;
    }else if(document.getElementById('rate-1').checked) {
        //console.log("The rating is 1");
        data = 1;
    }
    return data;
}
