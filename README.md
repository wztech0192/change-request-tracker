# change-request-tracker
This is a web application capstone project used to track change request from user.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

1.	Install Git
2.	Install Node.js, npm, and yarn
3.	Install AdonisJS
4.	Install XAMPP for local server
5.	Pull the project from GitHub using the command 'git clone https://github.com/weijie0192/change-request-tracker'
6.	Open server directory, then run the command 'npm install' to install dependencies. Perform same instruction again under client directory
7.	Open XAMPP and click start button for Apache and MySQL module. Then click Admin button under MySQL row to browse phpMyAdmin
8.	Under the phpMyAdmin site, create a new database and name it 'crt_capstone'
9.	Return to server directory and run the command 'adonis migration:run' to generate database tables
10.	After migration, run the command 'adonis seed --files='DefaultSeeder.js' to generate default Developer account.
11.	Open server directory, then run the command line 'adonis serve --dev' to deploy dev server
12.	Open client directory located in main, then run the command line 'npm run serve' to start local client-server
14.	To visit the project website, enter the URL 'localhost:8080' in any modern browser.
15. Login default account with the email 'no-reply@rsicrt.com' and password 'weijie0192'


## Built With
### Backend
* [Adonis.js] - The backend framework used
* [Vue.js] - The frondend framework used
* Languages:
        a.	[JavaScript] – Script Language.
        b.	[HTML5] – Markup Language.
        c.	[CSS3] – Style Sheet Language.
* Frameworks:
    [NodeJS] – Backend JavaScript Framework.
    [AdonisJS] – MVC Style NodeJs Framework.
    [VueJS] – Frontend Javascript Framework.
    [Bootstrap] – Frontend Design Framework.
    
* Dependencies:
    [KenxJS] – SQL Query Builder used in AdonisJS.
    [Vuex] – state management pattern for Vue.
    [Axios] – lightweight JS library used to perform HTTP                requests.
    [Vuex-persistedstate] – persist and rehydrate Vuex states.
    [JQuery] – JS library that simplifies JavaScript tasks.
    [etc...] - CKEditor5, vue-js-modal, Datatable, Select2, ChartJs, Bootstrap-dDatetime, DateRangeSeletorPicker, Pace, Lodash, Moment.

 * Template: 
    [AdminLTE] - an open source template built on top of Bootstrap 
    
 * Service:
    [Mailgun] –send, retrieve, and analysis emails.


## Authors

* **Wei Zheng** - *Initial work* 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
