import { Router } from "express";

import { deleteUser, getAllUsers, updateUser } from "../controllers/users";
import { isAuthenticated, isOwner } from "../middlewares";

export default (router: Router) => {
    /**
     * @swagger
     * components:
     *   schemas:
     *     User:
     *       type: object
     *       properties:
     *         id:
     *           type: string
     *           description: ID único del usuario
     *           example: 64f24ebd8e35452af9e423a4
     *         username:
     *           type: string
     *           description: Nombre de usuario
     *           example: johndoe
     *         email:
     *           type: string
     *           description: Correo electrónico del usuario
     *           example: johndoe@example.com
     *         fullName:
     *           type: string
     *           description: Nombre completo del usuario
     *           example: John Doe
     *         avatarUrl:
     *           type: string
     *           description: URL del avatar del usuario
     *           example: https://example.com/avatar.jpg
     *   responses:
     *     NotFound:
     *       description: Recurso no encontrado
     *     BadRequest:
     *       description: Solicitud inválida
     */

    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Obtener todos los usuarios
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de usuarios
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/User'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     */
    router.get('/users', isAuthenticated, getAllUsers);

    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     summary: Eliminar un usuario por ID
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID del usuario a eliminar
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Usuario eliminado con éxito
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     */
    router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);

    /**
     * @swagger
     * /users/{id}:
     *   patch:
     *     summary: Actualizar un usuario por ID
     *     tags:
     *       - Users
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID del usuario a actualizar
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *                 description: Nombre de usuario
     *                 example: johndoe
     *               fullName:
     *                 type: string
     *                 description: Nombre completo
     *                 example: John Doe
     *               email:
     *                 type: string
     *                 description: Correo electrónico
     *                 example: johndoe@example.com
     *               avatarUrl:
     *                 type: string
     *                 description: URL del avatar
     *                 example: https://example.com/avatar.jpg
     *     responses:
     *       200:
     *         description: Usuario actualizado con éxito
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       404:
     *         $ref: '#/components/responses/NotFound'
     *       400:
     *         $ref: '#/components/responses/BadRequest'
     */
    router.patch('/users/:id', isAuthenticated, isOwner, updateUser);

};
