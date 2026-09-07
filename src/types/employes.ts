export type Division = "INC-PMR" | "INC-ER" | "GA";
export type Position = "Supervisor" | "Technician" | "Foreman";
export type Status = "active" | "inactive"

export type employes = {
    id : number,
    division : Division,
    position : Position,
    status : Status,
    user_id : {
        id : number,
        name : string,
        email : string,
        password : string
    }
}