# Team-gamma

## Landmarkster - Fall 2021

---

#### Overview

It allows users to share landmarks and various interesting sights in their
neighborhood, and view landmarks that have been shared by others.
    
>The closest existing application to what we're trying to do is Google Niantic's
Field Trip.  But it was unwilling to accept contributions from users and shut
down in 2019: [Field Trip](https://nianticlabs.com/blog/fieldtrip/?hl=en)

>The closest approximation that still exists is Atlas Obscura. However, there are
higher standards for contributions and it is more focused on particularly
unusual things (that may not even be open for visitors to access) than on
general landmarks and interesting sights you can go see: [Atlas
Obscura](https://www.atlasobscura.com/)

---

#### Team members

|        |      Name     | GitHub Username |
|:------:| :-----------: |:---------------:|
|Member 1| Joshua Barret | jjbarr          |
|Member 2| Ruoyi Wu      | Ry-Wu           |
|Member 3| Qinyi Tang    | Qinyit0         |

---

#### User Interface

>Initial Page
>
>This is the original web page. It needs people to give it geographic authority.
>![intial](initial.png)

>Log In Page
>
>When we click the log in button, it will show this. If we don't have an account
>we need to first sign up. After we create an account, we need to log in.
>![login](login.png)

>Sign Up Page
>
>When we click the "Register here", it will show the sign up page. If the
>username we choose is already used by others, we should choose another
>username.  ![signup](signup.png)


>After Log In Page
>
>This is the web page after we logged in. On the search bar, we can see there
>are two buttons. One is add new landmarks, the other is user management. We can
>also find out that there are serval landmarks on the map.
>![logged](logged.png)

>Add new landmarks
>
>The "+" button help us to add new landmarks on the map. We can either use our
>current location or select a location to add landmarks.
>![addLandmarks](addLandmarks.png)

>View and Add Reviews Page
>
>We can click the landmarks on the map to see other people's reviews and add our
>own reviews.
>![viewAndAdd](viewAndAdd.png)

>User Management Page
>
>When we click the user icon, we can see there are some commands to help us
>management our own account.
>![icon](icon.png)

>My Reviews/Landmarks Page
>
>If we want to edit our landmarks and reviews we can click "My
>Reviews/Landmarks". Here we can edit or delete our own landmarks and reviews.
>![profile](profile.png)

>Change Password Page
>
>If we want to change the password to make the account more secure, we can click
>"Change Password".
>![changePassword](changePassword.png)

---

#### APIs

All endpoints expect JSON as input unless otherwise specified

| Endpoint                    | Method | Description                                                                                                                                                                                   |
|-----------------------------|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/login`                    | POST   | Takes `username` and `password` fields. Tries to log the user in.                                                                                                                             |
| `/logout`                   | POST   | Takes no body. Logs out the user if they are logged in.                                                                                                                                       |
| `/signup`                   | POST   | Takes `username` and `password` fields. Attempts to create a user with that name and password.                                                                                                |
| `/create_landmark`          | POST   | Takes a GeoJSON (RFC7946) Feature of type Point with the properties `name` and `description`. Attempts to create a landmark with that name and description at that location if authorized.    |
| `/landmark/<id>`            | GET    | Returns a GeoJSON Feature of type Point with properties `name`, `description`, `id`, `creator`, and `reviews` (an array of reviews objects as returned by `/reviews/<id>`.                    |
| `/landmark/<id>`            | PATCH  | Tekes a GeoJSON Feature of type Point with one or more properties `name` and `description`, and tries to replace the name of description of the landmark with those if authorized as creator. |
| `/landmark/<id>`            | DELETE | Deletes the landmark if authorized as creating user.                                                                                                                                          |
| `/landmark/<id>/add_review` | POST   | Takes an object with the fields `body` and `stars`. `stars` must be a number between 1 and 5. Creates a review of the landmark with that body and star rating if authorized.                  |
| `/review/<id>`              | GET    | Returns a JSON object containing `creator`, `id`, `landmark`, `lname`, `stars`, and `body` properties.                                                                                        |
| `/review/<id>`              | PATCH  | Accepts a JSON object containing `stars` and `body` properties. Attempts to update the review with the new stars and body if authorized as creating user.                                     |
| `/review/<id>`              | DELETE | Attempts to delete the review if authorized as creating user.                                                                                                                                 |
| `/user/<id>`                | GET    | Returns a JSON object with the properties `id`, `reviews`, and `landmarks`, being the `id` and reviews and landmarks created by the user respectively.                                        |
| `/self`                     | GET    | Acts like `/user/<id>`, where `<id>` is the id of the currently logged in user.                                                                                                               |
| `/self`                     | PATCH  | Accepts an object containing a `password` field. Attempts to update the current user's password.                                                                                              |
| `/landmarks_in`             | GET    | Accepts `lat1`, `long1`, `lat2`, and `long2` as arguments in the query string. Returns an array of landmark objects in the rectangle defined by the pair of latitudes and longitudes.         |
| `/logged_in`                | GET    | Returns an object with a single field, `result`, which is true if the user is logged in.                                                                                                      |

---

#### Database

##### landmarks table
| Column      | Data Type | Description                               |
|-------------|-----------|-------------------------------------------|
| id          | integer   | The id of the landmark                    |
| lat         | double    | The latitude of the landmark's location.  |
| long        | double    | The longitude of the landmark's location. |
| lname       | varchar   | The name of the landmark                  |
| description | varchar   | The review of the landmark                |
| creator     | varchar   | The creator of the landmark               |


##### reviews table
| Column       | Data Type  | Description                        |
|--------------|------------|------------------------------------|
| id           | integer    | The id of the review               |
| creator      | varchar    | The creator of the review          |
| landmark     | varchar    | The name of the landmark           |
| stars        | integer    | The number of stars of user rating |
| body         | varchar    | The content of the review          |


##### users table
| Column   | Data Type | Description                     |
|----------|-----------|---------------------------------|
| username | varchar   | The name of the user            |
| password | varchar   | The hashed password of the user |
| salt     | varchar   | The random salt of the password |

---

#### URL Routes/Mappings

| URL Routes | Description                                                                                    |
|:----------:|:----------------------------------------------------------------------------------------------:|
| /          | Our website only has one page, login/signup, see reviews, and change password are all pop-ups. |



---

#### Authentication/Authorization

| Name            | Description                          | Special Permissions                                                                                |
|:---------------:|:------------------------------------:|:--------------------------------------------------------------------------------------------------:|
| Log In          | switch to the log in pop up          | only the right password and email can be signed in. If is not accessible : pop up alret            |
| Sign Up         | switch to the sign up pop up         | the username which have signed before can not be signed again. If is not accessible : pop up alert |
| Change Password | switch to the change password pop up | after signed in, the user can change its password.                                                 |

---

#### Division of Labor

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

---

#### Conclusion
