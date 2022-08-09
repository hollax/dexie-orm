require("fake-indexeddb/auto");

const Dexie = require('dexie');
const { query } = require("../src/Model");
const setup = require("../src/setup");
const EmployeeModel = require('./EmployeeModel').default;
const PostModel = require('./PostModel').default;
const { makeEmployees, makePosts } = require('./fixtures');

const fixtures = {
    posts: makePosts(10, 1),
    employees: [].concat(
        makeEmployees(10, 50000, 3, 1),
        makeEmployees(5, 100000, 5, 11, 1),
        /**
         * 
         * 2 employees more experienced are inactive 
         */
        makeEmployees(2, 150000, 10, 16, 0),
    )
};
var db = new Dexie("MyDatabase");


describe('setup', () => {

    test('create store', function () {

        expect(PostModel.connection).toEqual(undefined);
        expect(PostModel.tableName).toEqual(undefined);
        setup(db, {
            posts: PostModel,
            employees: EmployeeModel
        });
        expect(PostModel.connection).toBeDefined();
        expect(PostModel.tableName).toBeDefined();
    });

    test('create store for second model', () => {
        expect(EmployeeModel.connection).toBeDefined();
        expect(EmployeeModel.tableName).toBeDefined();
    })

    test('maps store to class', function () {


        // expect(db.posts.schema.mappedClass).toBeDefined();
        // expect(db.posts.schema.mappedClass).toBe(PostModel);
    });
});

describe('getSchema', () => {

    test('return schema config ', function () {
        let schema = PostModel.getSchema();
        expect(schema).toBeDefined();
        expect(schema).toHaveLength(3);
    });
});


describe('Queries', () => {

    beforeEach(async () => {
        await db.table('posts').clear();
        await db.table('employees').clear();

        await db.table('posts').bulkAdd(fixtures.posts);
        await db.table('employees').bulkAdd(fixtures.employees);
    });

    afterEach(async () => {
        await db.table('posts').clear();
        await db.table('employees').clear();
    });

    describe('save', () => {


        test('save new item in store', async function () {
            await db.table('posts').clear();

            let post = new PostModel({
                title: 'Foo',
                body: 'Test body'
            });
            expect(post).toBeDefined();
            expect(post.title).toEqual('Foo');
            expect(await db.posts.count()).toEqual(0);
            await post.save();
            expect(post.id).toEqual(11, "Set id");

            expect(await db.posts.count()).toEqual(1, "Insert new record");
            await post.save();

            expect(await db.posts.count()).toEqual(1, "Updates record");

            let post2 = new PostModel({
                title: 'Hello World',
                body: 'ORM in action'
            });
            expect(post2).toBeDefined();
            expect(post2.title).toEqual('Hello World');
            await post2.save();
            expect(await db.posts.count()).toEqual(2, 'Save another item');

        });

    });

    describe('create', () => {

        test('create new record', async function () {
            await db.table('posts').clear();

            let post = await PostModel.create({
                title: 'Foo',
            });
            expect(post).toBeDefined();
            expect(post.title).toEqual('Foo');
            expect(await db.posts.count()).toEqual(1);
                
        });
        test('update existing', async function () {
            await db.table('posts').clear();

            let post = await PostModel.create({
                title: 'Foo',
            });
            expect(post).toBeDefined();
            expect(post.id).toBeDefined();
            expect(post.title).toEqual('Foo');
            await PostModel.create({
                id: post.id,
                title: 'Foo',
            });
            expect(await db.posts.count()).toEqual(1);
        });

    });
    describe('find', () => {

        test('return record', async function () {
            let post = await PostModel.find(1);
            expect(post).toBeInstanceOf(PostModel);
            expect(post.title).toEqual('Post 1');
            expect(post.body).toEqual('Body of post 1');
        });
        test('return undefined for non existing', async function () {
            let post = await PostModel.find(55);
            expect(post).toEqual(undefined);
        });

    });

    describe('first', () => {

        test('return record', async function () {
            let post = await PostModel.first({
                title: 'Post 1'
            });
            expect(post).toBeInstanceOf(PostModel);
            expect(post.title).toEqual('Post 1');
        });
        test('return undefined for non existing', async function () {
            let post = await PostModel.first({
                title: 'Post 111'
            });
            expect(post).toEqual(undefined);
        });

    });

    describe('last', () => {

        test('return last record', async function () {
            let post = await PostModel.last({
                title: 'Post 10'
            });
            expect(post).toBeInstanceOf(PostModel);
            expect(post.title).toEqual('Post 10');
        });
    });

    describe('all', () => {

        test('return all records', async function () {
            let posts = await PostModel.all();
            expect(posts).toHaveLength(fixtures.posts.length);
            expect(posts[0]).toBeInstanceOf(PostModel);
            expect(posts[1]).toBeInstanceOf(PostModel);
        });

        test('filter with where conditions', async function () {
            let posts = await PostModel.all({
                title: 'Post 1'
            });
            expect(posts).toHaveLength(1);
        });

        test('use offset', async function () {
            let posts = await PostModel.all(null, 5, 2);
            expect(posts).toHaveLength(5);
            expect(posts[0].title).toEqual('Post 6');

        });

        test('sortBy', async()=>{
            let posts = await PostModel.query()
            .sortBy('id', true).fetch();
            expect(posts[0].id).toEqual(10);
        })
    });


    describe('above()', () => {

        test('above', async function () {
            let posts = await EmployeeModel
                .where('salary')
                .above(100000)
                .all();
            expect(posts).toHaveLength(2);
            expect(posts[0].id).toEqual(16);
            expect(posts[1].id).toEqual(17);
        });
    });

    describe('aboveOrEqual()', () => {
        test('aboveOrEqual', async function () {
            let posts = await EmployeeModel
                .where('salary')
                .aboveOrEqual(100000)
                .all();
            expect(posts).toHaveLength(7);
            expect(posts[0].id).toEqual(11);
            expect(posts[1].id).toEqual(12);
        });
    });
    describe('anyOf()', () => {

        test('check numbers', async function () {
            let posts = await EmployeeModel
                .where('id')
                .anyOf([7, 10, 11])
                .all();
            expect(posts).toHaveLength(3);
            expect(posts[0].id).toEqual(7);
            expect(posts[1].id).toEqual(10);
            expect(posts[2].id).toEqual(11);
        });

        test('anyOf with with below', async function () {
            let posts = await EmployeeModel
                .where('id')
                .anyOf([7, 10, 11])
                .and('salary')
                .below(100000)
                .fetch();

            expect(posts).toHaveLength(2);
            expect(posts[0].id).toEqual(7);
            expect(posts[1].id).toEqual(10);
        });

        test('case sensisitve', async function () {
            let posts = await EmployeeModel
                .where('name')
                .anyOf(['employee 1', 'employee 10'])
                .all();
            expect(posts).toHaveLength(0);
        });
    });

    describe('anyOfIgnoreCase()', () => {

        test('anyOfIgnoreCase', async function () {
            let posts = await EmployeeModel
                .where('name')
                .anyOfIgnoreCase(['employee 1', 'employee 10'])
                .all();
            expect(posts).toHaveLength(2);
            expect(posts[0].id).toEqual(1);
            expect(posts[1].id).toEqual(10);
        });
    });

    describe('below()', () => {

        test('below', async function () {
            let posts = await PostModel
                .where('id')
                .below(4)
                .all();
            expect(posts).toHaveLength(3);
        });
    });

    describe('belowOrEqual()', () => {

        test('return posts where id below or eq 5', async function () {
            let posts = await PostModel
                .where('id')
                .belowOrEqual(4)
                .fetch();
            expect(posts).toHaveLength(4);
        });
    });

    describe('bewteen()', () => {

        test('include lower and upper bounds', async function () {
            let posts = await PostModel
                .where('id')
                .between(1, 4)
                .all();
            expect(posts).toHaveLength(4);
        });
        test('exclude lower and upper bounds', async function () {
            let posts = await PostModel
                .where('id')
                .between(1, 4, false, false)
                .all();
            expect(posts).toHaveLength(2);
        });
        test('exclude lower bound', async function () {
            let posts = await PostModel
                .where('id')
                .between(1, 4, false)
                .all();
            expect(posts).toHaveLength(3);
        });

        test('exclude upper bound', async function () {
            let posts = await PostModel
                .where('id')
                .between(1, 4, false, false)
                .all();
            expect(posts).toHaveLength(2);
        });

        test('as second filter', async function () {
            let posts = await PostModel
                .where('status')
                .equals('publish')
                .and('id')
                .between(1, 4)
                .all();
            expect(posts).toHaveLength(4);
        });
        test('as second filter include lower and upper bounds', async function () {
            let posts = await PostModel
                .where('status')
                .equals('publish')
                .and('id')
                .between(1, 4)
                .all();
            expect(posts).toHaveLength(4);
        });
        test('as second filter exlude lower ', async function () {
            let posts = await PostModel
                .where('status')
                .equals('publish')
                .and('id')
                .between(1, 4, false)
                .all();
            expect(posts).toHaveLength(3);
        });

    });

    describe('equals()', () => {

        test('check numbers', async function () {
            let posts = await EmployeeModel
                .where('id')
                .equals(1)
                .all();
            expect(posts).toHaveLength(1);
            expect(posts[0].id).toEqual(1);
        });

        test('case insensitve match', async function () {
            let posts = await EmployeeModel
                .where('name')
                .equals('Employee 1')
                .all();
            expect(posts).toHaveLength(1);
            expect(posts[0].id).toEqual(1);
        });

        test('case insensitve no match', async function () {
            let posts = await EmployeeModel
                .where('name')
                .equals('employee 1')
                .all();
            expect(posts).toHaveLength(0);
        });
    });

    describe('equalsIgnoreCase()', () => {
        test('case insensitve match', async function () {
            let posts = await EmployeeModel
                .where('name')
                .equalsIgnoreCase('Employee 1')
                .all();
            expect(posts).toHaveLength(1);
            expect(posts[0].id).toEqual(1);
        });
        test('case insensitve no match', async function () {
            let posts = await EmployeeModel
                .where('name')
                .equalsIgnoreCase('employee 1')
                .all();
            expect(posts).toHaveLength(1);
            expect(posts[0].id).toEqual(1);
        });
    });

    describe('filter', () => {
        test('filter records with callback', async function () {
            let posts = await EmployeeModel
                .filter((row)=> ['Employee 1', 'Employee 2'].includes(row.name) )
                .all();
            let ids = posts.map(item => item.id);
            expect(posts).toHaveLength(2);
            expect(ids).toEqual([1, 2]);
        });
    })
    describe('like', () => {
        test('filter records', async function () {
            let posts = await EmployeeModel
                .where('name')
                .like('ployee 1')
                .all();
            let ids = posts.map(item => item.id);
            expect(posts).toHaveLength(9);
            expect(ids).toEqual([1, 10, 11, 12,13,14,15,16, 17]);
        });
    })
    describe('noneOf', () => {
        test('case insensitve match', async function () {
            let posts = await EmployeeModel
                .where('name')
                .noneOf(['Employee 1', 'Employee 2'])
                .all();
            let ids = posts.map(item => item.id);
            expect(posts).toHaveLength(fixtures.employees.length - 2);
            expect(ids).toEqual(
                expect.not.arrayContaining([1, 2])
            );
        });
        test('case sensitve no match', async function () {
            let posts = await EmployeeModel
                .where('name')
                .noneOf(['employee 1', 'employee 2'])
                .all();
            expect(posts).toHaveLength(fixtures.employees.length);
        });
    });

    describe('notEqual', () => {
        test('check numbers', async function () {
            let posts = await EmployeeModel
                .where('id')
                .notEqual(1)
                .all();
            expect(posts).toHaveLength(fixtures.employees.length - 1);
        });
        test('case sensitve match', async function () {
            let posts = await EmployeeModel
                .where('name')
                .notEqual('Employee 1')
                .all();
            let ids = posts.map(item => item.id);
            expect(ids).toEqual(
                expect.not.arrayContaining([1])
            );
            expect(posts).toHaveLength(fixtures.employees.length - 1);
        });
        test('case sensitve no match', async function () {
            let posts = await EmployeeModel
                .where('name')
                .notEqual('employee 1')
                .all();
            expect(posts).toHaveLength(fixtures.employees.length);
        });
    });

    describe('startsWith', () => {
        test('case sensitve match', async function () {
            let posts = await EmployeeModel
                .where('name')
                .startsWith('Emplo')
                .all();
            expect(posts).toHaveLength(fixtures.employees.length);
        });

    });

    describe('startsWithAnyOf', () => {
        test('case sensitve match', async function () {
            await EmployeeModel.insertAll([
                {
                    name: 'John Doe'
                },
                {
                    name: 'Micheal James'
                }
            ]);
            let posts = await EmployeeModel
                .where('name')
                .startsWithAnyOf(['Emplo', 'John'])
                .all();
            expect(posts).toHaveLength(fixtures.employees.length + 1);
        });
        test('case sensitve no match', async function () {
            await EmployeeModel.insertAll([
                {
                    name: 'John Doe'
                },
                {
                    name: 'Micheal James'
                }
            ]);
            let posts = await EmployeeModel
                .where('name')
                .startsWithAnyOf(['emplo', 'john'])
                .all();
            expect(posts).toHaveLength(0);
        });
    });
    describe('startsWithAnyOfIgnoreCase', () => {
        test('case sensitve match', async function () {
            await EmployeeModel.insertAll([
                {
                    name: 'John Doe'
                },
                {
                    name: 'Micheal James'
                }
            ]);
            let posts = await EmployeeModel
                .where('name')
                .startsWithAnyOfIgnoreCase(['emplo', 'john'])
                .all();
            expect(posts).toHaveLength(fixtures.employees.length + 1);
        });

        test('as second filter', async function () {
            await EmployeeModel.insertAll([
                {
                    name: 'John Doe',
                    active: 1,
                },
                {
                    name: 'Micheal James',
                    active: 0,
                }
            ]);
            let posts = await EmployeeModel
                .where('active')
                .equals(1)
                .and('name')
                .startsWithAnyOfIgnoreCase(
                    ['emplo', 'john', 'mich']
                )
                .all();
            expect(posts).toHaveLength(fixtures.employees.length - 2 + 1);
        });
    });
    describe('startsWithIgnoreCase', () => {
        test('case sensitve match', async function () {
            await EmployeeModel.insertAll([
                {
                    name: 'John Doe'
                },
                {
                    name: 'Micheal James'
                }
            ]);
            let posts = await EmployeeModel
                .where('name')
                .startsWithIgnoreCase('emp')
                .all();
            expect(posts).toHaveLength(fixtures.employees.length);
        });

        test('as second filter', async function () {
            await EmployeeModel.insertAll([
                {
                    name: 'John Doe',
                    active: 1,
                },
                {
                    name: 'James Bayn',
                    active: 1,
                }
            ]);
            let posts = await EmployeeModel
                .where('active')
                .equals(1)
                .and('name')
                .startsWithIgnoreCase('j')
                .all();
            expect(posts).toHaveLength(2);
        });
    });

    describe('custom where conditions', function () {

        test('multiple where conditions', async function () {
            let posts = await EmployeeModel
                .where('salary')
                .between(40000, 100001)
                .and('years_of_experience')
                .equals(5)
                .fetch();
            expect(posts).toHaveLength(5);
        });
        
    });
    describe('del', () => {
        test('delete record', async () => {
            let post = await PostModel.find(1);
            expect(post).toBeInstanceOf(PostModel);
            await post.delete()
            let update = await PostModel.find(1);

            expect(update).toEqual(undefined);
        });
    });

    describe('truncate', () => {
        test('remove all records', async function () {
            expect(await db.posts.count()).toBeGreaterThan(0);
            await PostModel.truncate();
            expect(await db.posts.count()).toEqual(0);
        })
    });



    describe('insertAll', () => {

        test('insert multiple', async () => {

            await db.table('employees').clear();
            await EmployeeModel.insertAll(fixtures.employees);
            expect(await db.employees.count()).toEqual(fixtures.employees.length);

            await EmployeeModel.insertAll(fixtures.employees);
            expect(await db.employees.count()).toEqual(fixtures.employees.length, 'update existing');

        });
    });

    describe('updateAll', () => {
        test('update multiple', async () => {
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

            let employees = await EmployeeModel.where('id').in([1, 2]).all();
            expect(employees[0].salary).toEqual(45000);
            expect(employees[1].salary).toEqual(55000);

        })
    });

    describe('whereIn', () => {
        test('return records where column values in filter', async () => {
            let items = await EmployeeModel.whereIn('id', [1, 2]);
            expect(items).toHaveLength(2);
        });
        test('return records where column values in filter', async () => {
            let items = await EmployeeModel
                .whereIn('years_of_experience', [2, 10]);
            expect(items).toHaveLength(2);
        });
    });

    describe('deleteAll', () => {
        test('delete multiple', async () => {
            await EmployeeModel.deleteAll([1, 2]);
            expect(await db.employees.count()).toEqual(fixtures.employees.length - 2);
        });
    });

    describe('count', () => {
        test('return total', async () => {
            expect(await EmployeeModel.count()).toEqual(fixtures.employees.length);
        });
        test('filter where param', async () => {
            expect(await EmployeeModel.count({
                active: 0
            })).toEqual(2);
        });
        test('return total with filter', async () => {
            expect(
                await EmployeeModel
                .where('active')
                .equals(1)
                .count()
            ).toEqual(fixtures.employees.length - 2);
        });
    });

});

