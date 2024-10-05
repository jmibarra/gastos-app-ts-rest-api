import express, { Router } from "express";
import { isAuthenticated, isSavingOwner } from "../middlewares";
import { createNewSaving, deleteSaving, getAllPeriodSavings, getAllSavings, getSaving, updateSaving } from "../controllers/savings";


export default (router: express.Router) => {
    router.post('/savings', isAuthenticated, createNewSaving);
    router.get('/savings/period/:period', isAuthenticated, getAllPeriodSavings);
    router.get('/savings/all', isAuthenticated, getAllSavings);
    router.get('/savings/:id', isAuthenticated,isSavingOwner, getSaving);
    router.delete('/savings/:id', isAuthenticated, isSavingOwner, deleteSaving);
    router.patch('/savings/:id', isAuthenticated, isSavingOwner, updateSaving);
}