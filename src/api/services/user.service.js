import { findByEmail, findById } from "../repository/user.repository.js";

export const getById = async (id) => {
    if (!id) return null;

    const user = await findById(id);

    return user;
}

export const getByEmail = async (email) => {
    if (!email) return null;

    const user = await findByEmail(email);

    return user;
}