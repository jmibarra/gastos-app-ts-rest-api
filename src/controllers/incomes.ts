import { IncomeModel, createIncome, deleteIncomeById, getIncomesByPeriod, getIncomesCountByPeriod } from '../db/income';
import express from 'express';
import { get } from 'lodash';


export const createNewIncome = async (req: express.Request, res: express.Response) => {
    try{
        const { title, date, status, period, amount, type } = req.body;

        const owner = get(req, 'identity._id') as unknown as string;

        if (!title || !status || !amount)
            return res.sendStatus(400);

        const income = await createIncome({
            title,
            date,
            status,
            period,
            amount,
            type,
            owner
        });

        return res.status(200).json(income).end()
    }catch(error){
        console.log(error);
        return res.sendStatus(400)
    }
}

export const getAllPeriodIncomes = async (req: express.Request, res: express.Response) => {
    try {

        const owner = get(req, 'identity._id') as unknown as string;

        const { period } = req.params;

        const limit = parseInt(req.query.limit as string) ?? 10;
        const page = parseInt(req.query.page as string) ?? 1;

        const totalCount = await getIncomesCountByPeriod(owner,period); // Obtener el recuento total de documentos
        const incomes = await getIncomesByPeriod(owner,period, limit, page);

        const responseData = {
            incomes: incomes,
            count: totalCount
        }
        
        console.log(responseData)
        return res.status(200).json(responseData);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getIncome = async (req: express.Request, res: express.Response) => {
    try {

        //No necesito volver a traerlo por que ya la obtuve en el middleware "isStatusOwner"
        const income = req.body.income
        return res.status(200).json(income).end();
  
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
}

export const deleteIncome = async (req: express.Request, res: express.Response) => {
    try {
        
        const { id } = req.params;
        const deletedIncome = await deleteIncomeById(id);
  
        return res.json(deletedIncome);
    
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateIncome = async (req: express.Request, res: express.Response) => {
    try {
        const { title, date, status, period, amount, type } = req.body;
  
        if (!title || !period || !status || !amount)
            return res.sendStatus(400);
  
        const income = req.body.income

        if(income){
            income.title = title ? title : income.title;
            income.dueDate = date ? date : income.dueDate;
            income.status = status ? status : income.status;
            income.period = period ? period : income.period;
            income.amount = amount ? amount : income.amount;
            income.type = type ? type : income.type;
            await income.save().then((income: any) => {
                return IncomeModel.populate(income, { path: 'status' });
            }).then((populatedIncome: any) => populatedIncome.toObject());
        }else
            return res.sendStatus(404);
      
        return res.status(200).json(income).end();
  
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
