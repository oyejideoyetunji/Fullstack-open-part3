const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
let { persons } = require("./src/persons");


const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
app.use(express.static("build"));

morgan.token("body", function(req, res){
    return JSON.stringify(req.body);
})
app.use(morgan( ":method :url :status :res[content-length] - :response-time ms :body" ));


app.get("/api/info", (req, res) => {
  let recievedTime = new Date();
  res.status(200);
  res.send(
    `
        <h3>Phonebook has info for ${persons.length} people</h3>
        <h3>${recievedTime}</h3>
        `
  );
});

app.get("/api/persons", (req, res) => {
  res.status(200).json(persons).end();
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const contact = persons.find((contact) => contact.id === id);

  if (contact) {
    res.status(200).json(contact).end();
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id)

  res.status(204).end();

});

app.post("/api/persons", (req, res) => {
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
    if(persons.some(person => person.number === recievedPersonData.name)){
        res.status(400).json({
            error: `'name' must be unique, person with name: "${recievedPersonData.name}" already exists`
        });
        return;
    }

    const processedPersonData = {
        ...recievedPersonData,
        id: Math.random() * 1000000
    }
    persons = persons.concat(processedPersonData);
    res.status(200).send(processedPersonData);
    
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}......`);
});
