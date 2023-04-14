# SimpleSessionBasedAuth

### Introduction
This is a simple ORM and session-based authentication system that can be used by frontend developers. It provides an easy way to perform CRUD operations on a database and secure user authentication using sessions.

Here is an example README file for a simple session-based authentication system in Node.js with the following modules:

- bcrypt: ^5.1.0
- body-parser: ^1.20.2
- connect-session-sequelize: ^7.1.5
- cookie-parser: ^1.4.6
- cors: ^2.8.5
- dotenv: ^16.0.3
- express: ^4.18.2
- express-device: ^0.4.2
- express-session: ^1.17.3
- mysql2: ^3.2.0
- nodemailer: ^6.9.1
- nodemon: ^2.0.22
- sequelize: ^6.31.0

### Installation
To install the necessary modules, run the following command in your terminal:

```bash
npm install
```
### Configuration
In order to run the application, you need to create a **.env** file in the root directory and set the following environment variables:

```makefile
DATABASE="Your SQL Database Name"
USERNAME="Your database username"
PASSWORD="Your database password
HOST= "Api Host"
PORT=3000 or "Your Example"
EMAIL="Your Email"
PASS="Your Email Password"
```

Make sure to replace the values with your own database credentials and email account information.

### Usage
```bash
npm start
```
This will start the server on port 3000. You can then visit *http://localhost:3000* in your web browser to access the application.

### License
This project is licensed under the MIT License. See the LICENSE file for details.
