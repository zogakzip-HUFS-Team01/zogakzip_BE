import express from 'express';

import postActionsService from "../services/postActionsService.js";

const postActionsController = express.Router();


postActionsController.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const postDetails = await postActionsService.getById(id);
        return res.status(200).json(postDetails);
    } catch (error) {
        return next(error);
    }
});

postActionsController.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const updateData = req.body;

    console.log(id)
    console.log(updateData)

    if (!id || Object.keys(updateData).length === 0) {
        const error = new Error('잘못된 요청입니다.');
        error.status = 400;
        return next(error);
    }

    try {
        const updateInfo = { updateData };
        const updateResult = await postActionsService.update(id, updateInfo);
        return res.status(200).json(updateResult);
    } catch (error) {
        return next(error);
    }
});

postActionsController.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { postPassword } = req.body;

    if (!id || !postPassword) {
        const error = new Error('잘못된 요청입니다.');
        error.status = 400;
        return next(error);
    }

    try {
        const deleteResult = await postActionsService.deleteById(id, postPassword);
        return res.status(200).json(deleteResult);
    } catch (error) {
        return next(error);
    }
});

postActionsController.post('/:id/verify-password', async (req, res, next) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
        const passwordVerifyResult = await postActionsService.verifyPassword(id, password);
        return res.status(200).json(passwordVerifyResult);
    } catch (error) {
        return next(error);
    }
});

postActionsController.post('/:id/like', async (req, res, next) => {
    const { id } = req.params;

    try {
        const likedActionResult = await postActionsService.giveLike(id);
        return res.status(200).json(likedActionResult);
    } catch (error) {
        return next(error);
    }
});

postActionsController.get('/:id/is-public', async (req, res, next) => {
    const { id } = req.params;
    
    const publicState = await postActionsService.checkPublicState(id);
    return res.status(200).json(publicState);
});

export default postActionsController;