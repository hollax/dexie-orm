## Introduction

Simple ORM model for [dexiejs](https://dexie.org/)

## Example

```[javascript]
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

```
    let db = new Dexie("MyDatabase");
    Post.setup(db, 'posts');
    //register other models too
    User.setup(db, 'users');

```