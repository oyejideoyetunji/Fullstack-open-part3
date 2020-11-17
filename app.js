require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");


const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
app.use(express.static("build"));

morgan.token("body", function(req, res){
    return JSON.stringify(req.body);
})
app.use(morgan( ":method :url :status :res[content-length] - :response-time ms :body" ));


app.get("/api/info", (req, res, next) => {
    let recievedTime = new Date();
    Person.estimatedDocumentCount()
        .then(count => {
            res.status(200).send(
                `
                <h3>Phonebook has info for ${count} people</h3>
                <h3>${recievedTime}</h3>
                `
            );
        }
    ).catch(error => next(error))
});

app.get("/api/persons", (req, res, next) => {
    Person.find({}).then(persons =>{
        if(persons.length){
            res.status(200).json(persons);
        }else {
            res.status(404).json({ error: "Data not found" });
        }
    }).catch(error => next(error))
});

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id).then(person =>{
        if(person){
            res.status(200).json(person);
        }else {
            res.status(404).json({error: "Data not found"});
        }
    }).catch(error => next(error))
});

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndRemove(req.params.id).then(result =>{
        res.status(204).end();
    }).catch(error => next(error))
});

app.post("/api/persons", (req, res, next) => {
    const recievedPersonData = req.body;

    if(!recievedPersonData){
        res.status(400).json({
            error: "No content"
        });
        return;
    }
    if(!recievedPersonData.name || !recievedPersonData.number){
        res.status(400).json({
            error: "Incomplete content, 'name' or 'number' is missing"
        });
        return;
    }
    Person.exists({ name: recievedPersonData.name })
        .then(exists =>{
            if(exists){
                res.status(400).json({
                    error: `'name' must be unique, person with name: '${recievedPersonData.name}' already exists`
                });
                return;
            }else {
                const newPersonData = new Person({
                    name: recievedPersonData.name,
                    number: recievedPersonData.number
                })
                newPersonData.save().then(result => {
                    res.status(200).send(result);
                }).catch(error => next(error))
            }
        }
    )
    
})

app.put("/api/persons/:id", (req, res, next) =>{
    const personUpdateData = req.body;

    if (!personUpdateData) {
        res.status(400).json({
            error: "No content"
        });
        return;
    }
    if ( !personUpdateData.name || !personUpdateData.number ) {
        res.status(400).json({
            error: "Incomplete content"
        });
        return;
    }

    const person = {
        name: personUpdateData.name,
        number: personUpdateData.number
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatedData =>{
            if(updatedData){
                res.json(updatedData)
            }else {
                res.status(404).json({ error: "Data not found" });
            }
        }).catch(error => next(error))

})

const errorhandler = function(error, req, res, next){
    console.error(error);

    if(error.name === "CastError") return res.status(400).send({error: "malformated id"});

    next(error);
};
app.use(errorhandler)

const unknownEndpoint = function(req, res){
    res.status(404).send({error: "unknown endpoint"});
};
app.use(unknownEndpoint)

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}......`);
});
