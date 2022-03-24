import express from 'express'
import { dbRequestRouter } from './router'
import mongoose from 'mongoose'

const app = express()

// SETUP LOGGING MIDDLEWARE
const loggerMiddleware = (req: any, res: any, next: Function) => {
    console.log(req.method + ' ' + req.path);
    next();
}

const port = 9000
mongoose.connect('mongodb://localhost:27017/mayatest', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

app.use(express.json())
app.use(loggerMiddleware)
app.use(dbRequestRouter)

// async function startServer() {
//     const a = await mongoose.connect('')


// }
app.listen(port, () => {
    console.log(`Server is up on :${port}`)
})