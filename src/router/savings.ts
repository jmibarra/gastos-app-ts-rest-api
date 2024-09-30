import express, { Router } from "express";
import { isAuthenticated,isIncomeOwner } from "../middlewares";
import { createNewSaving, deleteSaving, getAllPeriodSavings, getAllSavings, getSaving, updateSaving } from "../controllers/savings";


export default (router: express.Router) => {
    router.post('/savings', isAuthenticated, createNewSaving);
    router.get('/savings/:period', isAuthenticated, getAllSavings);
    router.get('/savings/all/', isAuthenticated, getAllPeriodSavings);
    router.get('/savings/:id', isAuthenticated,isIncomeOwner, getSaving);
    router.delete('/savings/:id', isAuthenticated, isIncomeOwner, deleteSaving);
    router.patch('/savings/:id', isAuthenticated, isIncomeOwner, updateSaving);
}