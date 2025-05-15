import { systemRoles } from "../../utilities/systemRole.js";

export const addUsersEndpoints = {
    ADD_USER: [systemRoles.ADMIN],
    DELETE_USER: [systemRoles.ADMIN],
    UPDATE_USER: [systemRoles.ADMIN],
}