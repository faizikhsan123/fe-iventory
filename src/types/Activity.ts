 export type TYPE = "stockin" | "stockout" | "system"
 export type Activity = {
    id : number
    activity : string
    detail : string
    date : string,
    type : TYPE,
    user_id : {
        id : number,
        name : string,
        email : string
    }
 }