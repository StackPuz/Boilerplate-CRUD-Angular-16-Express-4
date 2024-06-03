# Boilerplate-CRUD-Angular-16-Express-4
Boilerplate CRUD Web App created with Angular 16 + Express 4 by [StackPuz](https://stackpuz.com).

## Demo
Checkout the live demo at https://demo-spa.stackpuz.com

## Features
- Fully Responsive Layout.
- Sorting, Filtering and Pagination on Data List.
- User Management, User Authentication and Authorization, User Profile, Reset Password.
- Input Mask and Date Picker for date and time input field with Form Validation.

![Responsive Layout](https://stackpuz.com/img/feature/responsive.gif)  
![Data List](https://stackpuz.com/img/feature/list.gif)  
![User Module](https://stackpuz.com/img/feature/user.png)  
![Input Mask and Date Picker](https://stackpuz.com/img/feature/date.gif)

## Minimum requirements
- Node.js 16.14
- MySQL 5.7

## Installation
1. Clone this repository. `git clone https://github.com/stackpuz/Boilerplate-CRUD-Angular-16-Express-4.git .`
2. Change directory to Angular project. `cd angular`
3. Install the Angular dependencies. `npm install`
4. Change directory to Express project. `cd ../express_api`
5. Install the Express dependencies. `npm install`
6. Create a new database and run [/database.sql](/database.sql) script to create tables and import data.
7. Edit the database configuration in [/express_api/config.js](/express_api/config.js) file.
    ```
    db: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'testdb',
        dialect: 'mysql'
    }
    ```

## Run project

1. Run Angular project. `npm start`
2. Run Express project. `node app.js`
3. Navigate to `http://localhost:4200`
4. Login with user `admin` password `1234`

## Customization
To customize this project to use other Database Engines, CSS Frameworks, Icons, Input Mask, Date picker, Date format, Font and more. Please visit [stackpuz.com](https://stackpuz.com).

## License

[MIT](https://opensource.org/licenses/MIT)