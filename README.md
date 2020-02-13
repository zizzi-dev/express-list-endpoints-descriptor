# Simple, lightweight, fast and customizable
Extends express routes adding descriptor function. In descriptor you can add the **object** representing the parameters that you need.
```sh
app.get('/books', function (req, res) {
    res.send("My fantastic book");
}).descriptor({
    name : 'Retrieve a fantastic book',
    params : []
});
```

# Basic example
```sh
var express = require('express');
var api = require('express-list-endpoints-descriptor')(express);
var app = express();

app.get('/user', function (req, res) {
    res.json({user:true})
}).descriptor({
    name : 'Get list of users'
});

app.get('/api', function (req, res) {    
    res.send(api.listAllEndpoints(app));
}).descriptor({
    name : 'My first API documentation'
});

app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});
```

# Example of return object in `/api`
```sh
[
    {
        "path": "/user",
        "methods": ["GET"],
        "descriptor": [{"name": "Get list of users"}]
    },
    {
        "path": "/api",
        "methods": ["GET"],
        "descriptor": [{"name": "My first API documentation"}]
    }
]
```
Inside `descriptor` object you will find the object that you defined inside the `descriptor` function after route definition.
# Keys definition
<!-- 
| Key | Type  | Description  | Example |
| :-:   | :-: | :---: | :- |
| `path` |  `[STRING]` | Endpoint route | `/users` |
| `methods` |  `[ARRAY of strings]` | Methods for the same endpoint | `['GET','POST']` |
| `descriptor` |  `[ARRAY of objects]` | Object user defined inside descriptor <br>function (in the same order of `methods` array) | `[{name:'description of /users with method get'}`<br>,`{name:'description of /users with method post']` |
-->
* **`path`**: `[STRING]` 
* **`methods`** : `[ARRAY of strings]` 
Methods for the same endpoint e.g. `['GET','POST']`
* **`descriptor`**: `[ARRAY of objects]`
Object user defined inside  descriptor function (in the same order of `methods` array)
`[{name:'description of /users with method get'}`, <br>
`{name:'description of /users with method post']`


# Mehods
* **api.listAllEndpoints(server)** 
retrieve all the mapped Express APIs even if the ones that were not extended by the `descriptor` function.
The object **server** is an instance of express.
* **api.listEndpoints(server)** :
retrieve only the mapped Express routes, that extend with the `descriptor` function. The object **server** is an instance of express.

# Retrieve all endpoints list
```sh
app.get('/apis', function (req, res) {
    res.send(api.listAllEndpoints(app));
}).descriptor({
    name : 'Retrieve APIs documentation'
});
```

# Retrieve endpoints list that has been extended
```sh
app.get('/apis', function (req, res) {
    res.send(api.listEndpoints(app));
}).descriptor({
    routedescr : 'Retrieve APIs list only from routes that have it'
});
```

# Usage 
The `express-list-endpoints-descriptor` module allows to create documentation for Express APIs.
**Works with Your router instance (`router`) or your app instance (`app`).**

# Example - APP instance
```sh
var express = require('express');
var api = require('express-list-endpoints-descriptor')(express);
var app = express();

app.get('/user/:ID', function (req, res) {
    res.json({user:true})
}).descriptor({
    name : 'Get details about user',
    params: {ID:'STRING'}
});

//will not appear on endpoints = api.listEndpoints(app);
app.post('/user/:ID', function (req, res) {
    res.json({user:true})
})

app.get('/api', function (req, res) {    
    res.send(api.listAllEndpoints(app));
}).descriptor({
    name : 'My first API documentation'
});

app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});
```
# Example - Router instance with multiple files
**`server.js`**
```sh
vconst express = require('express');
const router1 = require('./modules/router1');
const router2 = require('./modules/router2');
const descriptor = require('express-list-endpoints-descriptor')(express);

const server = express();

//map routes
server.use('/app',router1);
server.use('/sys',router2);

//REMEMBER to invoke the listAllEndpoints or listEndpoints 
//after every route has been defined in the server object
//E.G. in the list inside endpoints /allendpoints and //endpoints are missing
var endpoints = descriptor.listEndpoints(server);

server.get('/allendpoints',(req,res)=>{
    //return all endpoints defined inside routes
    res.send(descriptor.listAllEndpoints(server));
})

server.get('/endpoints',(req,res)=>{
    //return all endpoints defined inside routes
    res.send(descriptor.listEndpoints(server));
})

//create server
var http = server.listen(8080, function () {
    console.log('TEST descriptor server listening on http://localhost:8080');            
});
```
**`modules/router1.js`**
```sh
const express = require('express');
var api = require('express-list-endpoints-descriptor')(express);

let router = express.Router();

router.post('/login', (req,res)=>{
    res.json({ok:true})
})
.descriptor({
    descr : 'Perform login, please look at key params for mandatory fields',
    params:[
        {username:'STRING',isMandatory:true},
        {password:'STRING',isMandatory:true}],
    isSecure:false
});

router.get('/verify',  (req,res)=>{
    res.json({ok:true});
})

router.delete('/verify',  (req,res)=>{
    res.json({ok:true});
})

router.post('/verify',  (req,res)=>{
    res.json({ok:true});
})
.descriptor({
    descr : 'decode token and gives back the session, header bearer token is needed',
    params:[
        {header:'STRING',isMandatory:true}
       ],
    isSecure:true
});

module.exports = router;
```
**`modules/router2.js`**
```sh
const express = require('express');
var api = require('express-list-endpoints-descriptor')(express);

let router = express.Router();


router.get('/version', (req,res)=>{
    res.json({ok:true})
})
.descriptor({
    descr : 'Get back the version of app',
    needsToken:false
});


router.get('/state',  (req,res)=>{
    res.json({ok:true});
})
.descriptor({
    descr : 'Check state of application',
    params:[
        {header:'STRING',isMandatory:true}
       ],
    needsToken:true
});

module.exports = router;
```

# Installation
```sh
npm istall express-list-endpoints-descriptor
```

License
----

ISC
