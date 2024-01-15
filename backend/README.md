This application simulates the AWS API Gateway & AWS Lambda events using Express and Lambda-Local.

The application logic can be found in src.

There are two main directories: api & utils.

API contains an example lambda "customer". The customer lambda has a sample internal router (index.js), which uses URL-Pattern to read the event request paths to identify the desired target endpoint & any variables based on constants.js & routes.js. It points to the handlers directory, where you will find customers.js. This handler is where the API processing happens. It imports a function to get customer data and return it. The business logic does not live within the API but is called by it as needed. 

Utils contains a sample utility for formatting HTTP Responses for the Lambdas as well as the business logic utilities for customers.js

To use it, run in this folder:
- npm install
- npm start
