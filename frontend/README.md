This application consists of a simple Login page.

The application logic can be found in src/App.js.

It uses React's reducer for controlling state and react-bootstrap for quick styling.

The login credentials are validated in a mock backend.

If the login is successful, the user receives a confirmation message and the form is reset after 5 seconds.

Otherwise, the user is alerted with an error message.

The valid credentials to login is user@email.com / 123456.

To use it run in this folder:
- npm install
- npm start
