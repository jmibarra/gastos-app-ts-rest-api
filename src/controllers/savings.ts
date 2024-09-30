import { createSaving, deleteSavingById, getSavings, getSavingsByPeriod, getSavingsCount, getSavingsCountByPeriod, SavingModel } from '../db/savings';
import express from 'express';
import { get } from 'lodash';

export const createNewSaving = async (req: express.Request, res: express.Response) => {
    try{
        const { period, description, amount, date, type } = req.body;

        const owner = get(req, 'identity._id') as unknown as string;

        if (!period || !type || !amount)
            return res.sendStatus(400);

        const income = await createSaving({
            period,
            description,
            amount,
            date,
            type,
            owner
        });

        return res.status(200).json(income).end()
    }catch(error){
        console.log(error);
        return res.sendStatus(400)
    }
}

export const getAllPeriodSavings = async (req: express.Request, res: express.Response) => {
    try {

        const owner = get(req, 'identity._id') as unknown as string;

        const { period } = req.params;

        const limit = parseInt(req.query.limit as string) ?? 10;
        const page = parseInt(req.query.page as string) ?? 1;

        const totalCount = await getSavingsCountByPeriod(owner,period); // Obtener el recuento total de documentos
        const savings = await getSavingsByPeriod(owner,period, limit, page);

        const responseData = {
            savings: savings,
            count: totalCount
        }
        
        console.log(responseData)
        return res.status(200).json(responseData);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getAllSavings = async (req: express.Request, res: express.Response) => {
    try {

        const owner = get(req, 'identity._id') as unknown as string;

        const limit = parseInt(req.query.limit as string) ?? 10;
        const page = parseInt(req.query.page as string) ?? 1;

        const totalCount = await getSavingsCount(owner); // Obtener el recuento total de documentos
        const savings = await getSavings(owner, limit, page);

        const responseData = {
            savings: savings,
            count: totalCount
        }
        
        console.log(responseData)
        return res.status(200).json(responseData);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getSaving = async (req: express.Request, res: express.Response) => {
    try {

        //No necesito volver a traerlo por que ya la obtuve en el middleware "isStatusOwner"
        const saving = req.body.saving
        return res.status(200).json(saving).end();
  
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
}

export const deleteSaving = async (req: express.Request, res: express.Response) => {
    try {
        
        const { id } = req.params;
        const deletedIncome = await deleteSavingById(id);
  
        return res.json(deletedIncome);
    
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateSaving = async (req: express.Request, res: express.Response) => {
    try {
        const { period, description, amount, date, type } = req.body;
  
        if (!period || !type || !amount)
            return res.sendStatus(400);
  
        const saving = req.body.income

        if(saving){
            saving.description = description ? description : saving.description;
            saving.date = date ? date : saving.date;
            saving.period = period ? period : saving.period;
            saving.amount = amount ? amount : saving.amount;
            saving.type = type ? type : saving.type;
            await saving.save().then((saving: any) => {
                return SavingModel.populate(saving, { path: 'status' });
            }).then((populatedIncome: any) => populatedIncome.toObject());
        }else
            return res.sendStatus(404);
      
        return res.status(200).json(saving).end();
  
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}