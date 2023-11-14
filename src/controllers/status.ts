import { createStatus } from '../db/status';
import express from 'express';
import { get } from 'lodash';

export const createNewStatus = async (req: express.Request, res: express.Response) => {
    try{
        const { name, color } = req.body;

        const owner = get(req, 'identity._id') as unknown as string;

        if (!name || !color)
            return res.sendStatus(400);
      
        const status = await createStatus({
            name,
            color,
            owner
        });

        return res.status(200).json(status).end()

    }catch(error){
        console.log(error);
        return res.sendStatus(400)
    }
}