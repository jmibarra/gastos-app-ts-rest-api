import express, { Router } from "express";
import { isAuthenticated,isIncomeOwner } from "../middlewares";
import { createNewIncome, deleteIncome, getAllPeriodIncomes, getIncome, updateIncome } from "../controllers/incomes";


export default (router: express.Router) => {
    router.post('/incomes', isAuthenticated, createNewIncome);
    router.get('/incomes/all/:period', isAuthenticated, getAllPeriodIncomes);
    router.get('/incomes/:id', isAuthenticated,isIncomeOwner, getIncome);
    router.delete('/incomes/:id', isAuthenticated, isIncomeOwner, deleteIncome);
    router.patch('/incomes/:id', isAuthenticated, isIncomeOwner, updateIncome);
}