# Set up

> Step 1: HTML/CSS setup. 
>
> We created different web pages for different functionalities using bootstrap: the main map page, login page, sign up page, and user review page. We also use fontawesome to add stars and users icon to make the HTML looking better.

> Step 2: Back-end routes and functions. 
>
> We developed routes and functions using Express. At this point, we have not employed database, so we saved information received from the user input in JSON files. And we encrypted the password using miniCrypt.

> Step 3: Database implementation. 
>
> We use postgres database to replace JSON files. We designed 3 tables for the database -- a user info table, a landmark table, and a user review table. When we receive user input data such as signup information and landmark creations/comments, we store in database for authentication or display in the user interface.