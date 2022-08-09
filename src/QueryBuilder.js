const filters = require("./filters");

const makeFilter = function (key, fn, value) {
    return (obj) => fn.call(obj, obj[key], value);
};

/**
 * 
 * @param {*} store 
 * @param {Function} fn 
 * @param {mixed} value 
 * @returns 
 */
const makeIndex = function (store, fn, value) {
    return () => fn.call(store, store, value);
};


class QueryBuilder {

    constructor(tableStore) {
        this._tableStore = tableStore;
        this._currentKeyPath = null;
        this._primaryQueryAdded = false;
        this._filters = [];
        this._index = 0;
        this._whereBulder = null;
        this._collection = null;
        this._offset = null;
        this._limit = null;
        this._sortBy = null;
        this._sortDesc = false;
    }

    offset(offset) {
        this._offset = offset;

        return this;
    }

    limit(limit) {
        this._limit = limit;
        return this;
    }

    sortBy(key, desc = false) {
        this._sortBy = key;
        this._sortDesc = desc;
        return this;
    }
    reverse() {
        this._sortDesc = true;
        return this;
    }

    where(keyPath) {
        if (this._index === 0) {
            this._whereBulder = this._tableStore.where(keyPath);
        }
        this._currentKeyPath = keyPath;
        return this;
    }

    and(keyPath) {
        if (this._index === 0) {
            throw new Error('Can not use .and() with first where condition')
        }
        return this.where(keyPath);
    }

    above(value) {
        return this._processFilter('above', value);
    }

    aboveOrEqual(value) {
        return this._processFilter('aboveOrEqual', value);
    }


    anyOf(values) {
        return this._processFilter('anyOf', values);
    }

    anyOfIgnoreCase(values) {
        return this._processFilter('anyOfIgnoreCase', values);
    }


    below(upperBound) {
        return this._processFilter('below', upperBound);
    }

    belowOrEqual(upperBound) {
        return this._processFilter('belowOrEqual', upperBound);
    }

    between(lowerBound, upperBound, includeLower = true, includeUpper = true) {
        return this._processFilter('between', [lowerBound, upperBound, includeLower, includeUpper]);
    }

    equals(value) {
        return this._processFilter('equals', value);
    }

    equalsIgnoreCase(value) {
        return this._processFilter('equalsIgnoreCase', value);
    }

    like(value) {
       var q = value && value.toUpperCase();
       var key = this._currentKeyPath;
        return this.filter((item)=>{
            return item[key] && item[key].toUpperCase().indexOf(q) !== -1;
        });
    }

    in(values) {
        return this._processFilter('anyOf', values);
    }

    noneOf(values) {
        return this._processFilter('noneOf', values);
    }

    notEqual(value) {
        return this._processFilter('notEqual', value);
    }


    startsWith(value) {
        return this._processFilter('startsWith', value);
    }

    startsWithAnyOf(values) {
        return this._processFilter('startsWithAnyOf', values);
    }

    startsWithAnyOfIgnoreCase(values) {
        return this._processFilter('startsWithAnyOfIgnoreCase', values);
    }

    startsWithIgnoreCase(value) {
        return this._processFilter('startsWithIgnoreCase', value);
    }

    filter(callback) {
        if (typeof callback === 'function') {
            this._filters.push(callback);
        }
        return this;
    }


    count() {
        let result = this.build();
        if (!result.sorted) {
            return result.collection.count();
        }
        return result.collection.then(arr => arr.length);
    }

    first() {
        let result = this.build();
        if (!result.sorted) {
            return result.collection.first();
        }
        return result.collection.then(arr => arr[0]);
    }




    last() {
        let result = this.build();
        if (!result.sorted) {
            return result.collection.last();
        }
        return result.collection.then(arr => arry[arr.length - 1]);
    }

    fetch() {
        return this.all();
    }

    all() {
        let result = this.build();
        if (!result.sorted) {
            return result.collection.toArray();
        }
        return result.collection.then(arr => arr);
    }

    delete() {
        return this.build().delete();
    }

    /**
     * 
     * @returns Collection
     */
    build() {
        let collection;
        let result = {
            sorted: false
        }
        //if filter was used
        if (this._collection) {
            collection = this._collection();
            

        } else if (this._whereBulder) {
            collection = this._whereBulder;
        } else {
            collection = this._tableStore;
        }

        if (this._filters.length) {
            /**
             * if where is called for filter, we need to filter on table itself
             * Hanldes where().like()
            */
            if(this._index === 0){
                collection = this._tableStore;
            }
            //call all callback fns on object
            collection = collection.filter((obj) => {
                let noMath = this._filters.findIndex(fn => !fn(obj));
                return noMath === -1;
            });
        }

        if (this._offset) {
            collection = collection.offset(this._offset);
        }

        if (this._limit) {
            collection = collection.limit(this._limit)
        }
        if (this._sortBy) {

            if (this._sortDesc) {
                collection = collection.reverse();
            }
            collection = collection.sortBy(this._sortBy);
            result.sorted = true;
        }
        result.collection = collection;

        return result;
    }


    /**
     * 
     * @param {String} filterName 
     * @param {mixed} value 
     */
    _processFilter(filterName, value) {
        let config = filters[filterName];

        if (!config) {
            throw new Error('Invalid filter: ' + filterName);
        }

        if (this._index === 0) {
            this._collection = makeIndex(this._whereBulder, config.index, value);
        } else {
            this._filters.push(makeFilter(this._currentKeyPath, config.filter, value));
        }
        this._index++;

        return this;
    }


}


module.exports = QueryBuilder;