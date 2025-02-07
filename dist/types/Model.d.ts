import Dexie from '../node_modules/dexie/dist/dexie';
import { FilterHandler, QueryBuilder } from './QueryBuilder';
import { SchemaConfig } from './types';
export type WhereParam = Record<string, any>;
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
    static create<T extends typeof Model>(this: T, data: Record<string, any>): Promise<InstanceType<T>>;
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
    protected static _where(builder: QueryBuilder<Model, 'id'>, where?: WhereParam): QueryBuilder<Model, "id">;
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
    static first<T extends typeof Model>(this: T, where?: WhereParam): Promise<InstanceType<T> | undefined>;
    static last<T extends typeof Model>(this: T, where?: WhereParam): Promise<InstanceType<T> | undefined>;
    /**
     * Count record
     * @param {Object} where Where parameter
     @returns {Promise} count promise
     */
    static count(where?: WhereParam): Promise<number>;
    /**
     * Count record
     * @param {String} column
     * @param {Mixed} value
     * @param {Function} filter
     @returns {Promise} count promise
     */
    static countIn(column: string, values: any[], filter?: FilterHandler<Model>): import("../node_modules/dexie/dist/dexie").PromiseExtended<number>;
    /**
 * Get multiple record
 */
    static fetch<T extends typeof Model>(builder: QueryBuilder, limit?: number, page?: number, order?: string, desc?: boolean): Promise<InstanceType<T>[]>;
    /**
     * Get multiple records
     
     */
    static all<T extends typeof Model>(this: T, where?: WhereParam, limit?: number, page?: number, order?: string, desc?: boolean): Promise<InstanceType<T>[]>;
    /**
     * Add a filter callback to the query builder for the next query
     * @param callback
     * @returns
     */
    static filter(callback: FilterHandler<Model>): QueryBuilder<Model, "id">;
    /**
     * Create a query builder
     * @param index
     * @returns
     */
    static where(column: string): QueryBuilder<Model, "id">;
    /**
     * Where in clause
     * @param key
     * @param values
     * @returns
     */
    static whereIn(key: string, values: any[]): Promise<any>;
    static whereNotIn(key: string, values: any[]): Promise<any>;
    /**
     * Insert mutiple record
     * @param {Object} data
     */
    static insertAll(data: Record<string, any>[]): import("../node_modules/dexie/dist/dexie").PromiseExtended<any>;
    /**
     * Update Bulk
     * @param {any} data
     */
    static updateAll(data: Record<string, any>[]): import("../node_modules/dexie/dist/dexie").PromiseExtended<any>;
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
    static getQueryBuilder<T extends Model = Model, Key extends string = 'id'>(): QueryBuilder<T, Key>;
    /**
     *
     * @returns {Dexie.table}
     */
    static query(): QueryBuilder<Model, "id">;
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
