# Maintenance-Tracker

Maintenance Tracker App is an application that provides users with the ability to reach out to operations or repairs department regarding repair or maintenance requests and monitor the status of their request.

[Click here](https://megame24.github.io/Maintenance-Tracker/) to view the app on github pages.

## Features

The app has the following features for the respective categories;

* A User can:

  * create an account and login.
  * make maintenance or repairs request.
  * view all his/her requests.
  * view the details of a single request, which includes a feedback from an admin if any.
  * update a request, if it is yet to be approved.
  * delete a resolved, yet to be approved, or a disapproved request from the 'view requests' page.

* An admin can:

  * approve/disapprove a repair/maintenance request.
  * mark request as resolved once it is done.
  * view all maintenance/repairs requests on the application.
  * filter requests.
  * view the details of a request.
  * provide feedback on approving/disapproving or on resolving a request.
  * trash a resolved or a disapproved request from the 'dashboard' page.

## Technologies

The application uses `Nodejs` and `Express` frameworks on the server. On the front-end, `HTML`, `CSS` & `JavaScript` are used for templating.

## Installation

Follow the steps below to setup a local development environment.

1.  Clone the repository from a terminal `git clone https://github.com/megame24/Maintenance-Tracker.git`.
2.  Navigate to the project directory `cd Maintenance-Tracker`
3.  Run `npm install` on the terminal to install dependencies.
4.  Run `npm start` to start the application.

## Api Endpoints

EndPoint                      |   Functionality
------------------------------|------------------------
POST /users/login             |   Logs in a user.
GET /users/requests           |   Gets all requests of a logged in user (if user is an admin, gets all requests in database).
GET /users/requests/:id       |   Get a single request through it's id.
POST /users/requests          |   Creates a new request
PUT /users/requests/:id       |   Updates a request (admin can resolve, approve, or disapprove a request through this endpoint)
DELETE /users/requests/:id    |   Deletes a request (admin can trash(remove from admin's workspace) a request through this endpoint)

## Testing

### Testing with Postman

Follow the steps below to test the api endpoints in postman:

1.  Enter the url `http://localhost:8080/api/v1/users/login` and set `x-www-form-urlencoded` key/value pairs to `{ username: 'john', password: 'wick' }` to login as an admin or `{ username: 'uzumaki', password: 'naruto' }` to login as a regular user.
2.  Copy the returned `token`.
3.  Set `authorization` to the copied `token` in the header. Or pass it as a url query string in the form `?token=<copied-token>` on every request to the server.
4. Test the following endpoints, passing in the appropriate data if any:
  * GET `/users/requests`
  * GET `/users/requests/<requestId>`
  * POST `/users/requests`, requires:
    - `{ title, description, type: ('maintenance' or 'repair') }`
  * PUT `/users/requests/<requestId>`, requires:
    - if logged in user is a regular user: `{ title(optional), description(optional), type(optional): ('maintenance' or 'repair') }`
    - if logged in user is an admin: `{ status: ('approved' or 'disapproved' or 'resolved') }`
  * DELETE `/users/requests/<requestId>`

## Licence

MIT