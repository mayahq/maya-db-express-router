import mongoose from 'mongoose'
import { mongoDbAdapter, MongoLock } from "@mayahq/maya-db";
import { DbRequest } from "../types";

const db = mongoDbAdapter({ root: '/' })

async function readFromBlock(request: DbRequest) {
    const result = await db.io.readFromBlock(request.path)
    return { result }
}

async function writeToBlock(request: DbRequest) {
    const result = await db.io.writeToBlock(request.path, request.data.payload)
    return { result }
}

async function createBlock(request: DbRequest) {
    const block = await db.io.createBlock(request.path, request.data.opts)
    return {
        absPath: block.absPath
    }
}

async function deleteBlock(request: DbRequest) {
    await db.io.deleteBlock(request.path)
    return {}
}

async function getAllBlocks(request: DbRequest) {
    const blocks = await db.io.getAllBlocks(request.path)
    return blocks.map(b => {
        return {
            absPath: b.absPath
        }
    })
}

async function createCollection(request: DbRequest) {
    const collection = await db.io.createCollection(request.path)
    return {
        absPath: collection.absPath
    }
}

async function getAllCollections(request: DbRequest) {
    const collections = await db.io.getAllCollections(request.path)
    return collections.map(c => {
        return {
            absPath: c.absPath
        }
    })
} 

async function deleteCollection(request: DbRequest) {
    await db.io.deleteCollection(request.path)
    return {}
}

async function includesCollection(request: DbRequest) {
    const result = await db.io.includesCollection(request.path)
    return { result }
}

async function includesBlock(request: DbRequest) {
    const result = await db.io.includesBlock(request.path)
    return { result }
}

async function acquireLockOnBlock(request: DbRequest) {
    const lock = new MongoLock()
    return await new Promise((resolve, reject) => {
        lock.acquire(request.path, async (e: Error, release: Function, lockDocument: any, lockId: string) => {
            if (e) {
                return reject(e)
            }

            return resolve({
                lockDocument: lockDocument,
                lockId: lockId
            })
        })
    })
}

async function releaseLockOnBlock(request: DbRequest) {
    const blockPath = request.path
    const lockId = request.data.lockId
    const lock = new MongoLock()

    await lock.release(blockPath, lockId)
    return {
        status: 'SUCCESS'
    }
}

async function ensureHierarchy(request: DbRequest) {
    try {
        await db.io.ensureHierarchy(request.data.tree, request.path)
        return {
            status: 'SUCCESS'
        }
    } catch (e) {
        return {
            status: 'ERROR'
        }
    }
}

async function lockAndGet(request: DbRequest) {
    const block = db.block(request.path)
    const result = await block.lockAndGet(request.data.query)
    return { result }
}

async function lockAndSet(request: DbRequest) {
    const block = db.block(request.path)
    const { query, opts } = request.data
    const result = await block.lockAndSet(query, opts)
    return { result }
}

async function lockAndUpdate(request: DbRequest) {
    const block = db.block(request.path)
    const result = await block.lockAndUpdate(request.data.query)
    return { result }
}

async function ioClient(request: DbRequest) {
    switch (request.operation) {
        case 'readFromBlock': return await readFromBlock(request)
        case 'writeToBlock': return await writeToBlock(request)
        case 'createBlock': return await createBlock(request)
        case 'deleteBlock': return await deleteBlock(request)
        case 'getAllBlocks': return await getAllBlocks(request)
        case 'createCollection': return await createCollection(request)
        case 'getAllCollections': return await getAllCollections(request)
        case 'deleteCollection': return await deleteCollection(request)
        case 'includesCollection': return await includesCollection(request)
        case 'includesBlock': return await includesBlock(request)
        case 'acquireLockOnBlock': return await acquireLockOnBlock(request)
        case 'releaseLock': return await releaseLockOnBlock(request)
        case 'ensureHierarchy': return await ensureHierarchy(request)
        case 'lockAndGet': return await lockAndGet(request)
        case 'lockAndSet': return await lockAndSet(request)
        case 'lockAndUpdate': return await lockAndUpdate(request)
        default: throw new Error(`Invalid operation: ${request.operation}`)
    }
}

export default ioClient