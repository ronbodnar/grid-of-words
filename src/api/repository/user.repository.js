import query from "../services/database.service.js"

export const findById = async (id) => {
    if (!id) return null;
    const response = await query("SELECT * FROM users WHERE id = ?", [id]);
    console.log("Response", response);
    return response;
}

export const findByUsername = async (username) => {
    if (!username) return null;
    const response = await query("SELECT * FROM users WHERE username = ?", [username]);
    console.log("Response", response);
    return response;
    
}

export const findAll = () => {

}

export const save = (user) => {

}