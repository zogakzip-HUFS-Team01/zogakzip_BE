import express from 'express';

import groupService from "../services/groupService.js";

const groupController = express.Router();

groupController.get('/', async (req, res, next) => {
    const { page, pageSize, sortBy, keyword, isPublic } = req.query;

    try {
        const groupList = await groupService.searchGroups({page, pageSize, sortBy, keyword, isPublic});
        res.status(200).json(groupList);
    } catch (error) {
        next(error);
    }
});

groupController.post('/', async (req, res, next) => {

    try {
        const group = await groupService.createGroup(req.body);
        return res.status(201).json(group);
    } catch (error) {
        next(error);
    }
});

groupController.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        const getDetails = await groupService.getById(id);
        return res.status(200).json(getDetails);
    } catch (error) {
        return next(error);
    }
});

groupController.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { name, password, imageUrl, isPublic, introduction } = req.body;

    if (!id && !name && !password) {
        const error = new Error('잘못된 요청입니다.');
        error.status = 400;
        return next(error);
    }

    try {
        const updateInfo = { name, password, imageUrl, isPublic, introduction };
        const updatedResult = await groupService.update(id, updateInfo);
        return res.status(200).json(updatedResult);
    } catch (error) {
        return next(error);
    }
})

groupController.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { password } = req.body;

    if (!id && !password) {
        const error = new Error('잘못된 요청입니다');
        error.status = 400;
        return next(error);
    }

    try {
        const deleteGroup = await groupService.deleteById(id, password);
        return res.status(200).json(deleteGroup);
    } catch (error) {
        return next(error);
    }
});

groupController.post('/:id/verify-password', async (req, res, next) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
        const passwordVerifyResult = await groupService.verifyPassword(id, password);
        return res.status(200).json(passwordVerifyResult);
    } catch (error) {
        return next(error);
    }
});

groupController.post('/:id/like', async(req, res, next) => {
    const { id } = req.params;

    try {
        const likedActionResult = await groupService.giveLike(id);
        return res.status(200).json(likedActionResult);
    } catch (error) {
        return next(error);
    }
});

groupController.get('/:id/is-public', async (req, res, next) => {
    const { id } = req.params;
    
    const publicState = await groupService.checkPublicState(id);
    return res.status(200).json(publicState);
});

export default groupController;