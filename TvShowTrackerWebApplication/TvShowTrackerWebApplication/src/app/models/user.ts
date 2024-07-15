import { UserShow } from "./userShow";

export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password?: string;
    dateCreated?: Date;
    userShows?: UserShow[];
}