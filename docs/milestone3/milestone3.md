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
