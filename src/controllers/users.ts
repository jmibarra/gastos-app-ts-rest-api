import express from 'express';

import { deleteUserById, getUsers, getUserById } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    return res.json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { email, username,fullName, avatarUrl } = req.body;

    if (!username || !fullName) {
      return res.sendStatus(400);
    }

    const user = await getUserById(id);
    
    if(user){
        user.username = username;
        user.fullName = fullName;
        user.email = email ? email : user.email 
        user.avatarUrl = avatarUrl ? avatarUrl : user.avatarUrl
        await user.save();
    }else
        return res.sendStatus(404);
    
    return res.status(200).json(user).end();

  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}