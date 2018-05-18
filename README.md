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

## Testing

Follow the steps below to test the application.

1.  Navigate to the project directory through a terminal
2.  If you haven't, install dependencies `npm install`
3.  Run `npm test`
  
## Api EndPoints

EndPoint                      |   Functionality
------------------------------|------------------------
POST /users/login             |   Logs in a user.
GET /users/requests           |   Gets all requests of a logged in user (if user is an admin, gets all requests in database).
GET /users/requests/:id       |   Get a single request through it's id.
POST /users/requests          |   Creates a new request
PUT /users/requests/:id       |   Updates a request (admin can resolve, approve, or disapprove a request through this endpoint)
DELETE /users/requests/:id    |   Deletes a request (admin can trash(remove from admin's workspace) a request through this endpoint)

## Licence

MIT