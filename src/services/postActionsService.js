import postActionsRepository from '../repositories/postActionsRepository.js';

function filterPassword(target) {
    const { postPassword, groupPassword, ...rest } = target;
    return rest;
}

async function getById(id) {
    const existedPost = await postActionsRepository.getById(id);

    if (!existedPost) {
        const error = new Error('잘못된 요청입니다.');
        error.status = 400;
        throw error;
    }

    return filterPassword(existedGroup);
}

async function deleteById(id, postPassword) {
    const existedPost = await postActionsRepository.getById(id);

    if(!existedPost) {
        const error = new Error('존재하지 않습니다.');
        error.status = 404;
        throw error;
    }

    if (existedPost.postPassword !== postPassword) {
        const error = new Error('비밀번호가 틀렸습니다');
        error.status = 403;
        throw error;
    }

    await postActionsRepository.deleteById(id);
    return { message: '게시글 삭제 성공' };
}

async function update(id, updateInfo) {
    const existedPost = await postActionsRepository.getById(id);

    if (!existedPost) {
        const error = new Error('존재하지 않습니다.');
        error.status = 404;
        throw error;
    }

    if (existedPost.postPassword !== updateInfo.updateData.postPassword) {

        const error = new Error('비밀번호가 틀렸습니다');
        error.status = 403;
        throw error;
    }

    const updatedResult = await postActionsRepository.update(id, updateInfo);
    return filterPassword(updatedResult);
}

async function verifyPassword(id, password) {
    const targetPost = await postActionsRepository.getById(id);

    if (password !== targetPost.postPassword) {
        const error = new Error('비밀번호가 틀렸습니다');
        error.status = 401;
        throw error;
    }

    return { message: '비밀번호가 확인되었습니다' };
}

async function giveLike(id) {
    const targetPost = await postActionsRepository.getById(id);
    
    if (!targetPost) {
        const error = new Error('존재하지 않습니다.');
        error.status = 404;
        throw error;
    }

    const addLikeCount = targetPost.likeCount + 1;

    await postActionsRepository.giveLike(id, addLikeCount);
    return { message: '게시글 공감하기 성공' };
}

async function checkPublicState(id) {
    const publicState = await postActionsRepository.returnPublicState(id);

    return publicState;
}

export default {
    getById,
    deleteById,
    update,
    verifyPassword,
    giveLike,
    checkPublicState
}