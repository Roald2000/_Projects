# Simple SignIn/SignUp

This project is a web application that provides basic sign up and sign in functionality using MySQL/XAMPP for the database and React with Node.js/Express for the back end.

## Prerequisites

To run this project, you need to have the following installed on your machine:

- Node.js
- XAMPP
- MySQL

## Installation

1. Clone the repository using `git clone https://github.com/Roald2000/signin_signup_react_app_mysql.git`
2. Install the dependencies for the server by navigating to the server directory with `cd server` and running `npm install`
3. Install the dependencies for the client by navigating to the client directory with `cd ../client` and running `npm install`
4. Set up your MySQL database with whatever name you name it with and `users_tbl` as the tablename having field attributes of `username(VARCHAR 50)`,`password(VARCHAR 50)` and `id(INT 10) AUTO_INCREMENT`, `username` and `id` as PRIMARY_KEY
5. Update the `.env` file in the `server` directory with your database credentials and which port will the server will listen or run
6. Start the server using `npm run server` in the `server` directory
7. Start the client using `npm run dev` in the `client` directory

## Usage

Once the server and client are running, you can access the application by navigating to `http://localhost:3000` or whatever port your application is running on in your web browser. From there, you can sign up for a new account or sign in to an existing account.

## Technologies Used

- Node.js
- Express.js
- React
- MySQL

## Contributing

If you would like to contribute to this project, feel free to submit a pull request or open an issue. All contributions are welcome!

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
