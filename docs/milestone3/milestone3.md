`users` Table
| Column   | Data Type | Description                    |
|----------|-----------|--------------------------------|
| username | String    | The name of the user -- unique |
| password | String    | The password of the user       |

`landmarks` Table
| Column      | Data Type | Description                                    |
|-------------|-----------|------------------------------------------------|
| id          | Integer   | The unique id of the landmark                  |
| lat         | Double    | The latitude of the landmark                   |
| long        | Double    | The longitude of the landmark                  |
| lname       | String    | The name of the landmark                       |
| description | String    | A description of what the landmark is          |
| creator     | String    | The name of the user who created this landmark |


`reviews` Table
| Column   | Data Type | Description                           |
|----------|-----------|---------------------------------------|
| id       | Integer   | The unique id of a review             |
| creator  | String    | The name of the creating user         |
| landmark | Integer   | The id of the landmark being reviewed |
| body     | String    | The actual body text of the review    |
| stars    | Integer   | A star rating from one to five        |


