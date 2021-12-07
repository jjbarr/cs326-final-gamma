# Final Rubric

## General (\_/25 points) 
- Authentication
  - Successfully create a user
  - Successfully login as a user
  - Correctly store passwords as something other than plaintext
  - Allow the viewing of a user page and the editing/deletion of
    reviews/landmarks if you are logged in as that user
- Routing
- Linting/code style

## Map Screen (\_/30 points)
- Successfully show user's location on the map
- Successfully display all landmarks near the user
- Successfully allow user to see landmark details by clicking or tapping an
  landmark on the display
- Successfully permit logged-in users and only logged-in users to add a landmark
  - Allow the use of the user's location or the selection of an arbitrary
    location for the new landmark.
- Permit logged in users to view their own user page
- Permit logged in users to change their password

## User Page (\_/15 points)
- Successfully display all landmarks and reviews a user has created
- Allow users to edit their landmarks and reviews
- Allow users to delete thier landmarks and reviews

## Landmark Pages (\_/15 points)
- Display the landmark's name and description to the user
- Display user reviews to the user.
- Allow logged-in users to leave a review
  - Provide an appropriate error message if a user who is not logged in attempts
    to leave a reivew
  - Provide an appropriate error message if a user who has already left a review
    attempts to leave a second one

## CRUD (\_/15 points)
- Create
  - Users
  - Landmarks
  - Reviews
- Read
  - View nearby landmarks
  - View landmark reviews
  - View own reviews of landmarks
  - View own landmarks
- Update
  - Edit own reviews
  - Edit own landmarks
- Delete
  - Delete own reviews
  - Delete own landmarks
