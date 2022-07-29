require("fake-indexeddb/auto");

const Dexie = require('dexie');
const EmployeeModel = require('./EmployeeModel').default;
const PostModel = require('./PostModel').default;
const fixtures = require('./fixtures');

var db = new Dexie("MyDatabase");


describe('setup', ()=>{

    test('create store', function(){

        expect(PostModel.connection).toEqual(undefined);
        expect(PostModel.tableName).toEqual(undefined);
        PostModel.setup(db, 'posts');
        expect(PostModel.connection).toBeDefined();
        expect(PostModel.tableName).toBeDefined();
    });

    test('create store for second model', ()=>{
        EmployeeModel.setup(db, 'employees');
        expect(EmployeeModel.connection).toBeDefined();
        expect(EmployeeModel.tableName).toBeDefined();
    })

    test('maps store to class', function(){

        
        // expect(db.posts.schema.mappedClass).toBeDefined();
        // expect(db.posts.schema.mappedClass).toBe(PostModel);
    });
});

describe('getSchema', ()=>{

    test('return schema config ', function(){
        let schema = PostModel.getSchema();
        expect(schema).toBeDefined();
        expect(schema).toHaveLength(3);
    });
});

describe('getColumns', ()=>{

    test('save new item in store', function(){
        let columns = PostModel.getColumns();
        expect(columns).toBeDefined();
        expect(columns).toHaveLength(7);
        expect(columns).toStrictEqual(["id", "title", "body", "tags", "created", "deleted", "published"])
    });
});

describe('save', ()=>{

    test('save new item in store', async function(){
        let post = new PostModel({
            title: 'Foo'
        });
        expect(post).toBeDefined();
        expect(post.title).toEqual('Foo');
        expect(await db.posts.count()).toEqual(0);
        await post.save();
        expect(post.id).toEqual(1,"Set id");

        expect(await db.posts.count()).toEqual(1, "Insert new record");
        await post.save();

        expect(await db.posts.count()).toEqual(1, "Updates record");

    });
    test('save another item in store', async function(){
        let post = new PostModel({
            title: 'Hello World',
            body: 'ORM in action'
        });
        expect(post).toBeDefined();
        expect(post.title).toEqual('Hello World');
        await post.save();
        expect(await db.posts.count()).toEqual(2);

    });
});

describe('find', ()=>{

    test('return record', async function(){
        let post = await PostModel.find(1);
        expect(post).toBeInstanceOf(PostModel);
        expect(post.title).toEqual('Foo');
    });
    test('return undefined for non existing', async function(){
        let post = await PostModel.find(55);
        expect(post).toEqual(undefined);
    });
    
});

describe('first', ()=>{

    test('return record', async function(){
        let post = await PostModel.first({
            title: 'Foo'
        });
        expect(post).toBeInstanceOf(PostModel);
        expect(post.title).toEqual('Foo');
    });
    test('return undefined for non existing', async function(){
        let post = await PostModel.first({
            title: 'Bar'
        });
        expect(post).toEqual(undefined);
    });
    
});

describe('all', ()=>{
    
    test('return all records', async function(){
        let posts = await PostModel.all();
        expect(posts).toHaveLength(2);
        expect(posts[0]).toBeInstanceOf(PostModel);
        expect(posts[1]).toBeInstanceOf(PostModel);
    });
    test('filter with where conditions', async function(){
        let posts = await PostModel.all({
            title: 'Foo'
        });
        expect(posts).toHaveLength(1);
    });

    test('use custom where conditions', async function(){
        let posts = await PostModel
        .where('id')
        .between(1, 2)
        .toArray();
        
        expect(posts).toHaveLength(1);
    });
    
});

describe('del', ()=>{
    test('delete record', async ()=>{
        let post = await PostModel.find(1);
        expect(post).toBeInstanceOf(PostModel);
        await post.delete()
        let update = await PostModel.find(1);

        expect(update).toEqual(undefined);
    });
});

describe('truncate', ()=>{
    test('remove all records', async function(){
        expect(await db.posts.count()).toBeGreaterThan(0);
        await PostModel.truncate();
        expect(await db.posts.count()).toEqual(0);
    })
});



describe('insertAll', ()=>{
    test('insert multiple', async ()=>{
        await EmployeeModel.insertAll(fixtures.employees);
        expect(await db.employees.count()).toEqual(fixtures.employees.length);
    }); 
});

describe('updateAll', ()=>{
    test('update multiple', async ()=>{
           await EmployeeModel.updateAll([
                {
                    id: 1,
                    salary: 45000
                },
                {
                    id: 2,
                    salary: 55000
                }
           ]);

           let employees = await EmployeeModel.in('id', [1, 2]);

           expect(employees[0].salary).toEqual(45000);
           expect(employees[1].salary).toEqual(55000);

    })
});

describe('in', ()=>{
    test('return records where column values in filter', async ()=>{
        let items = await EmployeeModel.in('id', [1, 2]);
        expect(items).toHaveLength(2);
    });
    test('return records where column values in filter', async ()=>{
        let items = await EmployeeModel.in('years_of_experience', [2, 3]);
        expect(items).toHaveLength(2);
    });
});

describe('deleteAll', ()=>{
    test('delete multiple', async ()=>{
        await EmployeeModel.deleteAll([1, 2]);
        expect(await db.employees.count()).toEqual(fixtures.employees.length - 2);
    });
});

