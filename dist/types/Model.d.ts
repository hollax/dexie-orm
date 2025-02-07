import Dexie from '../node_modules/dexie/dist/dexie';
import { FilterHandler, QueryBuilder } from './QueryBuilder';
import { ColumnName, SchemaConfig, TableData, WhereParameter } from './types';
export type ModelStatic = {
    getTableConnection(): Dexie.Table;
    _getSaveData(obj: Model, data?: Record<string, any>): Record<string, any>;
    setLastInsert(key: number): void;
};
export declare class Model {
    id?: string | number;
    created?: string | number | Date;
    /**
     * This should be overiden by the derived class
     */
    static tableName: string;
    protected static _connection?: Dexie.Table;
    /**
     * Setup class propertis use DexieModel.getColumns() returned value
     * @param {Object} data Updates class properties
     */
    constructor(data?: {});
    static get connection(): Dexie.Table<any, any, any> | undefined;
    populate(data: Record<string, any>): void;
    _beforeSave(): void;
    _afterSave(): void;
    static create<T extends typeof Model, M extends InstanceType<T>>(this: T, data: TableData<M>): Promise<InstanceType<T>>;
    static _getSaveData(obj: Record<string, any>, data?: Record<string, any>): Record<string, any>;
    /**
     * Saves the class property values
     @returns {Promise} put promise
     */
    save(data?: Record<string, any>): import("../node_modules/dexie/dist/dexie").PromiseExtended<any>;
    /**
     * Delete data based on index vaue
    @returns {Promise} delete promise
     */
    delete(): any;
    protected static _where<T extends typeof Model, M extends InstanceType<T>>(builder: QueryBuilder<T, 'id'>, where?: WhereParameter<M>): QueryBuilder<T, "id">;
    /**
     * Retrive single record
     * @param {Number|String} id Record id
     * @returns {Promise<this>} reolves to model instance
     */
    static find<T extends typeof Model>(this: T, id: string | number): Promise<InstanceType<T> | undefined>;
    /**
    * Retrive single record
    * @returns {Promise} reolves to model instance
    */
    static first<T extends typeof Model, M extends InstanceType<T>>(this: T, where?: WhereParameter<M>): Promise<InstanceType<T> | undefined>;
    static last<T extends typeof Model, M extends InstanceType<T>>(this: T, where?: WhereParameter<M>): Promise<InstanceType<T> | undefined>;
    /**
     * Count record
     * @param {Object} where Where parameter
     @returns {Promise} count promise
     */
    static count<T extends typeof Model, M extends InstanceType<T>>(this: T, where?: WhereParameter<M>): Promise<number>;
    static countIn<T extends typeof Model, M extends InstanceType<T>>(this: T, column: ColumnName<M>, values: any[], filter?: FilterHandler<T>): import("../node_modules/dexie/dist/dexie").PromiseExtended<number>;
    /**
 * Get multiple record
 */
    static fetch<T extends typeof Model, M extends InstanceType<T>>(builder: QueryBuilder<T>, limit?: number, page?: number, order?: ColumnName<M>, desc?: boolean): Promise<InstanceType<T>[]>;
    /**
     * Get multiple records
     
     */
    static all<T extends typeof Model, M extends InstanceType<T>>(this: T, where?: WhereParameter<M> | null, limit?: number, page?: number, order?: ColumnName<M>, desc?: boolean): Promise<InstanceType<T>[]>;
    /**
     * Add a filter callback to the query builder for the next query
     * @param callback
     * @returns
     */
    static filter<T extends typeof Model>(this: T, callback: FilterHandler<T>): QueryBuilder<T, "id">;
    /**
     * Create a query builder
     * @param index
     * @returns
     */
    static where<T extends typeof Model, M extends InstanceType<T>>(this: T, column: ColumnName<M>): QueryBuilder<T, "id">;
    /**
     * Where in clause
     * @param key
     * @param values
     * @returns
     */
    static whereIn<T extends typeof Model, M extends InstanceType<T>>(this: T, key: ColumnName<M>, values: any[]): Promise<any>;
    static whereNotIn<T extends typeof Model, M extends InstanceType<T>>(this: T, key: ColumnName<M>, values: any[]): Promise<any>;
    /**
     * Insert mutiple record
     * @param {Object} data
     */
    static insertAll<T extends typeof Model, M extends InstanceType<T>>(this: T, data: TableData<M>[]): import("../node_modules/dexie/dist/dexie").PromiseExtended<any>;
    /**
     * Update Bulk
     * @param {any} data
     */
    static updateAll<T extends typeof Model, M extends InstanceType<T>>(this: T, data: TableData<M>[]): import("../node_modules/dexie/dist/dexie").PromiseExtended<any>;
    /**
     * Delete Bulk

     * @param {any} keys
     */
    static deleteAll(keys: string[] | number[]): import("../node_modules/dexie/dist/dexie").PromiseExtended<void>;
    /**
     * Truncate table
     */
    static truncate(): import("../node_modules/dexie/dist/dexie").PromiseExtended<void>;
    /**
     * Sets last insert
     * @param {any} key
     */
    static setLastInsert(key: number): void;
    /**
     *
     */
    static getLastInsert(): string | number;
    /**
     * Should be declared by derived class
     @returns {Dexie[table]}
     */
    static setTableConnection(db: Dexie.Table): void;
    /**
     *
     * @returns {Dexie.table}
     */
    static getTableConnection(): Dexie.Table<any, any, any>;
    /**
     * Get query builder
     */
    static getQueryBuilder<T extends typeof Model, Key extends string = 'id'>(this: T): QueryBuilder<T, Key>;
    /**
     *
     * @returns {Dexie.table}
     */
    static query<T extends typeof Model>(this: T): QueryBuilder<T, "id">;
    /**
     *
     * @returns {}
     *
     * {
     *    columns: string,
     *    version: number
     * }
     */
    static getSchema(): SchemaConfig[];
    /**
        Tet table columns
     */
    static getColumns(): string[];
    /**
     */
    static setTableName(name: string): void;
    /**
     */
    static getTableName(): string;
    static getNumberValue(val: any): number;
}
