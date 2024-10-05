import express from 'express';

import groupPostsService from "../services/groupPostsService.js";

const groupPostsController = express.Router();

groupPostsController.get('/:groupId/posts', async (req, res, next) => {
    const { groupId } = req.params;
    const { page, pageSize, sortBy, keyword, isPublic } = req.query;

    if (!groupId) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    try {
        const postList = await groupPostsService.searchPosts({page, pageSize, sortBy, keyword, isPublic, groupId});
        res.status(200).json(postList);
    } catch (error) {
        next(error);
    }
});

groupPostsController.post('/:groupId/posts', async (req, res, next) => {
    const { groupId } = req.params;
    const post = req.body;

    if (!groupId || !post) {
        const error = new Error('잘못된 요청입니다.');
        error.status = 400;
        return next(error);
    }
    
    try {
        const resultPost = await groupPostsService.createPost(groupId, post);
        return res.status(200).json(resultPost);
    } catch (error) {
        next(error);
    }
});

export default groupPostsController;