require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const port = process.env.PORT || 3001;


//API SECURITY
//app.use(helmet());

//HANDLE CORS ERROR
app.use(cors());

//MongoDB CONNECTION
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

if (process.env.MODE_ENV !== "production"){
    const mdb = mongoose.connection;
    mdb.on("open",()=>{
        console.log("MongoDB is connected")
    });
    
    mdb.on("error",err => {
        console.log(err)
    });
    
    //LOGGER
    app.use(morgan("tiny"));    
}


// SET BODY PARSER

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());


userRouter = require("./src/routers/user.router")
ticketRouter = require("./src/routers/ticket.router");

//USE ROUTERS
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);

//Error handler
const handleError = require("./src/utils/errorHandler");

app.use((req,res, next) =>{
    const error = new Error("Resouces not found");
    error.status = 404;
    next(error); // send the error to the next router (app.use)
});

app.use((error, req, res, next) =>{
    handleError(error, res);
});

const { append } = require("express/lib/response");


app.listen(port, () =>{
    console.log("API is ready on https://localhost:${port}");
});