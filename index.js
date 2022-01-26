import Dexie from 'dexie';

let lastInserts = {};

class RayDexieModel {

    /**
     * Setup class propertis use RayDexieModel.getColumns() returned value
     * @param {Object} data Updates class properties
     */
    constructor(data = {}) {
        
        var columns = this.constructor.getColumns();
        // set properties
        for (let i of columns) {
            if (data && data.hasOwnProperty(i)) {
                this[i] = data[i];
            } else {
                this[i] = null;
            }
        }

    }

    _beforeSave() {

    }
    _afterSave() {

    }

    /**
     * Saves the class property values
     @returns {Promise} put promise
     */
    save() {
        var table = this.constructor.getTableConnection();
        var status;

        this._beforeSave();

        //update
        if (this.id) {

            status = table.put(this); // Will only save own props.
        } else {

            if (this.hasOwnProperty('created')) {
                this.created = new Date();
            }
            status = table.add(this);
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
     * @param {Number} id Record id
     * @returns {Promise} reolves to model instance
     */
    static find(id) {
        var table = this.getTableConnection();

        return table.get(parseInt(id));
    }


    /**
     * Count record
     * @param {Object} where Where parameter
     @returns {Promise} count promise
     */
    static count(where) {

        var table = this.getTableConnection();

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
    static countIn(column, values , filter) {

        var table = this.getTableConnection();

        table = table.where(column).anyOf(values);

        if (filter) {
            table = table.and(filter);
        }

        return table.count();
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

        var table = this.getTableConnection();

        if (where) {
            table = table.where(where);
        }
        return this.fetch(table, limit, page, order, desc);

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

        var table = this.getTableConnection();

      

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
     * Get multiple record
     * @param {Dexie[table]} where
     * @param {Object} where
     * @param {Number} limit
     * @param {Number} page
     * @param {String} order name of column to use in dorting
     * @param {Boolean} desc Whether to sort indescending order
     */
    static fetch(table, limit, page, order, desc) {
        var query = table;

        if (page) {
            var offset = (page - 1) * limit;
            query = query.offset(offset)
        }

        if (limit) {
            query = query.limit(limit)
        }

        
        if (order) {

           

            if (desc) {
                query =  query.desc(); 
            }
            else {
               // query = query.reverse();
            }

            return query.sortBy(order);
        }

        query = (query || table).distinct();


        return query.toArray();
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
        var table = this.getTableConnection();
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
    static getTableConnection() {

    }



    /**
       Should be declared by derived class
     * @returns {Array}
     */
    static getColumns() {
        return [];
    }

    /**
      Should be declared by derived class

     * @returns {String}
     */
    static getTableName() {
        return this.name;
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


export default RayDexieModel;