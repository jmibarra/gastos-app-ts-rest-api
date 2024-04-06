import { createCategory, deleteCategoryById, getCategoriesByOwner, getCategoriesCountByOwner } from '../db/category';
import express from 'express';
import { get } from 'lodash';

export const createNewCategory = async (req: express.Request, res: express.Response) => {
    try{
        const { name, color, icon } = req.body;

        const owner = get(req, 'identity._id') as unknown as string;

        if (!name)
            return res.sendStatus(400);
      
        const status = await createCategory({
            name,
            color,
            icon,
            owner
        });

        return res.status(200).json(status).end()

    }catch(error){
        console.log(error);
        return res.sendStatus(400)
    }
}

export const getAllCategoriesByOwner = async (req: express.Request, res: express.Response) => {
    try {

        const owner = get(req, 'identity._id') as unknown as string;

        const limit = parseInt(req.query.limit as string) ?? 10;
        const page = parseInt(req.query.page as string) ?? 1;

        const totalCount = await getCategoriesCountByOwner(owner); // Obtener el recuento total de documentos
        const categories = await getCategoriesByOwner(owner, limit, page);

        const responseData = {
            categories: categories,
            count: totalCount
        }
        
        return res.status(200).json(responseData);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getCategory = async (req: express.Request, res: express.Response) => {
    try {

        //No necesito volver a traerlo por que ya la obtuve en el middleware "isStatusOwner"
        const category = req.body.category
        return res.status(200).json(category).end();
  
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
}

export const deleteCategory = async (req: express.Request, res: express.Response) => {
    try {
        
        const { id } = req.params;
        const deletedStatus = await deleteCategoryById(id);
  
        return res.json(deletedStatus);
    
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const updateCategory = async (req: express.Request, res: express.Response) => {
    try {
        const { name, color, icon } = req.body;
        const { id } = req.params;
  
        if (!name || !color)
            return res.sendStatus(400);
  
        const category = req.body.category

        if(category){
            category.name = name ? name : category.name;
            category.color = color ? color : category.color;
            category.icon = icon ? icon : category.icon;
            await category.save();
        }else
            return res.sendStatus(404);
      
        return res.status(200).json(category).end();
  
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

