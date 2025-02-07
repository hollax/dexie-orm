import Dexie from "../node_modules/dexie/dist/dexie";
import {filters} from "./filters";
import type { Model } from "./Model";

const makeFilter = function (key: string, fn: Function, value: any) {
    return (obj: any) => fn.call(obj, obj[key], value);
};

/**
 * 
 * @param {*} store 
 * @param {Function} fn 
 * @param {mixed} value 
 * @returns 
 */
const makeIndex = function (store:any, fn:Function, value: any) {
    return () => fn.call(store, store, value);
};

export type FilterHandler<T> = (Item: T)=> boolean;

export type FilterType = keyof typeof filters;

export class QueryBuilder<T extends Model = Model, Key extends string = 'id'> {

    _tableStore: Dexie.Table<T, Key> ;
    _currentKeyPath?: keyof T;
    _primaryQueryAdded = false;
    _filters: FilterHandler<T>[] = [];
    _index = 0;
    _whereBulder? : any;
    _collection? : ()=> Dexie.Collection<T, Key>;
    _offset?: number;
    _limit?: number;
    _sortBy?: string;
    _sortDesc = false;

    constructor(tableStore: Dexie.Table<T, Key> ) {
        this._tableStore = tableStore;
    }

    offset(offset: number) {
        this._offset = offset;

        return this;
    }

    limit(limit: number) {
        this._limit = limit;
        return this;
    }

    sortBy(key: string, desc = false) {
        this._sortBy = key;
        this._sortDesc = desc;
        return this;
    }
    reverse() {
        this._sortDesc = true;
        return this;
    }

    where(keyPath: keyof T) {
        if (this._index === 0) {
            this._whereBulder = this._tableStore.where(keyPath as string);
        }
        this._currentKeyPath = keyPath;
        return this;
    }

    and(keyPath: keyof T) {
        if (this._index === 0) {
            throw new Error('Can not use .and() with first where condition')
        }
        return this.where(keyPath);
    }

    above(value: number) {
        return this._processFilter('above', value);
    }

    aboveOrEqual(value: number) {
        return this._processFilter('aboveOrEqual', value);
    }


    anyOf(values: any[]) {
        return this._processFilter('anyOf', values);
    }

    anyOfIgnoreCase(values: any[]) {
        return this._processFilter('anyOfIgnoreCase', values);
    }


    below(upperBound: number) {
        return this._processFilter('below', upperBound);
    }

    belowOrEqual(upperBound: number) {
        return this._processFilter('belowOrEqual', upperBound);
    }

    between(lowerBound: number, upperBound: number, includeLower = true, includeUpper = true) {
        return this._processFilter('between', [lowerBound, upperBound, includeLower, includeUpper]);
    }

    equals(value: any) {
        return this._processFilter('equals', value);
    }

    equalsIgnoreCase(value: any) {
        return this._processFilter('equalsIgnoreCase', value);
    }

    like(value: any) {
       var q = value && value.toUpperCase();
       var key = this._currentKeyPath as keyof T;
        return this.filter((item)=>{
            return item[key] && (item[key] as string).toUpperCase().indexOf(q) !== -1;
        });
    }

    in(values: any[]) {
        return this._processFilter('anyOf', values);
    }

    noneOf(values: any[]) {
        return this._processFilter('noneOf', values);
    }

    notEqual(value: any) {
        return this._processFilter('notEqual', value);
    }


    startsWith(value: string|number) {
        return this._processFilter('startsWith', value);
    }

    startsWithAnyOf(values: string[] | number[]) {
        return this._processFilter('startsWithAnyOf', values);
    }

    startsWithAnyOfIgnoreCase(values: any[]) {
        return this._processFilter('startsWithAnyOfIgnoreCase', values);
    }

    startsWithIgnoreCase(value: any) {
        return this._processFilter('startsWithIgnoreCase', value);
    }

    filter(callback: FilterHandler<T>) {
        if (typeof callback === 'function') {
            this._filters.push(callback);
        }
        return this;
    }


    count() {
        let result = this.build();

        if (!result.sorted) {
            return result.collection?.count();
        }
        return (result.collection as Promise<Model[]>).then(arr => arr.length);
    }

    first() {
        let result = this.build();
        if (!result.sorted) {
            return result.collection?.first();
        }
        return (result.collection as Promise<any>).then(arr => arr[0]);
    }


    last() {
        let result = this.build();
        if (!result.sorted) {
            return result.collection?.last();
        }
        return (result.collection as Promise<Model[]>).then(arr => arr[arr.length - 1]);
    }

    fetch() {
        return this.all();
    }

    all() {
        let result = this.build();
        if (!result.sorted) {
            return result.collection?.toArray();
        }
        return (result.collection as Promise<any>).then(arr => arr);
    }

    delete() {
        return (this.build() as any).delete();
    }

    /**
     * 
     * @returns Collection
     */
    build() {
        let collection: Dexie.Collection | Dexie.Table<T, Key> ;
        let result = {
            sorted: false,
            collection: undefined 
        } as {
          sorted: false,
          collection:  undefined | Dexie.Collection 
        } | {
            sorted:true,
            collection: Promise<any> | Dexie.Table<T, Key>
        }
        //if filter was used
        if (this._collection) {
            collection = this._collection?.();
            

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
            collection = collection.filter((obj: T) => {
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
        result.collection = collection;
        if (this._sortBy) {

            if (this._sortDesc) {
                collection = collection.reverse();
            }
            result.collection = (collection as | Dexie.Collection).sortBy(this._sortBy);
            result.sorted = true;
        }

        return result;
    }


    /**
     * 
     * @param {String} filterName 
     * @param {mixed} value 
     */
    _processFilter(filterName: keyof typeof filters, value: any) {
        let config = filters[filterName];

        if (!config) {
            throw new Error('Invalid filter: ' + filterName);
        }

        if (this._index === 0) {
            this._collection = makeIndex(this._whereBulder, config.index, value);
        } else {
            this._filters.push(makeFilter(this._currentKeyPath as string, config.filter, value));
        }
        this._index++;

        return this;
    }


}
