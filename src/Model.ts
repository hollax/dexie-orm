import Dexie from '../node_modules/dexie/dist/dexie';
import {FilterHandler, QueryBuilder} from './QueryBuilder';
import { ColumnName, SchemaConfig, TableData, WhereParameter } from './types';

let lastInserts: Record<string, string | number> = {};

export type ModelStatic = {
    getTableConnection(): Dexie.Table,
    _getSaveData(obj: Model, data?: Record<string, any>): Record<string, any>,
    setLastInsert(key: number):void
}


export class Model {


    id?: string | number;
    created?: string | number | Date;

    /**
     * This should be overiden by the derived class
     */
    static tableName = '';

    protected static _connection?: Dexie.Table
    /**
     * Setup class propertis use DexieModel.getColumns() returned value
     * @param {Object} data Updates class properties
     */
    constructor(data = {}) {
        this.populate(data);
    }

    static get connection(){
        return this._connection;
    }

    populate(data: Record<string, any>) {
        const self = this;
        // set properties
        for (let i in data) {
            if (typeof data[i] !== 'function') {
                self[i as keyof Model] = data[i];
            }
        }
        return this;
    }

    _beforeSave() {

    }
    _afterSave() {

    }


    static create<T extends typeof Model, M extends InstanceType<T>>(this: T, data: TableData<M>) {
        var table = this.getTableConnection();
        let item = new this();
        item.populate(data);
        item._beforeSave();
        if (item.hasOwnProperty('created')) {
            item.created = new Date();
        }
        let row = this._getSaveData(item, data);
        return table.put(row)
        .then((id) => {
            item.id = id;
            this.setLastInsert(id);
            item._afterSave();
            return item;
        }) as Promise<InstanceType<T>>;;

    }

    static _getSaveData(obj: Record<string, any>, data?: Record<string, any>) {
        let row: Record<string, any>= {};
        let cols = Object.keys(obj);
        cols.map(col => row[col] = obj[col]);
        return row;
    }

    /**
     * Saves the class property values
     @returns {Promise} put promise
     */
    save(data?: Record<string, any>) {
        const selfStatic = (this.constructor as any) as ModelStatic;
        var table = selfStatic.getTableConnection() as Dexie.Table;
        let status, row;
        this._beforeSave();

        //update
        if (this.id) {
            row = selfStatic._getSaveData(this, data);
            status = table.update(this.id, this); // Will only save own props.
        } else {

            if (this.hasOwnProperty('created')) {
                this.created = new Date();
            }

            row = selfStatic._getSaveData(this, data);
            delete row.id;

            status = table.add(row);
            status.then((id) => {
                this.id = id;
                selfStatic.setLastInsert(id);
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
        var table = (this.constructor as any).getTableConnection();

        return table.delete(this.id);
    }

    protected static _where<T extends typeof Model, M extends InstanceType<T>>(builder: QueryBuilder<T, 'id'>, where?: WhereParameter<M>){
        let _result = builder;
        if (where) {
            for(let key in where){
                _result = builder.where(key as keyof Model).equals(where[key as keyof WhereParameter<M>]);
            }
        }
        return _result;
    }
    /**
     * Retrive single record 
     * @param {Number|String} id Record id
     * @returns {Promise<this>} reolves to model instance
     */
    static async find<T extends typeof Model>(this: T, id: string | number){
        var table = this.getTableConnection();

        return table.get(id) as Promise<InstanceType<T> | undefined>;
    }

    /**
    * Retrive single record 
    * @returns {Promise} reolves to model instance
    */
    static first<T extends typeof Model, M extends InstanceType<T>>(this: T, where?: WhereParameter<M>){
        let builder = this.getQueryBuilder();
        this._where<T, M>(builder, where);
       
        return builder.first() as Promise<InstanceType<T> | undefined>;
    }

    static last<T extends typeof Model, M extends InstanceType<T>>(this: T, where?: WhereParameter<M>) {
        let builder = this.getQueryBuilder();
        this._where(builder, where);

        return builder.last() as Promise<InstanceType<T> | undefined>;
    }


    /**
     * Count record
     * @param {Object} where Where parameter
     @returns {Promise} count promise
     */
    static count<T extends typeof Model,M extends InstanceType<T>>(this: T, where?: WhereParameter<M>) {
        var builder = this.getQueryBuilder();
        this._where(builder, where);
      
        return builder.count();
    }

    
    static countIn<T extends typeof Model, M extends InstanceType<T>>(this: T, column: ColumnName<M>, values: any[], filter?: FilterHandler<T>) {

        var table = this.getTableConnection();

        let collection = table.where(column as string).anyOf(values);

        if (filter) {
            collection = collection.and(filter);
        }

        return collection.count();
    }

    /**
 * Get multiple record
 */
    static fetch<T extends typeof Model, M extends InstanceType<T>>(builder:QueryBuilder<T>, limit?: number, page?:number, order?: ColumnName<M>, desc?:boolean) {

        if (page && limit) {
            var offset = (page - 1) * limit;
            builder.offset(offset);
        }

        if (limit) {
            builder.limit(limit)
        }

        if (order) {
            builder.sortBy(order as string, desc);
        }


        return builder.all() as Promise<InstanceType<T>[]>;
    }


    /**
     * Get multiple records
     
     */
    static all<T extends typeof Model,M extends InstanceType<T>>(this: T, where?:WhereParameter<M> | null, limit?:number, page?:number, order?: ColumnName<M>, desc?:boolean) {


        let builder = this.getQueryBuilder();
        if(where){
            builder = this._where(builder, where)
        }

        return this.fetch(builder, limit, page, order, desc) as Promise<InstanceType<T>[]>;

    }

    /**
     * Add a filter callback to the query builder for the next query
     * @param callback 
     * @returns 
     */
    static filter<T extends typeof Model>(this:T, callback: FilterHandler<T>) {
        return this.getQueryBuilder().filter(callback);
    }

    /**
     * Create a query builder
     * @param index 
     * @returns 
     */
    static where<T extends typeof Model, M extends InstanceType<T>>(this: T, column: ColumnName<M>) {

        const builder = this.getQueryBuilder<T>()
        builder.where(column as string)

        return builder;
    }


    /**
     * Where in clause
     * @param key 
     * @param values 
     * @returns 
     */
    static whereIn<T extends typeof Model, M extends InstanceType<T>>(this:T, key: ColumnName<M>, values: any[]) {

        let builder = this.getQueryBuilder();

        return builder.where(key as string).anyOf(values).all();
    }


    static whereNotIn<T extends typeof Model, M extends InstanceType<T>>(this: T, key: ColumnName<M>, values: any[]) {

        let builder = this.getQueryBuilder();

        return builder.where(key as string).noneOf(values).all();
    }

    /**
     * Insert mutiple record
     * @param {Object} data
     */
    static insertAll<T extends typeof Model, M extends InstanceType<T>>(this: T, data: TableData<M>[]) {

        var table = this.getTableConnection();
        let p = table?.bulkPut(data);

        p?.then((lastKey) => {
            this.setLastInsert(lastKey);
        });

        return p;
    }
    /**
     * Update Bulk
     * @param {any} data
     */
    static updateAll<T extends typeof Model, M extends InstanceType<T>>(this: T, data: TableData<M>[]) {
        var table = this.getTableConnection();
        return table.bulkPut(data);
    }

    /**
     * Delete Bulk

     * @param {any} keys
     */
    static deleteAll(keys: string[] | number[]) {
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
    static setLastInsert(key: number) {
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
    static setTableConnection(db: Dexie.Table) {
        this._connection = db;
    }

    /**
     * 
     * @returns {Dexie.table}
     */
    static getTableConnection() {
        if(!this._connection){
            throw('Table connection is not set. Do this with the setTableConnection method')
        }
        return this._connection;
    }

    /**
     * Get query builder
     */
    static getQueryBuilder<T extends typeof Model, Key extends string = 'id'>(this: T) {
        const conn = this.getTableConnection();
        return new QueryBuilder<T, Key>(conn);
    }

    /**
     * 
     * @returns {Dexie.table}
     */
    static query<T extends typeof Model>(this: T) {
        return this.getQueryBuilder<T, 'id'>();
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
    static getSchema(): SchemaConfig[]{
        return [

        ];
    }

    /**
        Tet table columns
     */
    static getColumns(): string[] {
        let store = this.getTableConnection();

        if(!store){
            return [];
        }

        let cols = [store.schema.primKey.name];

        store.schema.indexes.map((col) => {
            if (!col.compound) {
                cols.push(col.name);
            }
        });

        return cols;
    }

    /**
     */
    static setTableName(name: string) {
        this.tableName = name;
    }

    /**
     */
      static getTableName() {
        return this.tableName;
    }


    static getNumberValue(val: any) {

        if (typeof val === 'number') {
            return val
        }
        if (typeof val === 'boolean') {
            return val ? 1 : 0;
        }
        if (typeof val === 'string') {
            return Number(val);
        }
        //return 0 if Nan
        return isNaN(val)?  0 : Number(val);

    }


}

