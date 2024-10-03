import prisma from '../config/prisma.js'

async function save(groupId, post) {
    return prisma.post.create({ 
        data: {
            groupId: parseInt(groupId, 10),
            nickname: post.nickname,
            title: post.title,
            content: post.content,
            postPassword: post.postPassword,
            groupPassword: post.groupPassword,
            imageUrl: post.imageUrl,
            tags: post.tags,
            location: post.location,
            moment: post.moment,
            isPublic: post.isPublic
        }
    })
}

async function countPosts(where) {
    return prisma.post.count({ where });
}

async function findPosts({ skip, take, orderBy, where }) {
    return prisma.post.findMany({
        skip,
        take,
        orderBy,
        where,
        select: {
            id: true,
            nickname: true,
            title: true,
            imageUrl: true,
            tags: true,
            location: true,
            moment: true,
            isPublic: true,
            likeCount: true,
            commentCount: true,
            createdAt: true
        }
    });
}

export default {
    save,
    countPosts,
    findPosts,

}