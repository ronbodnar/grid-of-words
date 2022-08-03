import { findById, findByUsername } from "../repository/user.repository.js";

export const getById = async (id) => {
    if (!id) return null;

    const user = await findById(id);

    return user;
}

export const getByUsername = async (username) => {
    if (!username) return null;

    const user = await findByUsername(username);

    return user;
}