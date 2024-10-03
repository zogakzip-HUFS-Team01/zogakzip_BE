import prisma from '../config/prisma.js'

async function findByName(name) {
    return await prisma.group.findUnique({
        where: {
            name,
        },
    });
}

async function findById(id) {
    return await prisma.group.findUnique({
        where: {
            id,
        }
    })
}

async function returnPublicState(id) {
    return await prisma.group.findUnique({
        where: {
            id: parseInt(id, 10),
        },
        select: {
            id: true,
            isPublic: true
        }
    });
}

async function getById(id) {
    return await prisma.group.findUnique({
      where: {
        id: parseInt(id, 10),
      },
    });
}

async function deleteById(id) {
    return await prisma.group.delete({
      where: {
        id: parseInt(id, 10),
      },
    });
}

async function save(group) {
    return prisma.group.create({
        data: {
            name: group.name,
            password: group.password,
            imageUrl: group.imageUrl,
            isPublic: group.isPublic,
            introduction: group.introduction
        }
    });
}

async function update(id, updateInfo) {
    return prisma.group.update({
        where: {
            id: parseInt(id, 10),
        },
        data: {
            name: updateInfo.name,
            imageUrl: updateInfo.imageUrl,
            isPublic: updateInfo.isPublic,
            introduction: updateInfo.introduction
        }
    });
}

async function giveLike(id, addCount) {
    return prisma.group.update({
        where: {
            id: parseInt(id, 10),
        },
        data: {
            likeCount: addCount
        }
    });
}

async function countGroups(where) {
    return prisma.group.count({ where });
}

async function findGroups({ skip, take, orderBy, where }) {
    return prisma.group.findMany({
        skip,
        take,
        orderBy,
        where,
        select: {
            id: true,
            name: true,
            imageUrl: true,
            isPublic: true,
            likeCount: true,
            badgeCount: true,
            postCount: true,
            createdAt: true,
            introduction: true
        }
    });
}

export default {
    findByName,
    findById,
    save,
    getById,
    deleteById,
    update,
    returnPublicState,
    giveLike,
    countGroups,
    findGroups
}