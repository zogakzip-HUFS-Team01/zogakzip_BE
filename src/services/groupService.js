import groupRepository from '../repositories/groupRepository.js';


function filterPassword(target) {
    const { password, ...rest } = target;
    return rest;
}

function getOrderBy(sortBy) {
    switch (sortBy) {
        case 'mostPosted':
            return { postCount: 'desc' };
        case 'mostLiked':
            return { likeCount: 'desc' };
        case 'mostBadge':
            return { badgeCount: 'desc' };
        default:
            return { createdAt: 'desc' };
    }
}

async function createGroup(group) {
    const existedGroup = await groupRepository.findByName(group.name);

    if (existedGroup) {
        const error = new Error('이미 사용하고 있는 이름입니다');
        error.code = 422;
        error.data = { name: group.name };
        throw error;
    }

    const createdGroup = await groupRepository.save({ ...group });
    return filterPassword(createdGroup);
}

async function getById(id) {
    const existedGroup = await groupRepository.getById(id);

    if (!existedGroup) {
        const error = new Error('잘못된 요청입니다.');
        error.code = 400;
        throw error;
    }

    return filterPassword(existedGroup);
}

async function update(id, updateInfo) {
    const existedGroup = await groupRepository.getById(id);

    if(!existedGroup) {
        const error = new Error('존재하지 않습니다.');
        error.code = 404;
        throw error;
    }

    if (existedGroup.password !== updateInfo.password) {
        const error = new Error('비밀번호가 틀렸습니다');
        error.code = 403;
        throw error;
    }

    const updatedResult = await groupRepository.update(id, updateInfo);
    return filterPassword(updatedResult);
}

async function deleteById(id, password) {
    const existedGroup = await groupRepository.getById(id);

    if(!existedGroup) {
        const error = new Error('존재하지 않습니다.');
        error.code = 404;
        throw error;
    }

    if (existedGroup.password !== password) {
        const error = new Error('비밀번호가 틀렸습니다');
        error.code = 403;
        throw error;
    }

    await groupRepository.deleteById(id);
    return { message: '그룹 삭제 성공' };
}

async function searchGroups({ page = 1, pageSize = 10, sortBy = 'latest', keyword = "", isPublic }) {
    const skip = (page - 1) * pageSize;
    const take = parseInt(pageSize, 10);
    const orderBy = getOrderBy(sortBy);

    const where = {
        AND: [
            ...(keyword ? [{ name: { contains: keyword } }] : []),
            ...(isPublic !== undefined ? [{ isPublic: isPublic === 'true' }] : [])
        ]
    };

    const [totalItemCount, data] = await Promise.all([
        groupRepository.countGroups(where),
        groupRepository.findGroups({ skip, take, orderBy, where })
    ]);

    const totalPages = Math.ceil(totalItemCount / pageSize);

    return {
        currentPage: page,
        totalPages,
        totalItemCount,
        data
    };
}


async function verifyPassword(id, password) {
    const targetGroup = await groupRepository.getById(id);
    
    if (password !== targetGroup.password) {
        const error = new Error('비밀번호가 틀렸습니다');
        error.status = 401;
        throw error;
    }
    
    return { message: '비밀번호가 확인되었습니다' };
}

async function checkPublicState(id) {
    const publicState = await groupRepository.returnPublicState(id);

    return publicState;
}

async function giveLike(id) {
    const targetGroup = await groupRepository.getById(id);

    if (!targetGroup) {
        const error = new Error('존재하지 않습니다.');
        error.status = 404;
        throw error;
    }

    const addCount = targetGroup.likeCount + 1;

    await groupRepository.giveLike(id, addCount);
    return { message: '그룹 공감하기 성공' };
}

export default {
    createGroup,
    getById,
    update,
    deleteById,
    verifyPassword,
    checkPublicState,
    giveLike,
    searchGroups
};