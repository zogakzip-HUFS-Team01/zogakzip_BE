import prisma from '../config/prisma.js'

async function save(postId, comment) {
    return prisma.comment.create({
        data: {
            postId: parseInt(postId, 10),
            nickname: comment.nickname,
            content: comment.content,
            password: comment.password
        }
    });
}

async function updateCommentCount(postId, addCommentCount) {
    return prisma.post.update({
        where: {
            id: parseInt(postId, 10),
        },
        data: {
            commentCount: addCommentCount
        }
    });
}

async function countComments(where) {
    return prisma.comment.count({ where });
}

async function findComments({ skip, take, where }) {
    return prisma.comment.findMany({
        skip,
        take,
        where,
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            id: true,
            nickname: true,
            content: true,
            createdAt: true
        }
    });
}


export default {
    save,
    updateCommentCount,
    countComments,
    findComments
}