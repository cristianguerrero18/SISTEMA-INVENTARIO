import rolesModel from "../models/roles.models.js";


const getRoles  = async (req ,res) => { 

    const row =  await  rolesModel.getall();
    return res.json(row);
}

export const method = { 
    getRoles
}