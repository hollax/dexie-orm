![Test](https://github.com/github/docs/actions/workflows/test.yml/badge.svg)

## Introduction

Simple ORM model for [dexiejs](https://dexie.org/)

## Example

```javascript
const Model = require('@hollax/dexie-modex');

class Post extend Model{

    static getSchema(){
        return [
            {
                version: 1,
                columns: "id++, title, body, **tags"
            }
        ];
    }

}

```

Somewhere in the app.

```javascript
    let db = new Dexie("MyDatabase");
    Post.setup(db, 'posts');
    //register other models too
    User.setup(db, 'users');

```


## Testing

The library uses fake-indexeddb and jest for Testing.

Running the test:
```javascript
 npm test

```