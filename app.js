const express = require("express");
const morgan = require("morgan");

let { persons } = require("./src/persons");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(morgan("dev"));
app.use(express.json());

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
  res.status(200);
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const contact = persons.find((contact) => contact.id === id);

  if (contact) {
    res.status(200).json(contact).end();
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  persons = persons.filter(person => person !== id)

  res.status(204).end;

});

app.post("/api/persons", (req, res) => {
    const person = req.body;

    if(person){
        persons = persons.concat(person);
        console.log(persons);
        res.status(200).end();
    } else {
        res.status(400).json({
            error: "No content"
        })
    }
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}......`);
});
