const express = require('express');
const appRoot = require('app-root-path');

const employeesControler = require(appRoot + '/src/controllers/EmployeeController');

const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.use('/abc/1.0/api', employeesControler);

const port = 5000;

app.listen(port, () => console.log(`server start on port ${port}`))
