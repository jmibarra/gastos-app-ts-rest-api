import { createInvestment, deleteInvestmentById, getInvestments, getInvestmentsCount, InvestmentModel } from '../db';
import express from 'express';
import { get } from 'lodash';

/**
 * Create a new investment for the current user.
 *
 * @param req - request object
 * @param res - response object
 * @returns - a 200 response with the created investment if successful, otherwise a 400 response with an error message
 */
export const createNewInvestment = async (req: express.Request, res: express.Response) => {
    try{
        const { name,averagePurchasePrice, quantity, type } = req.body
        
        if (!name || !type)
            return res.sendStatus(400);

        const owner = get(req, 'identity._id') as unknown as string;

        const investment = await createInvestment({
            name,
            averagePurchasePrice,
            quantity,
            type,
            owner
        });
        return res.status(200).json(investment).end();

    }catch(error){
        console.log(error);
        return res.sendStatus(400)
    }
}

/**
 * Get all investments for the current user.
 *
 * @param req - request object
 * @param res - response object
 * @returns - a 200 response with the list of investments and the total count if successful, otherwise a 400 response with an error message
 */
export const getAllInvestments = async (req: express.Request, res: express.Response) => {
    try {
        const owner = get(req, 'identity._id') as unknown as string;

        const limit = parseInt(req.query.limit as string) ?? 10;
        const page = parseInt(req.query.page as string) ?? 1;

        const totalCount = await getInvestmentsCount(owner); // Obtener el recuento total de documentos
        const investments = await getInvestments(owner, limit, page);

        const responseData = {
            investments: investments,
            count: totalCount
        }

        return res.status(200).json(responseData);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

/**
 * Get an investment by its ID.
 *
 * @param req - request object
 * @param res - response object
 * @returns - a 200 response with the investment if successful, otherwise a 400 response with an error message
 */
export const getInvestment = async (req: express.Request, res: express.Response) => {
    try {
        //No necesito volver a traerlo por que ya la obtuve en el middleware "isStatusOwner"
        const saving = req.body.saving
        return res.status(200).json(saving).end();
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
}

/**
 * Delete an investment by its ID.
 *
 * @param req - request object
 * @param res - response object
 * @returns - a 200 response with the deleted investment if successful, otherwise a 400 response with an error message
 */
export const deleteInvestment = async (req: express.Request, res: express.Response) => {
    try {
        
        const { id } = req.params;
        const deletedInvestment = await deleteInvestmentById(id);
  
        return res.json(deletedInvestment);
    
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

/**
 * Update an investment by its ID.
 *
 * @param req - request object
 * @param res - response object
 * @returns - a 200 response with the updated investment if successful, otherwise a 400 response with an error message
 */
export const updateInvestment = async (req: express.Request, res: express.Response) => {
    try {
        const { name,averagePurchasePrice, quantity, type } = req.body

        if (!name || !type)
            return res.sendStatus(400);

        const investment = req.body.investment

        if(investment){
            investment.name = name ? name : investment.name;
            investment.averagePurchasePrice = averagePurchasePrice ? averagePurchasePrice : investment.averagePurchasePrice;
            investment.quantity = quantity ? quantity : investment.quantity;
            investment.type = type ? type : investment.type;
            await investment.save().then((saving: any) => {
                return InvestmentModel.populate(saving, { path: 'owner' });
            }).then((populateSaving: any) => populateSaving.toObject());
        }else
        return res.sendStatus(404);

        return res.status(200).json(investment).end();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}