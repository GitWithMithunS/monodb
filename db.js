const { MongoClient } = require('mongodb')            //The code destructures the mongoClient object from the 'mongodb' library. This object is used to interact with the MongoDB server


//Database Connection and Exported Functions:

let dbConnection                                      //This variable is declared to store the reference to the connected database.
module.exports = {
    //to connect to database
    connecttoDb: (cb) => {                            //connecttoDb: This function is designed to connect to the MongoDB database. It takes a callback function cb as a parameter, which is intended to be executed after the database connection is established
        MongoClient.connect('mongodb://127.0.0.1:27017/netninja?directConnection=true')    //it is used to connect to the MongoDB server at the specified URL  {NOTE:- U ARE USING 'netninja' COLLECTION AND NOT 'mydiary' COLLECTION HERE AS STATED INT HE URL}
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