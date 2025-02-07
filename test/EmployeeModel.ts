import { Model } from "../src/Model";


export class EmployeeModel extends Model{
    name?:string;
    salary?: number;
    active?:number;
    years_of_experience?:number;

    static tableName = 'employees';

    static getSchema(){
        return [
            {
                version: 1,
                columns: "++id, active, name, salary, years_of_experience"
            },
        ];
    }
}

