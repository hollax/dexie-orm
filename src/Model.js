const Dexie = require('dexie');

let lastInserts = {};

class DexieModel {


    /**
     * Setup class propertis use DexieModel.getColumns() returned value
     * @param {Object} data Updates class properties
     */
    constructor(data = {}) {
       this.populate(data);
    }

    populate(data){
        // set properties
        for (let i in data) {
            if(typeof data[i] !== 'function'){
                this[i] = data[i];
            }
        }
    }

    _beforeSave() {

    }
    _afterSave() {

    }

    static _getSaveData(obj, data) {
        let row = {};
        let cols = Object.keys(obj);
        cols.map(col => row[col] = obj[col]);
        return row;
    }
    /**
     * Saves the class property values
     @returns {Promise} put promise
     */
    save(data) {
        var table = this.constructor.getTableConnection();
        let status, row;
        this._beforeSave();

        //update
        if (this.id) {
            row = this.constructor._getSaveData(this, data);
            status = table.update(this.id, this); // Will only save own props.
        } else {

            if (this.hasOwnProperty('created')) {
                this.created = new Date();
            }

            row = this.constructor._getSaveData(this, data);
            delete row.id;

            status = table.add(row);
            status.then((id) => {
                this.id = id;
                this.constructor.setLastInsert(id);
            });
        }

        this._afterSave();
        return status;
    }



    /**
     * Delete data based on index vaue
    @returns {Promise} delete promise
     */
    delete() {
        var table = this.constructor.getTableConnection();

        return table.delete(this.id);
    }

    /**
     * Retrive single record 
     * @param {Number|String} id Record id
     * @returns {Promise<this>} reolves to model instance
     */
    static find(id) {
        var table = this.getTableConnection();

        return table.get(id);
    }

     /**
     * Retrive single record 
     * @param {Number} id Record id
     * @returns {Promise} reolves to model instance
     */
      static first(where = {}) {
        var table = this.whereClause || this.getTableConnection();
        
        return table.where(where).first();
    }


    /**
     * Count record
     * @param {Object} where Where parameter
     @returns {Promise} count promise
     */
    static count(where) {

        var table = this.whereClause || this.getTableConnection();

        if (where) {
            table = table.where(where);
        }
        return table.count();
    }

    /**
     * Count record
     * @param {String} column
     * @param {Mixed} value
     * @param {Function} filter
     @returns {Promise} count promise
     */
    static countIn(column, values, filter) {

        var table = this.getTableConnection();

        table = table.where(column).anyOf(values);

        if (filter) {
            table = table.and(filter);
        }

        return table.count();
    }

        /**
     * Get multiple record
     * @param {Dexie[table]} where
     * @param {Object} where
     * @param {Number} limit
     * @param {Number} page
     * @param {String} order name of column to use in dorting
     * @param {Boolean} desc Whether to sort indescending order
     */
         static fetch(table, limit, page, order, desc) {
            let query = table;
    
            if (page) {
                var offset = (page - 1) * limit;
                query = query.offset(offset)
            }
    
            if (limit) {
                query = query.limit(limit)
            }
    
    
            if (order) {
    
                if (desc) {
                    query = query.desc();
                }
                else {
                    // query = query.reverse();
                }
    
             
                return query.sortBy(order);
            }
    
            //query = query.distinct();
            if(this.whereClause){
                console.log(this.whereClause)
            }
    
            return query.toArray();
        }

        
    /**
     * Get multiple record
     * @param {Object} where
     * @param {Number} limit
     * @param {Number} page
     * @param {String} order name of column to use in dorting
     * @param {Boolean} desc Whether to sort indescending order
     */
    static all(where, limit, page, order, desc) {

        var table = this.whereClause || this.getTableConnection();

        if (where) {
            table = table.where(where);
        }

        return this.fetch(table, limit, page, order, desc);

    }

    static filter(callback){
        let whereClause = this.getTableConnection().filter(callback);
       //save it to allow building custom where with all() metho
       //  this.whereClause = whereClause;
       return whereClause;
   }

    static where(index){
         let whereClause = this.getTableConnection().where(index);
        //save it to allow building custom where with all() metho
        //  this.whereClause = whereClause;
        return whereClause;
    }
    /**
    * Get multiple record where keyPath value in specified values
    * @param {String|Array} column
    * @param {mixed} values
    * @param {Function} filter
    * @param {Number} limit
    * @param {Number} page
    * @param {String} order name of column to use in dorting
    * @param {Boolean} desc Whether to sort indescending order
    */
    static in(column, values, filter, limit, page, order, desc) {

        var table = this.whereClause || this.getTableConnection();


        table = table.where(column).anyOf(values);

        if (filter) {
            table = table.and(filter);
        }

        return this.fetch(table, limit, page, order, desc);

    }

    /**
     * Get multiple record where keyPath value not in specified values

     * @param {String} column
     * @param {Array} values
     * @param {Number} limit
     * @param {Number} page
     * @param {String} order keyPath
     * @param {Boolean} desc
     */
    static notIn(column, values, limit, page, order, desc) {
        var table = this.getTableConnection();

        table = table.where(column).noneOf(values);

        return this.fetch(table, limit, page, order, desc);
    }


    /**
     * Insert mutiple record
     * @param {Object} data
     */
    static insertAll(data) {

        var table = this.getTableConnection();
        let p = table.bulkAdd(data);

        p.then((lastKey) => {
            this.setLastInsert(lastKey);
        });

        return p;
    }
    /**
     * Update Bulk
     * @param {any} data
     */
    static updateAll(data) {
        var table = this.getTableConnection();
        return table.bulkPut(data);
    }

    /**
     * Delete Bulk

     * @param {any} keys
     */
    static deleteAll(keys) {
        var table = this.whereClause || this.getTableConnection();
        return table.bulkDelete(keys);
    }


    /**
     * Truncate table
     */
    static truncate() {
        var table = this.getTableConnection();
        return table.clear();

    }

    /**
     * Sets last insert 
     * @param {any} key
     */
    static setLastInsert(key) {
        var tableName = this.getTableName();
        lastInserts[tableName] = key;
    }

    /**
     * 
     */
    static getLastInsert() {
        var tableName = this.getTableName();
        return lastInserts[tableName];
    }
    /**
     * Should be declared by derived class
     @returns {Dexie[table]}
     */
    static setTableConnection(db) {
        this.connection = db;
    }

    /**
     * 
     * @returns {Dexie.table}
     */
    static getTableConnection() {
        return this.connection;
    }


    /**
     * 
     * @returns {}
     * 
     * {
     *    columns: string,
     *    version: number
     * }
     */
    static getSchema() {
        return [

        ];
    }

    /**
       Should be declared by derived class
     * @returns {Array}
     */
    static getColumns() {
        let store = this.getTableConnection();
        let cols = [store.schema.primKey.name];

        store.schema.indexes.map((col) => {
            if (!col.compound) {
                cols.push(col.name);
            }
        });

        return cols;
    }

    /**
      Should be declared by derived class

     * @returns {String}
     */
    static getTableName() {
        return this.tableName;
    }


    static getNumberValue(val) {

        if (val && val.constructor === Number) {
            return val
        }
        if (val && val.constructor === Boolean) {
            return val ? 1 : 0;
        }
        if (val && val.constructor === String) {
            return parseInt(val);
        }

        // n could be NaN
        var n = parseInt(val)
        //return 0 if Nan
        return n || 0;

    }


}


module.exports = DexieModel;