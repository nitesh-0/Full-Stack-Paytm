const express = require("express")
const { user, Account } = require("../db")
const zod = require("zod")
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware")


const router = express.Router()

//******************************************************signup code********************************************************

// setting up zod schema for valid inputs
const userZod = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

router.post("/signup", async (req, res) => {
    const userBody = req.body
    const checkUser = userZod.safeParse(userBody)
    if (!checkUser) {
        res.status(403).json({
            msg: "Invalid Input"
        })
    }

    const existingUser = await user.findOne({
        username: userBody.username,
        password: userBody.password
    })

    if (existingUser) {
        res.status(403).json({
            msg: "user already exists"
        })
        return
    }

    const newUser = await user.create({
        username: userBody.username,
        password: userBody.password,
        firstName: userBody.firstName,
        lastName: userBody.lastName
    })

    const userId = newUser._id

    //Creating Account and giving user a random balance
    await Account.create({
        userId: newUser._id,
        balance: 1+Math.random()*1000
    })

    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    res.json({
        token: token
    })
})

//**********************************************************SignIn code**************************************************************
const signinZod = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinZod.safeParse(req.body)

    if (!success) {
        res.status(402).json({
            msg: "Invalid input type"
        })
    }

    const findUser = await user.findOne({
        username: req.body.username,
        password: req.body.password
    })

    const userId = findUser._id

    if (findUser) {
        const token = jwt.sign({
            userId
        }, JWT_SECRET)

        res.json({
            token: token,
            msg: "you are signedIn successfully"
        })
    }
})

//**********************************************************Updating Code**********************************************************
// const updateZod = zod.object({
//     username: zod.string().email().optional(),
//     firstname: zod.string().optional(),
//     lastName: zod.string().optional()
// })
router.put("/update", authMiddleware, async (req, res) => {
    // const { updateValidation } = updateZod.safeParse(req.userBody)

    // if (!updateValidation) {
    //     res.status(403).json({
    //         msg: "Invalid input type"
    //     })
    // }

    await user.updateOne(req.body, {
        _id: req.userId
    })

    res.status(403).json({
        msg: "user updated successfully"
    })
})


//************************************************Searching Part************************************************************
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await user.find({$or: [{firstName: {"$regex": filter}}, {lastName: {"$regex": filter }}]})

    console.log(JSON.stringify(users));

    res.json({user: users.map(user => ({username: user.username,firstName: user.firstName,lastName: user.lastName,_id: user._id}))})  })


module.exports = router