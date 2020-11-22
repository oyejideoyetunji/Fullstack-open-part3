const mongoose = require("mongoose")


if (process.argv.length < 3) {
    console.log("please supply password as an argument")
    process.exit(1)
}

const dbname = "phonenotedb"
const password = process.argv[2]
const url = `mongodb+srv://phonenote:${password}@cluster0.xnr1x.mongodb.net/${dbname}?retryWrites=true&w=majority`


mongoose.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }
)


const personSchema = new mongoose.Schema({
    name:   String,
    number: String
})

const Person = mongoose.model("Person", personSchema)

if(process.argv[3] && process.argv[4]){

    const person = new Person({
        name:   process.argv[3],
        number: process.argv[4]
    })

    person.save().then(resp => {
        console.log(`added ${resp.name} number ${resp.number} to phonebook`)
        mongoose.connection.close()
    })

}else {
    Person.find({}).then(persons => {
        console.log("Phonebook:")

        for(const person of persons){
            console.log(`${person.name}  ${person.number}`)
        }

        mongoose.connection.close()
    })
}
