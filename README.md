# Change Requeset Tracker
This is a fullstack web project that provide user multiple methods to submit and track change request. The project contains a RESTful API Server built with AdonisJS, Responsive Single Page Web Application built with VueJS and AdminLTE template, and a desktop application built with native Java.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

1.	Install Git
2.	Install Node.js, npm, and yarn
3.	Run `npm i -g @adonisjs/cli` command to install AdonisJS cli
4.	Install XAMPP for local server
5.	Clone the entire project directory from GitHub using the command `git clone https://github.com/weijie0192/change-request-tracker`
6.  Create .env file, using .env-example as the reference
7.	Open server directory, then run the command `npm install` to install dependencies. Perform same instruction again under client directory
8.	Open XAMPP and click start button for Apache and MySQL module. Then click Admin button under MySQL row to browse phpMyAdmin
9.	Under the phpMyAdmin site, create a new database for the project
10.	Return to server directory and run the command `adonis migration:run` to generate database tables
11.	After migration, run the command `adonis seed` to generate default Developer account
12.	Open server directory, then run the command line `adonis serve --dev` to deploy dev server
13.	Open client directory located in main, then run the command line `npm run serve` to start local client-server
14.	To visit the project website, enter the URL `localhost:8080` in any modern browser.
15. Login default account with the email `no-reply@rsicrt.com` and password `weijie0192`


## Built With
* [Adonis.js] - The backend framework used
* [Vue.js] - The frondend framework used
* Languages:
  - [JavaScript] – Script Language.
  - [HTML5] – Markup Language.
  - [CSS3] – Style Sheet Language.
* Frameworks:
  - [NodeJS] – Backend JavaScript Framework.
  - [AdonisJS] – MVC Style NodeJs Framework.
  - [VueJS] – Frontend Javascript Framework.
  - [Bootstrap] – Frontend Design Framework.
    
* Dependencies:
  - [KenxJS] – SQL Query Builder used in AdonisJS.
  - [Vuex] – state management pattern for Vue.
  - [Axios] – lightweight JS library used to perform HTTP                requests.
  - [Vuex-persistedstate] – persist and rehydrate Vuex states.
  - [JQuery] – JS library that simplifies JavaScript tasks.
  - [etc...] - CKEditor5, vue-js-modal, Datatable, Select2, ChartJs, Bootstrap-dDatetime, DateRangeSeletorPicker, Pace, Lodash, Moment.

* Template: 
  - [AdminLTE] - an open source template built on top of Bootstrap 
    
* Service:
  - [Mailgun] –send, retrieve, and analysis emails.


## Authors

* **Wei Zheng** - *Initial work* 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
