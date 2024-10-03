import express from 'express';

import commentActionsService from "../services/commentActionsService.js";

const commentActionsController = express.Router();

commentActionsController.put('/:commentId', async (req, res, next) => {
    const { commentId } = req.params;
    const updateData = req.body;

    if (!commentId || Object.keys(updateData).length === 0) {
        const error = new Error('잘못된 요청입니다.');
        error.status = 400;
        return next(error);
    }

    try {
        const updateInfo = { updateData };
        const updateResult = await commentActionsService.update(commentId, updateInfo);
        return res.status(200).json(updateResult);
    } catch (error) {
        return next(error);
    }
});

commentActionsController.delete('/:commentId', async (req, res, next) => {
    const { commentId } = req.params;
    const { password } = req.body;

    if (!commentId || !password) {
        const error = new Error('잘못된 요청입니다.');
        error.status = 400;
        return next(error);
    }

    try {
        const deleteResult = await commentActionsService.deleteById(commentId, password);
        return res.status(200).json(deleteResult);
    } catch (error) {
        return next(error);
    }
});

export default commentActionsController