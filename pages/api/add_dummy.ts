import clientPromise from "../../lib/mongodb";

import type { NextApiRequest, NextApiResponse } from 'next';
import { DBName, TransferFromCollection, dummyData } from "../../lib/constants";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const client = await clientPromise;
    const session = client.startSession();
    //add dummy data
    
    try {
        await session.withTransaction(async () => {
            const db = client.db(DBName)
            const transferFromCollection = db.collection(TransferFromCollection)
            await transferFromCollection.insertMany(dummyData, { session })
        })
        res.status(200).json({
            "success": true
        })

    } catch (e) {
        console.error(e)
        res.status(503).json(e)
    } finally {
        session.endSession();
    }
}