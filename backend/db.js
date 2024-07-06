const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://nitessah000:2G4ynQDLyxrFBIjZ@cluster0.ltqmyce.mongodb.net/paytm-2")

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String
})

const user = mongoose.model("user", userSchema)



const accountSchema = mongoose.Schema({
    userId: {
        type: String,
        ref: 'user',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const Account = mongoose.model("Account", accountSchema)

module.exports = {
    user,
    Account
}