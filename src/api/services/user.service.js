import { findById, findByUsername } from "../repository/user.repository.js";

export const getById = (id) => {
    if (!id) return null;

    const user = findById(id);

    console.log("hey");
    console.log(user);
}

export const getByUsername = (username) => {
    if (!username) return null;

    const user = findByUsername(username);

    console.log("hey");
    console.log(user);
}