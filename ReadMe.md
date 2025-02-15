![Test](https://github.com/hollax/dexie-orm/actions/workflows/test.yml/badge.svg)

## Introduction

Simple ORM model for [dexiejs](https://dexie.org/) (A Minimalistic Wrapper for IndexedDB)

## Installation

```
  npm i @hollax/dexie-orm dexie

```
## Quick Reference

```javascript
const {Model, setup} = require('@hollax/dexie-orm');

class Post extend Model{

    title?: string
    status?:string
    body?: string
    
    static tableName = 'posts';

    static getSchema(){
        return [
            {
                version: 1,
                columns: "id++, **tags"
            }
        ];
    }

}


```

> NOTE: Don’t declare all columns like in SQL. You only declare properties you want to index, that is properties you want to use in a where(…) query.

Somewhere in the app:

```javascript
    const Dexie = require('dexie');

    let db = new Dexie("MyDatabase");
    setup(db, [Post,User]);

```

### Insert new record

```javascript
    let post = new Post({
        title: 'Hello World!'
    });

    post.save()
    .then(()=>{
        console.log('Post saved ', post.id);
    });
```

### Get single record

```javascript
    let post = await Post.find(1)
    console.log('Post 1', post);
    let post2 = await Post.find(2)
    console.log('Post 2', post2);

```

Using `first` method

```javascript
    let post = await Post.first({
        title: 'Hello World!'
    });
    console.log('Result of Post.first', post.title);
    console.log('Post id 1 title ', post.title);

```

### Get multiple records
```javascript
    let posts = await Post.all();
    console.log('All posts', posts);

```

### Update record

```javascript
    let post = await Post.find(1);
    post.title = "Simple Post";
    await post.save()

```

### Delete record

```javascript
    let post = await Post.find(1);
    await post.delete()

    console.log('find result after deleting record', await Post.find(1))

```

## Testing

The library uses fake-indexeddb and jest for Testing.

Running the test:
```javascript
 npm test

```
