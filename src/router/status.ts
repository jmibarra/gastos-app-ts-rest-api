import express from "express";
import { isAuthenticated, isStatusOwner } from "../middlewares";
import { createNewStatus, deleteStatus, getAllStatusByOwner, getStatus, updateStatus } from "../controllers/status";

export default (router: express.Router) => {
    /**
     * @swagger
     * components:
     *   schemas:
     *     Status:
     *       type: object
     *       properties:
     *         name:
     *           type: string
     *           description: Nombre del estado
     *         color:
     *           type: string
     *           description: Color asociado al estado
     *         owner:
     *           type: string
     *           description: Propietario del estado (ID de usuario)
     *       required:
     *         - name
     *         - owner
     */

    /**
     * @swagger
     * /status:
     *   post:
     *     summary: Crear un nuevo estado
     *     tags: [Status]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Status'
     *     responses:
     *       200:
     *         description: Estado creado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Status'
     *       400:
     *         description: Datos inválidos
     */
    router.post('/status', isAuthenticated, createNewStatus);

    /**
     * @swagger
     * /status:
     *   get:
     *     summary: Obtener todos los estados del propietario
     *     tags: [Status]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *         description: Límite de resultados por página
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: Página de resultados
     *     responses:
     *       200:
     *         description: Lista de estados del propietario
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 statuses:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Status'
     *                 count:
     *                   type: integer
     *                   description: Total de estados
     *       400:
     *         description: Error al obtener los estados
     */
    router.get('/status', isAuthenticated, getAllStatusByOwner);

    /**
     * @swagger
     * /status/{id}:
     *   get:
     *     summary: Obtener un estado por ID
     *     tags: [Status]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID del estado
     *     responses:
     *       200:
     *         description: Estado encontrado
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Status'
     *       403:
     *         description: Acceso denegado
     *       400:
     *         description: Error al obtener el estado
     */
    router.get('/status/:id', isAuthenticated, isStatusOwner, getStatus);

    /**
     * @swagger
     * /status/{id}:
     *   delete:
     *     summary: Eliminar un estado por ID
     *     tags: [Status]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID del estado
     *     responses:
     *       200:
     *         description: Estado eliminado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Status'
     *       400:
     *         description: Error al eliminar el estado
     */
    router.delete('/status/:id', isAuthenticated, isStatusOwner, deleteStatus);

    /**
     * @swagger
     * /status/{id}:
     *   patch:
     *     summary: Actualizar un estado por ID
     *     tags: [Status]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID del estado
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Status'
     *     responses:
     *       200:
     *         description: Estado actualizado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Status'
     *       400:
     *         description: Datos inválidos
     */
    router.patch('/status/:id', isAuthenticated, isStatusOwner, updateStatus);
}
