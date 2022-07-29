const Model = require('../src/Model');


class PostModel extends Model{

    static getSchema(){
        return [
            {
                version: 1,
                columns: "++id, title, body"
            },
            {
                version: 2,
                columns: "++id, title, body, *tags"
            },
            {
                version: 2,
                columns: "++id, title, body, *tags, created, deleted, published, [deleted+published]"
            },
        ];
    }
}


module.exports = {
    default: PostModel
}