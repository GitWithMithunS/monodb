const express= require('express')
const {connecttoDb ,getDb } = require('./db')

//init app and middleware
const app = express() //to create an instance

//db connection
connecttoDb((err) => {                    //The connecttoDb function is called to establish a connection to the MongoDB database. It is an asynchronous, taking a callback function that is executed once the connection is established or if there's an error
    if(!err) { 
        console.log('conected to mongodb successfully')                          //If the database connection is successful (!err), it starts the Express.js server to listen on port 3000. Additionally, it calls getDb to obtain a reference to the database (db variable)
        app.listen(3000 , () => {
            console.log('app is listening on port 3000')
        })
        db = getDb()
    }
    else{
        console.error('Failed to connect to the database:', err);
    }
})

// app.listen(3000 , () => {
//     console.log('app is listening on port 3000')
// })

//routes
app.get('/',(req,res) =>{
    res.send('welcome to the api')
})
app.get('/books' , (req,res) => {

    let books =[]

    db.collection('books')                       //books is the name of the collection inside the mongodb which ur trying to access
    .find()                                       // .find()       //the find method returns a cursor (which is an object) that points to the document in the db outlined by our query .so if we do not add any querry it points to the whole collection of documents.
                                                 //if we add filter(arguments) then the cursor will point to subset of documents based on the filter.now the cusror object which is returned from find method exposes method that we can use to fetch data which the cursor points to (ex: toArray , forEach)
                                                 //toArray - fetchs all doc. pointed by the cursor and puts it into an array
                                                 //forEach - iterates the documents one at a time and allows use to process each one of the individually.
                                                 //mongodb may hv 1000s of docs. in a collection.so it allows u to fetch docs in batches(mostly 101 docs at a time to reduce the risk of using lotof network at the same time for fetching all 1000s of docs.)  
                                                 //so generally we use toArray method to fetch the first set of batch and then use forEach methood to go through al the docs one by one. and so on.{note:- this is not true in case of mongodb shell . where it automatically iterates the first batche of 20docs and using 'i t' we can access next batch of docs.we need not use cursor method here.}
    .sort({author:1})                            //sorts the docs in assending order w.r.t author and returns a cursor poiting to it
    .forEach(book => books.push(book))          // iterating through each elements(here the element is book) and storing(by using push method) it into books array
    .then(() => {
        res.status(200).json(books)              //resolve the fuctionby sending/returing the books array
    })
    .catch(() => {
        res.status(500).json({error:'could not fetch the documents'})   //if any error occurs then this statement is returned
    })

    // res.json({msg:'welcome to the api'})     //remember mulltiple respose(res.json or res.send ) can not be used in a single express.js
})