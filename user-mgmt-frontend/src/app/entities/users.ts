import { PageInfo } from "src/app/entities/page-info";
import { User } from "./user";

/**
 * @description Users entity - represents a list of users.
 * @property users: User[] - The list of users.
 * @property page: PageInfo - The pagination information.
 */
export interface Users {
    users: User[];
    page: PageInfo
}
