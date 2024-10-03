import postActionsRepository from '../repositories/postActionsRepository.js';
import postCommentsRepository from '../repositories/postCommentsRepository.js';

function filterPasswordAndPostId(target) {
    const { postId, password, ...rest } = target;
    return rest;
}

async function createComment(postId, comment) {
    const createdComment = await postCommentsRepository.save(postId, { ... comment });

    const targetPost = await postActionsRepository.getById(postId);
    const addCommentCount = targetPost.commentCount + 1;

    await postCommentsRepository.updateCommentCount(postId, addCommentCount);
    return filterPasswordAndPostId(createdComment);
}

async function searchCommets({ postId, page = 1, pageSize = 10 }) {
    const checkExisted = await postActionsRepository.getById(postId);

    if (!checkExisted) {
        const error = new Error('잘못된 요청입니다.');
        error.status = 400;
        throw error;
    }

    const parsedPage = parseInt(page, 10);
    const parsedPageSize = parseInt(pageSize, 10);

    const skip = (parsedPage - 1) * parsedPageSize;
    const take = parsedPageSize;

    const where = {
        postId: parseInt(postId, 10)
    };

    const [totalItemCount, data] = await Promise.all([
        postCommentsRepository.countComments(where),
        postCommentsRepository.findComments({ skip, take, where })
    ]);

    const totalPages = Math.ceil(totalItemCount / parsedPageSize);

    return {
        currentPage: parsedPage,
        totalPages,
        totalItemCount,
        data
    };
}

export default  {
    createComment,
    searchCommets
};