const express = require('express')
const { connecttoDb, getDb } = require('./db')
const { ObjectId } = require('mongodb')

//init app and middleware
const app = express()                      //to create an instance

app.use(express.json())                           //app.use(express) is part of a Node.js/Express.js application. the use method provided by the Express.js framework is used to incorporate middleware into your application.When you pass express as middleware using app.use(express), you are telling your application to use the default middleware provided by Express.js.
//it passes any json coming in on request.(basically in a post request the body of the post request is to be access by using request.body property.and to use this property the express middleware('app.use(express.json())') must be used  )

//db connection
connecttoDb((err) => {                    //The connecttoDb function is called to establish a connection to the MongoDB database. It is an asynchronous, taking a callback function that is executed once the connection is established or if there's an error
    if (!err) {
        console.log('conected to mongodb successfully')                          //If the database connection is successful (!err), it starts the Express.js server to listen on port 3000. Additionally, it calls getDb to obtain a reference to the database (db variable)
        app.listen(3000, () => {
            console.log('app is listening on port 3000')
        })
        db = getDb()
    }
    else {
        console.error('Failed to connect to the database:', err);
    }
})

// app.listen(3000 , () => {
//     console.log('app is listening on port 3000')
// })




//   ROUTES   ;

app.get('/', (req, res) => {
    res.send('welcome to the api')
})

app.get('/books', (req, res) => {
    //current page (pagination)
    const page = req.query.p || 0
    const booksperpage = 3

    let books = []
    db.collection('books')                       //books is the name of the collection inside the mongodb which ur trying to access
        .find()                                      // .find()       //the find method returns a cursor (which is an object) that points to the document in the db outlined by our query .so if we do not add any querry it points to the whole collection of documents.
        //if we add filter(arguments) then the cursor will point to subset of documents based on the filter.now the cusror object which is returned from find method exposes method that we can use to fetch data which the cursor points to (ex: toArray , forEach)
        //toArray - fetchs all doc. pointed by the cursor and puts it into an array
        //forEach - iterates the documents one at a time and allows use to process each one of the individually.
        //mongodb may hv 1000s of docs. in a collection.so it allows u to fetch docs in batches(mostly 101 docs at a time to reduce the risk of using lotof network at the same time for fetching all 1000s of docs.)  
        //so generally we use toArray method to fetch the first set of batch and then use forEach methood to go through all the docs one by one. and so on.{note:- this is not true in case of mongodb shell . where it automatically iterates the first batch of 20docs and using 'i t' we can access next batch of docs.we need not use cursor method here.}
        .sort({ author: 1 })                            //sorts the docs in assending order w.r.t author and returns a cursor pointing to it
        .skip(page*booksperpage)
        .limit(booksperpage)
        .forEach(book => books.push(book))           // iterating through each elements(here the element is book) and storing(by using push method) it into books array
        .then(() => {
            res.status(200).json(books)              //resolve the fuctionby sending/returing the books array
        })
        .catch(() => {
            res.status(500).json({ error: 'could not fetch the documents' })   //if any error occurs then this statement is returned
        })

    // res.json({msg:'welcome to the api'})      //remember mulltiple respose(res.json or res.send ) can not be used in a single express.js
})

app.get('/books/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {            //ObjectId.isValid() is a static method of the ObjectId class provided by the MongoDB Node.js driver.It checks whether the provided string id is a valid ObjectId format.Returns true if the string is a valid ObjectId, and false otherwise 
        db.collection('books')                       //req.params.id   params is used to access the route parameter(here:- '/books/:id') in express
            .findOne({ _id: new ObjectId(req.params.id) })  //In MongoDB, ObjectId is a special data type used to represent a unique identifier for documents within a collection. MongoDB automatically generates and assigns an ObjectId to each document when it is inserted into a collection.
            .then(doc => {                               //the use of 'new' before ObjectId(req.params.id) is required because ObjectId is a constructor function provided by the MongoDB Node.js driver. When you use it to create a new ObjectId, you should invoke it with the 'new' keyword.When used as a constructor, it creates a new instance of the ObjectId data type(The ObjectId constructor is used to convert the req.params.id (which is a string) into a valid ObjectId)
                res.status(200).json(doc)                //Omitting the new keyword would still call the ObjectId function and create an object, but it may lead to unexpected behavior if used in a context where an instance is expected. Using new ensures that you are creating a new instance of ObjectId.
            })
            .catch(err => {
                res.status(500).json({ error: "colud not fetch the documnets" })
                console.log('this is the error recived', err)
            })
    } else {
        res.status(500).json({ error: 'Not a valid document id' })
    }
})

app.post('/books', (req, res) => {
    const book = req.body

    db.collection('books')
        .insertOne(book)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).send('the book could not be added to the document')
        })
})

app.delete('/books/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection("books")
            .deleteOne({ _id: new ObjectId(req.params.id) })
            .then((e) => {
                res.status(200).json(e)
            })
            .catch(err => {
                res.status(500).send('the book could not be deleted from the document')
            })
    }
    else {
        res.status(500).json({ error: 'Not a valid document id' })
    }
})

app.patch('/books/:id',(req,res) => {             //patch is used in case of updating a data(i have used put method in mydiary to update the data)
    const updates = req.body
    if (ObjectId.isValid(req.params.id)) {
        db.collection("books")
            .updateOne({ _id: new ObjectId(req.params.id)},{$set:updates})
            .then((e) => {
                res.status(200).json(e)
            })
            .catch(err => {
                res.status(500).send('the book could not be updated to the document')
            })
    }
    else {
        res.status(500).json({ error: 'Not a valid document id' })
    }
})