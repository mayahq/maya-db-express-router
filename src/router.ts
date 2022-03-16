import express from 'express'
import { mongoDbAdapter } from '@mayahq/maya-db'
import { DbRequest } from './types'
import ioClient from './functions/ioClient'

const db = mongoDbAdapter({
    root: '/'
})

const dbRequestRouter = express.Router()

dbRequestRouter.post('/db-operation', async (req, res) => {
    
    const reqBody: DbRequest = req.body
    try {
        const result = await ioClient(reqBody)
        return res.send(result)
    } catch (e) {
        console.log(e)
        return res.status(500).send({
            status: 'ERROR',
            error: e
        })
    }
})

export default dbRequestRouter