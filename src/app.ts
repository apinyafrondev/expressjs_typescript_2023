import express, { Request, Response } from 'express';
import bcrypt, { hash } from 'bcrypt';
import * as mongoose from 'mongoose';
import { MongoDBConnection } from './connection/mongodb_connect'
import { Users } from './Schemas/Schema_user';
const jwt = require('jsonwebtoken');
const cors = require('cors');
const morgan = require('morgan')
const app = express();
const port = 3002;
const bodyParser = require('body-parser')
const SECRET_KEY: any = '12345';
const saltRounds = 14;
app.use(cors())
MongoDBConnection();
app.use(
    morgan('combined')
)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Kussoriz API Ver.1.0')
})
app.post('/signin', async (req: Request, res: Response) => {
    const { username, password } = req.body
    console.log(username,password)
    try {
        const Query = await Users.findOne({ username: username });
        const hashpassword: string = Query!.password;
        const result = bcrypt.compare(password, hashpassword).then(function (result: any) {
            // console.log(result)
            console.log(Query)
            if (result) {
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: Query!.username
                  }, SECRET_KEY);
                res.send({ msg: token }).status(200)
            }
            else {
                res.send({ msg: '0' }).status(404)
            }
        });
    } catch (error) {
        res.send('error to sign').status(500)
    }
})
app.post('/signup', async (req: Request, res: Response) => {
    const { username, email, password, prefix, firstname, lastname, birthday } = req.body
    const birthday2 = new Date(birthday).toDateString();
    const nowDate = new Date().toDateString();
    bcrypt.hash(password, saltRounds, async (err, hashPassword) => {
        const PrepareData = new Users({
            username: username,
            email: email,
            password: hashPassword,
            prefix: prefix,
            firstname: firstname,
            lastname: lastname,
            birthday: birthday2,
            createdate: nowDate
        })
        try {
            await PrepareData.save();
            res.send({ msg: 'SignUp Success.' }).status(200)
        } catch (error) {
            res.send({ msg: 'can not add data.' }).status(500)
        }
    })
    // await mongoose.disconnect();
})
app.post('/checktoken/', async (req: Request, res: Response) => {
    const token = req.body;
    const dataToken = JSON.parse(token.token);
    console.log(dataToken)
    try {
        const decoded = jwt.verify(dataToken, SECRET_KEY);
        console.log(decoded)
        res.send({msg:decoded.data}).status(200)
    } catch (error) {
        // console.log(error)
        res.send({msg:0}).status(404)
    }
})
app.put('/updateprofile', async (req: Request, res: Response) => {
    const { username, email, password, prefix, firstname, lastname, birthday } = req.body
    const findDataFromDatabase = await Users.findOne({ username: username }).select('username email prefix firstname lastname birthday')
    //console.log(findDataFromDatabase);
    const birthday2 = new Date(birthday).toDateString();
    const nowDate = new Date().toDateString();
    bcrypt.hash(password, saltRounds, async function (err, hashPassword) {
        try {
            if (username !== null) {
                const updateprofile = await Users.findOneAndUpdate({ username: username }, { $set: { email: email, password: hashPassword, prefix: prefix, firstname: firstname, lastname: lastname, birthday: birthday } }, { new: true })
                    .then(updatedDocument => {
                        console.log(updatedDocument);
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
            else {
                res.send({ msg: 'can not update' })
            }
        } catch (error) {
            res.send({ msg: 'error update profile' })
        }
    });
    res.send({ msg: findDataFromDatabase })
})

app.post('/getprofile', async (req: Request, res: Response) => {
    const token = req.body;
    const dataToken = JSON.parse(token.token);
    // console.log(dataToken)
    try {
        const decoded = jwt.verify(dataToken, SECRET_KEY);
        // console.log(decoded)
        const username = decoded.data
        console.log("getprofile username : "+username)
        const findDataFromDatabase = await Users.findOne({ username: username }).select('username email prefix firstname lastname birthday')
        res.send({msg:findDataFromDatabase}).status(200)
    } catch (error) {
        // console.log(error)
        res.send({msg:0}).status(404)
    }
});
app.put('/updateprofile_v2_mobileapponly', async (req: Request, res: Response) => {
    const {token,email,prefix,firstname,lastname,birthday,password} = req.body;
    const dataToken = JSON.parse(token.token);
    console.log(dataToken)
    try {
        const decoded = jwt.verify(dataToken, SECRET_KEY);
        // console.log(decoded)
        // res.send({msg:decoded.data}).status(200)
        const username = decoded.data
        const findDataFromDatabase = await Users.findOne({ username: username }).select('username email prefix firstname lastname birthday')
        // const birthday2 = new Date(birthday).toDateString();
        // const nowDate = new Date().toDateString();
        bcrypt.hash(password, saltRounds, async function (err, hashPassword) {
            try {
                if (username !== null) {
                    const updateprofile = await Users.findOneAndUpdate({ username: username }, { $set: { email: email, password: hashPassword, prefix: prefix, firstname: firstname, lastname: lastname, birthday: birthday } }, { new: true })
                        .then(updatedDocument => {
                            console.log(updatedDocument);
                        })
                        .catch(err => {
                            console.error(err);
                        });
                }
                else {
                    res.send({ msg: 'can not update' })
                }
            } catch (error) {
                res.send({ msg: 'error update profile' })
            }
        });
        res.send({ msg: findDataFromDatabase })
    } catch (error) {
        // console.log(error)
        res.send({msg:0}).status(404)
    }
  
})
app.listen(port, () => {
    console.log(`API Express Optimize Version 1.0 listening on port ${port}`)
})