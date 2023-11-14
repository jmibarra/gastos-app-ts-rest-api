import { createStatus, deleteStatusById, getStatusByOwner, getStatusCountByOwner } from '../db/status';
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

export const getAllStatusByOwner = async (req: express.Request, res: express.Response) => {
    try {

        const owner = get(req, 'identity._id') as unknown as string;

        const limit = parseInt(req.query.limit as string) ?? 10;
        const page = parseInt(req.query.page as string) ?? 1;

        const totalCount = await getStatusCountByOwner(owner); // Obtener el recuento total de documentos
        const statuses = await getStatusByOwner(owner, limit, page);

        const responseData = {
            statuses: statuses,
            count: totalCount
        }
        
        return res.status(200).json(responseData);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getStatus = async (req: express.Request, res: express.Response) => {
    try {

        //No necesito volver a traerlo por que ya la obtuve en el middleware "isStatusOwner"
        const status = req.body.status
        return res.status(200).json(status).end();
  
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
}

export const deleteStatus = async (req: express.Request, res: express.Response) => {
    try {
        
        const { id } = req.params;
        const deletedStatus = await deleteStatusById(id);
  
        return res.json(deletedStatus);
    
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateStatus = async (req: express.Request, res: express.Response) => {
    try {
        const { name, color } = req.body;
        const { id } = req.params;
  
        if (!name || !color)
            return res.sendStatus(400);
  
        const status = req.body.status

        if(status){
            status.name = name ? name : status.name;
            status.color = color ? color : status.color;
            await status.save();
        }else
            return res.sendStatus(404);
      
        return res.status(200).json(status).end();
  
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

