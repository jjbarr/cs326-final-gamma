<<<<<<< Updated upstream
user profile table
| Column       | Data Type | Description              |
|--------------|-----------|--------------------------|
| username     | String    | The name of the user     |
| email        | String    | The email adress of user |
| password     | String    | The password of the user |

user review table
| Column       | Data Type | Description              |
|--------------|-----------|--------------------------|
| username     | String    | The name of the user     |
| landmark     | String    | The name of the landmark |
| reviewID     | String    | The unique id of a review|
| review       | String    | A review of the user     |
| rating       | String    | The number of stars      |
=======
### Tables of postgres database

#### landmarks table
| Column       | Data Type           | Description                              |
|--------------|---------------------|------------------------------------------|
| id           | Integer             | The id of the landmark                   |
| lat          | double precision    | The latitude of the landmark's location  |
| long         | double precision    | The longitude of the landmark's location |
| lname        | Varchar             | The name of the landmark                 |
| description  | Varchar             | The review of the landmark               |
| creator      | Varchar             | The creator of the landmark              |


#### reviews table
| Column       | Data Type  | Description                        |
|--------------|------------|------------------------------------|
| id           | Integer    | The id of the review               |
| creator      | Varchar    | The creator of the review          |
| landmark     | Varchar    | The name of the landmark           |
| stars        | Integer    | The number of stars of user rating |
| body         | Varchar    | The content of the review          |


#### users table
| Column       | Data Type           | Description                              |
|--------------|---------------------|------------------------------------------|
| username     | Varchar             | The name of the user                     |
| password     | Varchar[]           | The salt and hashed password of the user |
>>>>>>> Stashed changes
