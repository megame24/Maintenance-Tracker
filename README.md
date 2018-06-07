# Maintenance-Tracker

[![Build Status](https://travis-ci.org/megame24/Maintenance-Tracker.svg?branch=develop)](https://travis-ci.org/megame24/Maintenance-Tracker) [![codecov](https://codecov.io/gh/megame24/Maintenance-Tracker/branch/develop/graph/badge.svg)](https://codecov.io/gh/megame24/Maintenance-Tracker)
 [![Maintainability](https://api.codeclimate.com/v1/badges/f02f4c11dd89fe071136/maintainability)](https://codeclimate.com/github/megame24/Maintenance-Tracker/maintainability)

Maintenance Tracker App is an application that provides users with the ability to reach out to operations or repairs department regarding repair or maintenance requests and monitor the status of their request.

[Click here](https://megame24.github.io/Maintenance-Tracker/) to view the app on github pages.

[Click here](https://in-maintenance-tracker.herokuapp.com/) to view the web app on heroku.

The link to the API deployed to heroku: https://in-maintenance-tracker.herokuapp.com/api/v1

The link to the API documentation: https://in-maintenance-tracker.herokuapp.com/api/v1/docs

## Features

The app has the following features for the respective categories;

* A User can:

  * create an account and login.
  * make maintenance or repairs request.
  * view all his/her requests.
  * view the details of a single request, which includes a feedback from an admin if any.
  * update a request, if it is yet to be approved.
  * delete a request.

* An admin can:

  * approve/disapprove a repair/maintenance request.
  * mark request as resolved once it is done.
  * view all maintenance/repairs requests on the application.
  * filter requests.
  * view the details of a request.
  * provide feedback on approving/disapproving or on resolving a request.
  * trash a request.

## Technologies

The application uses `Nodejs` and `Express` frameworks on the server and `PostgreSQL` for persisting data. On the front-end, `HTML`, `CSS` & `JavaScript` are used for templating.

## Installation

Follow the steps below to setup a local development environment, make sure to have `Nodejs` and `PostgreSQL` installed.

1.  Clone the repository from a terminal `git clone https://github.com/megame24/Maintenance-Tracker.git`.
2.  Navigate to the project directory `cd Maintenance-Tracker`
3.  Run `npm install` on the terminal to install dependencies.
4.  Change `.env-sample` to `.env` and provide the necessary credentials
5.  Run `npm start` to start the application.

## Testing

Follow the steps below to test the application.

1.  Navigate to the project directory through a terminal
2.  If you haven't, install dependencies `npm install`
3.  Also, Change `.env-sample` to `.env` and provide the necessary credentials if applicable
4.  Run `npm test`
  
## Api EndPoints

EndPoint                      |   Functionality
------------------------------|------------------------
POST /auth/signup          |   User sign up.
POST /auth/login             |   User login.
GET /users/requests           |   Gets all requests of a logged in user 
GET /users/requests/:id       |   Get a single request by id
POST /users/requests          |   Creates a new request
PUT /users/requests/:id       |   Updates a request only if it has a status of pending
DELETE /users/requests/:id    |   Delete a request(cannot delete a request with status approved)
GET /requests            |   Gets all requests for an admin(only available to admin)
GET /requests/:id           |   Gets a request by id(only available to admin)
PUT /requests/:id/approve       |   Request approve endpoint(only available to admin)
PUT /requests/:id/disapprove          |   Request disapprove endpoint(only available to admin)
PUT /requests/:id/resolve      |   Request resolve endpoint(only available to admin)
DELETE /requests/:id    |   Trash a request; only requests with status resolved or disapproved can be trahed(only available to admin)

## Licence

MIT
