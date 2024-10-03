import postActionsRepository from '../repositories/postActionsRepository.js';
import commentActionsRepository from '../repositories/commentActionsRepository.js';
import postCommentsRepository from '../repositories/postCommentsRepository.js';

function filterIdAndPassword(target) {
    const { postId, password, ...rest } = target;
    return rest;
}

async function update(commentId, updateInfo) {
    const existedComment = await commentActionsRepository.getById(commentId);

    if (!existedComment) {
        const error = new Error('존재하지 않습니다.');
        error.status = 404;
        throw error;
    }

    if (existedComment.password !== updateInfo.updateData.password) {
        const error = new Error('비밀번호가 틀렸습니다');
        error.status = 403;
        throw error;
    }

    const updatedResult = await commentActionsRepository.update(commentId, updateInfo);
    return filterIdAndPassword(updatedResult);
}

async function deleteById(commentId, password) {
    const existedComment = await commentActionsRepository.getById(commentId);
    const postId = existedComment.postId

    if(!existedComment) {
        const error = new Error('존재하지 않습니다.');
        error.status = 404;
        throw error;
    }

    if (existedComment.password !== password) {
        const error = new Error('비밀번호가 틀렸습니다');
        error.status = 403;
        throw error;
    }

    const targetPost = await postActionsRepository.getById(postId);
    const subCommentCount = targetPost.commentCount - 1;

    await commentActionsRepository.deleteById(commentId);
    await postCommentsRepository.updateCommentCount(postId, subCommentCount);

    return { message: '게시글 삭제 성공' };
}

export default {
    update,
    deleteById
}