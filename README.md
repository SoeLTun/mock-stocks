# MockStocks

MockStocks is a stock market simulation application built with Angular. This project was generated using the Angular CLI.

## Installation

Before running the app, make sure to install the required dependencies by running:
run `npm install`

## Development server

### Start Both JSON Server and Angular Dev Server

Run `npm run dev` to start both a json server and a dev server. Navigate to `http://localhost:4200/` to test the application.Both servers will reload automatically when you make changes to the source files.

### Start Angular Dev Server Only

Run `npm run start` or `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Start JSON Server Only

Run `npm run json-server` for a json server. Navigate to `http://localhost:3000/`. The server will automatically reload if you change src/db.json file. 

### Resetting Mock Data

To reset the mock data in `src/db.json`, copy the data from `src/db_copy.json` and paste them into `src/db.json`.

## Running unit tests

Run `npm run test` or `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
