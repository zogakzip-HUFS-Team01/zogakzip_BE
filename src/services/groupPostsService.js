import groupPostsRepository from '../repositories/groupPostsRepository.js';


function filterPassword(target) {
    const { postPassword, groupPassword, ...rest } = target;
    return rest;
}


function getOrderBy(sortBy) {
    switch (sortBy) {
        case 'mostCommented':
            return { commentCount: 'desc' };
        case 'mostLiked':
            return { likeCount: 'desc' };
        case 'latest':
        default:
            return { createdAt: 'desc' };
    }
}

async function createPost(groupId, post) {
    const createdPost = await groupPostsRepository.save(groupId, { ...post });
    return filterPassword(createdPost);
}

async function searchPosts({ page = 1, pageSize = 10, sortBy = 'latest', keyword = "", isPublic, groupId }) {
    const parsedPage = parseInt(page, 10);
    const parsedPageSize = parseInt(pageSize, 10);

    const skip = (parsedPage - 1) * parsedPageSize;
    const take = parsedPageSize;
    const orderBy = getOrderBy(sortBy);

    const where = {
        AND: [
            { groupId: Number(groupId) },
            ...(isPublic !== undefined ? [{ isPublic: isPublic === 'true' }] : []),
            ...(keyword ? [
                {
                    OR: [
                        { title: { contains: keyword, mode: 'insensitive' } },
                        { tags: { has: keyword } }
                    ]
                }
            ] : [])
        ]
    };

    const [totalItemCount, data] = await Promise.all([
        groupPostsRepository.countPosts(where),
        groupPostsRepository.findPosts({ skip, take, orderBy, where })
    ]);

    const totalPages = Math.ceil(totalItemCount / parsedPageSize);

    return {
        currentPage: parsedPage,
        totalPages,
        totalItemCount,
        data
    };
}

export default {
    createPost,
    searchPosts,

}