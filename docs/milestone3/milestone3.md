# Milestone 3
### Design Table
>Using "CREATE TABLE landmarks (id SERIAL PRIMARY KEY, lat DOUBLE PRECISION, long DOUBLE PRECISION, lname VARCHAR, description VARCHAR, creator VARCHAR, FOREIGN KEY(creator) REFERENCES users(uname));" to create landmarks table.

>Using "CREATE TABLE reviews (id SERIAL PRIMARY KEY, creator VARCHAR, landmark INTEGER, stars INTEGER, body VARCHAR, FOREIGN KEY(creator) REFERENCES users(uname), FOREIGN KEY(landmark) REFERENCES landmarks(id) ON DELETE CASCADE, UNIQUE(creator,landmark));" to create reviews table.

>Using "CREATE TABLE users (uname VARCHAR PRIMARY KEY, password VARCHAR, salt VARCHAR);" to create users table.
---
### Tables of postgres database

#### landmarks table
| Column      | Data Type | Description                               |
|-------------|-----------|-------------------------------------------|
| id          | integer   | The id of the landmark                    |
| lat         | double    | The latitude of the landmark's location.  |
| long        | double    | The longitude of the landmark's location. |
| lname       | varchar   | The name of the landmark                  |
| description | varchar   | The review of the landmark                |
| creator     | varchar   | The creator of the landmark               |


#### reviews table
| Column       | Data Type  | Description                        |
|--------------|------------|------------------------------------|
| id           | integer    | The id of the review               |
| creator      | varchar    | The creator of the review          |
| landmark     | varchar    | The name of the landmark           |
| stars        | integer    | The number of stars of user rating |
| body         | varchar    | The content of the review          |


#### users table
| Column   | Data Type | Description                     |
|----------|-----------|---------------------------------|
| username | varchar   | The name of the user            |
| password | varchar   | The hashed password of the user |
| salt     | varchar   | The random salt of the password |
---
### Division of labor
##### Ruoyi Wu 
(Email: ruoyiwu@umass.edu, Github: Ry-Wu)
1. Database design.
2. Constructed back-end endpoints.
3. User signup/login and password storage with encryption.
4. Connection between front-end and back-end.

##### Joshua Barrett 
(Emails: jjbarrett@umass.edu, jbarrett186@gmail.com; github:jjbarr)
1. Database structure Design and Constructions.
2. Constructed back-end endpoints
3. Front-end Interaction / Design with the back-end endpoints.
4. Add landmarks on the map.

##### Qinyi Tang
(Email: qinyitang@umass.edu, Github: Qinyit0)
1. Design the database.
2. Fix some errors on the backend
3. Connection between front-end and back-end
4. Render stars on the HTML.