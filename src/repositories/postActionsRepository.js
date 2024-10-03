import prisma from '../config/prisma.js'

async function getById(id) {
    return await prisma.post.findUnique({
        where: {
            id: parseInt(id, 10),
        },
    });
}

async function deleteById(id) {
    return await prisma.post.delete({
        where: {
            id: parseInt(id, 10),
        },
    });
}

async function update(id, updateInfo) {
    return prisma.post.update({
        where: {
            id: parseInt(id, 10),
        },
        data: {
            nickname: updateInfo.updateData.nickname,
            title: updateInfo.updateData.title,
            content: updateInfo.updateData.content,
            imageUrl: updateInfo.updateData.imageUrl,
            tags: updateInfo.updateData.tags,
            location: updateInfo.updateData.location,
            moment: updateInfo.updateData.moment,
            isPublic: updateInfo.updateData.isPublic
        }
    });
}

async function giveLike(id, addCount) {
    return prisma.post.update({
        where: {
            id: parseInt(id, 10),
        },
        data: {
            likeCount: addCount
        }
    });
}

async function returnPublicState(id) {
    return await prisma.post.findUnique({
        where: {
            id: parseInt(id, 10),
        },
        select: {
            id: true,
            isPublic: true
        }
    });
}

export default {
    getById,
    deleteById,
    update,
    giveLike,
    returnPublicState
}