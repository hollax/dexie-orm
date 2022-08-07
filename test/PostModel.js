const Model = require('../src/Model');


class PostModel extends Model{

    static getSchema(){
        return [
            {
                version: 1,
                columns: "++id"
            },
            {
                version: 2,
                columns: "++id, *tags"
            },
            {
                version: 3,
                columns: "++id,*tags, status, title, deleted, published, [deleted+published]"
            },
        ];
    }
}


module.exports = {
    default: PostModel
}