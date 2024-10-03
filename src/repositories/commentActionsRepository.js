import prisma from '../config/prisma.js'

async function getById(commentId) {
    return await prisma.comment.findUnique({
        where: {
            id: parseInt(commentId, 10),
        },
    });
}

async function deleteById(commentId) {
    return await prisma.comment.delete({
        where: {
            id: parseInt(commentId, 10),
        },
    });
}

async function update(commentId, updateInfo) {
    return prisma.comment.update({
        where: {
            id: parseInt(commentId, 10),
        },
        data: {
            nickname: updateInfo.updateData.nickname,
            content: updateInfo.updateData.content
        }
    });
}

export default {
    getById,
    update,
    deleteById
}