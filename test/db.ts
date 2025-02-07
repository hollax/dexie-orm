import Dexie, { Table } from "dexie";
import { PostModel } from "./PostModel";
import { EmployeeModel } from "./EmployeeModel";


export class TestDatabase extends Dexie{
    employees: Table<EmployeeModel, number>; // `users` table with `id` as primary key
    posts: Table<PostModel, number>; // `users` table with `id` as primary key

}