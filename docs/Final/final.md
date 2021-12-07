# Team-gamma

## Landmarkster - Fall 2021

---

#### Overview

It allows users to share landmarks and various interesting sights in their neighborhood, and view landmarks that have been shared by others.
    
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
>When we click the log in button, it will show this. If we don't have an account we need to first sign up. After we create an account, we need to log in.
>![login](login.png)

>Sign Up Page
>
>When we click the "Register here", it will show the sign up page. If the username we choose is already used by others, we should choose another username.
>![signup](signup.png)


>After Log In Page
>
>This is the web page after we logged in. On the search bar, we can see there are two buttons. One is add new landmarks, the other is user management. We can also find out that there are serval landmarks on the map.
>![logged](logged.png)

>Add new landmarks
>
>The "+" button help us to add new landmarks on the map. We can either use our current location or select a location to add landmarks.
>![addLandmarks](addLandmarks.png)

>View and Add Reviews Page
>
>We can click the landmarks on the map to see other people's reviews and add our own reviews.
>![viewAndAdd](viewAndAdd.png)

>User Management Page
>
>When we click the user icon, we can see there are some commands to help us management our own account.
>![icon](icon.png)

>My Reviews/Landmarks Page
>
>If we want to edit our landmarks and reviews we can click "My Reviews/Landmarks". Here we can edit or delete our own landmarks and reviews.
>![profile](profile.png)

>Change Password Page
>
>If we want to change the password to make the account more secure, we can click "Change Password".
>![changePassword](changePassword.png)

---

#### APIs

|API                       |Description                                          |
|:------------------------:|:---------------------------------------------------:|
|/login                    |which allows a user to log in                        |
|/logout                   |which allows a signed user to sign out               |
|/signup                   |which allows for a new user to sign up               |
|/create_landmark          |which allows a user to create a new landmark         |
|/landmark/:id             |when used as a GET endpoint, it acts like accessing landmarks where id is the id of the currently landmark. When used as a PATCH endpoint, <i>/landmark/:id<i> accepts a JSON object containing a password field and updates the current user's password to match the contents therein. A user must already be authenticated to use the /self endpoint.|
|/landmark/:id/add_review  |which allows a user to add a review add this landmark|
|/review/:id               |
|/user/:id                 |
|/self                     |When used as a GET endpoint, /self acts like accessing /user/<id> where <id> is the id of the currently logged in user. When used as a PATCH endpoint, /self accepts a JSON object containing a password field and updates the current user's password to match the contents therein. A user must already be authenticated to use the /self endpoint.|
|/landmarks_in             |
|/logged_in                |

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
| URL Routes                           |         Description       |                       Special Permissions                     |
|:------------------------------------:|:-------------------------:|:-------------------------------------------------------------:|
| Log In                               |Go to the log in page      | Only the right password and email can be loged in             |
| Don't have an account? Register here |Go to the sign up page     |
| Sign Up                              |Go to the sign up page     | The username which have signed before can not be signed again |
| You're signed up!                    |Go to the log in page      |
| Sign Out                             |Sign out an account        |
| Home                                 | switch to the main page   |
---

#### Authentication/Authorization

|   Name   |          Description       |                                          Special Permissions                                       |
|:--------:|:--------------------------:|:--------------------------------------------------------------------------------------------------:|
| Log In   | switch to the log in page  | only the right password and email can be signed in. If is not accessible : pop up alret            |
| Sign Up  | switch to the sign up page | the username which have signed before can not be signed again. If is not accessible : pop up alret |
| Reserve  | reserve a product          | need to sign in first. If is not accessible : pop up alret                                         |
| Update   | update a product           | only the product owner can do this. If is not accessible : pop up alret                            |

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
