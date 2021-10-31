# 0. API Specification
The server shall implement the following API endpoints. Some of them are
presently under-specifed because we still need to figure out the spec.
- `/login`: A `POST` endpoint. Uses provided credentials to authorize the
  user. The `/login` endpoint shall, upon successful authentication return to
  the user an authorization token.
- `/logout`: A `POST` endpoint. Shall revoke the user's authorization token, if
  the token is valid. Shall otherwise perform no action.
- `/signup`: A `POST` endpoint. Shall create a new user with the credentials
  specified upon success, or indicate failure.
- `/create_landmark`: A `POST` endpoint. Shall create a new landmark based upon
  data received in the following JSON object. This object must contain, in the
  `authorization` field, a valid authorization token received from `/login`. If
  no such token is provided or the token is invalid, the request is void. The
  object shall also contain a `landmark` field, which shall contain an RFC7946
  GeoJSON Feature object with geometry of type Point which contains the
  properties `name` and `description`.
- `/landmark/<id>`: This endpoint has multiple methods, and the semantics of
  each shall be described:
  - As a `GET` endpoint. If a landmark with the given ID exists, this endpoint
    shall return a GeoJSON Feature with geometry of type Point and the
    properties `name` (string), `description` (string), `id` (string), `creator`
    (string), and `reviews` (array of objects with the properties `creator`
    (string), `id` (string), `stars` (number), `landmark_id` (string), and
    `body` (string)). It is undefined as to whether the `reviews` property
    contains all reviews for a landmark. If there is some time at which this is
    not the case, there will be a method provided for obtaining more reviews
    than are listed.
  - As a `PATCH` endpoint, this endpoint requires authorization that corresponds
    to the original creating user. It shall accept the same set of properties as
    the `/create_landmark` endpoint, with the exception of the fact that any
    property save for `authorization` and those required by GeoJSON may be null
    (this presently is only the `name` and `description` properties). If the
    property is null, it shall not be changed. Otherwise, all properties of the
    landmark shall be updated to those provided in the request.
  - As a `DELETE` endpoint, this endpoint shall accept an object containing
    solely `authorization`. If that authorization corresponds to the creating
    user, the landmark shall be deleted.
- `/landmark/<id>/add_review`: A `POST` endpoint. This endpoint shall accept a
  JSON object containing both an `authorization` field, with a valid token, and
  a `review` field, which contains an object containing an `body` field
  (string), and a `stars` field (number). The `stars` field shall contain an
  integer number between 0 and 5. The `body` field may contain arbitrary text.
- `/review/<id>`: This is endpoint has multiple methods.
  - As a `GET` endpoint, this returns the review specified. The review is a JSON
    object that shall contain the `creator`, `id`, `landmark_id`, `stars`, and
    `body` fields as specified in the format of `/landmark/<id>`.
  - As a `PATCH` endpoint, this endpoint shall accept an object containing an
    `authorization` and `review` field, as `/landmark/<id>/add_review`
    does. Unlike with requests to `/landmark/<id>/add_review`, fields in
    `review` may be missing. This request shall, if the authorization token is
    valid and matches the creating user, update the review on the server such
    that fields that are present in `review` match their contents in `review`.
  - As a `DELETE` endpoint, this endpoint shall accept an object containing an
    `authorization` field. If the token is valid and matches the creating user,
    this review shall be deleted.
- `/user/<id>`: `GET` endpoint. If `<id>` is a valid username, this endpoint
  shall return a JSON object containing the fields `id` (string), `reviews`
  (array of `review` objects), and `landmarks` (array of `landmark` objects).
- `/landmarks_in`: `GET` endpoint. Accepts two urlencoded coordinates in the
  parameters `lat1`, `long1`, `lat2`, `long2`, which define a rectangle. Shall
  return a JSON arry of `landmark` objects that are containted within the bounds
  of this rectangle.
