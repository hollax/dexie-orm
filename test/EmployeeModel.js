const Model = require('../src/Model');


class EmployeeModel extends Model{

    static getSchema(){
        return [
            {
                version: 1,
                columns: "++id, active, name, salary, years_of_experience"
            },
        ];
    }
}


module.exports = {
    default: EmployeeModel
}