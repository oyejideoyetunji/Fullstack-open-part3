const Person = require("../models/person")
const personRouter = require("express").Router()



personRouter.get("/info", (req, res, next) => {
    let recievedTime = new Date()
    Person.estimatedDocumentCount().then(count => {
        res.status(200).send(
            `
            <h3>Phonebook has info for ${count} people</h3>
            <h3>${recievedTime}</h3>
            `
        )
    }).catch(error => next(error))
})

personRouter.get("/", (req, res, next) => {
    Person.find({}).then(persons => {
        if (persons) {
            res.status(200).json(persons)
        } else {
            res.status(404).json({ message: "Data not found" })
        }
    }).catch(error => next(error))
})

personRouter.get("/:id", (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.status(200).json(person)
        } else {
            res.status(404).json({ message: "Data not found" })
        }
    }).catch(error => next(error))
})

personRouter.delete("/:id", (req, res, next) => {
    Person.findByIdAndRemove(req.params.id).then(() => {
        res.status(204).end()
    }).catch(error => next(error))
})

personRouter.post("/", (req, res, next) => {
    const recievedPersonData = req.body

    if (!recievedPersonData) {
        res.status(400).json({
            message: "No content"
        })
        return
    }
    if (!recievedPersonData.name || !recievedPersonData.number) {
        res.status(400).json({
            message: "Incomplete content, 'name' or 'number' is missing"
        })
        return
    }

    const newPersonData = new Person({
        name: recievedPersonData.name,
        number: recievedPersonData.number
    })
    newPersonData.save().then(result => {
        res.status(200).send(result)
    }).catch(error => next(error))

})

personRouter.put("/:id", (req, res, next) => {
    const personUpdateData = req.body

    if (!personUpdateData) {
        res.status(400).json({
            message: "No content"
        })
        return
    }
    if (!personUpdateData.name || !personUpdateData.number) {
        res.status(400).json({
            message: "Incomplete content"
        })
        return
    }

    const person = {
        name: personUpdateData.name,
        number: personUpdateData.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: "query" })
        .then(updatedData => {
            if (updatedData) {
                res.json(updatedData)
            } else {
                res.status(404).json({ message: "Data not found" })
            }
        }).catch(error => next(error))

})


module.exports = personRouter
