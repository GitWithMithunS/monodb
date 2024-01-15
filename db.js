const { MongoClient } = require('mongodb')            //The code destructures the mongoClient object from the 'mongodb' library. This object is used to interact with the MongoDB server
//MongoClient is a part of the official MongoDB driver for Node.js, which is a low-level driver that allows your Node.js application to connect to a MongoDB database server, send commands, and receive responses. It provides a basic interface for interacting with MongoDB, handling tasks like connecting to a database, executing queries, and managing transactions.
//On the other hand, an ODM (Object Data Modeling) library, such as Mongoose, is a higher-level abstraction that adds an extra layer of functionality on top of the MongoDB driver. ODMs are specifically designed to help developers work with MongoDB in a more object-oriented way. They often provide features like schema definition, model creation, validation, middleware, and a more intuitive interface for working with MongoDB data

//Database Connection and Exported Functions:
// let url = 'mongodb://127.0.0.1:27017/netninja?directConnection=true'       //it is used to connect to the MongoDB server at the specified URL  {NOTE:- U ARE USING 'netninja' COLLECTION AND NOT 'mydiary' COLLECTION HERE AS STATED IN THE URL}
let url = "mongodb+srv://mongolearn:learn123@cluster0.s0o48ew.mongodb.net/?retryWrites=true&w=majority"
let dbConnection                                      //This variable is declared to store the reference to the connected database.
module.exports = {
    //to connect to database
    connecttoDb: (cb) => {                            //connecttoDb: This function is designed to connect to the MongoDB database. It takes a callback function cb as a parameter, which is intended to be executed after the database connection is established
        MongoClient.connect(url)    
            .then((client) => {
                 dbConnection = client.db()           //Upon successful connection, it sets dbConnection to the connected database (client.db()).
                return cb()                           //return the callback function
            })
            .catch(err => {                           //If there's an error during the connection, it logs the error and also executes the callback function with the error.
                console.log(err)
                return cb(err)
            })
    },
    //return the value/connection to the database .this is where  add,remove,update value happens later    
    getDb: () =>  dbConnection                    //getDb: This function returns the value of dbConnection. This is where you obtain the reference to the connected database, which can be used for various database operations like adding, removing, or updating values.
}