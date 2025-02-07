import { Model } from "../src/Model";


export class PostModel extends Model{

    title?: string
    status?:string
    body?: string

    static tableName = 'posts';


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

