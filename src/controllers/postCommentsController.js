import express from 'express';

import postCommentsService from '../services/postCommentsService.js';

const postCommentsController = express.Router();

postCommentsController.post('/:postId/comments', async (req, res, next) => {
    const { postId } = req.params;
    const comment = req.body;

    if (!postId || Object.keys(comment).length === 0) {
        const error = new Error('잘못된 요청입니다.');
        error.status = 400;
        return next(error);
    }

    try {
        const createdComment = await postCommentsService.createComment(postId, comment);
        return res.status(200).json(createdComment);
    } catch (error) {
        next(error);
    }  
});

postCommentsController.get('/:postId/comments', async (req, res, next) => {
    const { postId } = req.params;
    const { page, pageSize } = req.query;

    try {
        const commentList = await postCommentsService.searchCommets({ postId, page, pageSize});
        res.status(200).json(commentList);
    } catch (error) {
        next(error);
    }
})

export default postCommentsController;