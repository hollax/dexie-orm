import Dexie from "../node_modules/dexie/dist/dexie";
import { filters } from "./filters";
import type { Model } from "./Model";
export type FilterHandler<T extends typeof Model> = (Item: T) => boolean;
export type FilterType = keyof typeof filters;
export declare class QueryBuilder<T extends typeof Model = typeof Model, Key extends string = 'id'> {
    _tableStore: Dexie.Table<T, Key>;
    _currentKeyPath?: keyof InstanceType<T> | string;
    _primaryQueryAdded: boolean;
    _filters: FilterHandler<T>[];
    _index: number;
    _whereBulder?: any;
    _collection?: () => Dexie.Collection<T, Key>;
    _offset?: number;
    _limit?: number;
    _sortBy?: string;
    _sortDesc: boolean;
    constructor(tableStore: Dexie.Table<T, Key>);
    offset(offset: number): this;
    limit(limit: number): this;
    sortBy(key: string, desc?: boolean): this;
    reverse(): this;
    where(keyPath: keyof InstanceType<T> | string): this;
    and(keyPath: keyof InstanceType<T>): this;
    above(value: number): this;
    aboveOrEqual(value: number): this;
    anyOf(values: any[]): this;
    anyOfIgnoreCase(values: any[]): this;
    below(upperBound: number): this;
    belowOrEqual(upperBound: number): this;
    between(lowerBound: number, upperBound: number, includeLower?: boolean, includeUpper?: boolean): this;
    equals(value: any): this;
    equalsIgnoreCase(value: any): this;
    like(value: any): this;
    in(values: any[]): this;
    noneOf(values: any[]): this;
    notEqual(value: any): this;
    startsWith(value: string | number): this;
    startsWithAnyOf(values: string[] | number[]): this;
    startsWithAnyOfIgnoreCase(values: any[]): this;
    startsWithIgnoreCase(value: any): this;
    filter(callback: FilterHandler<T>): this;
    count(): Promise<number>;
    first(): Promise<any>;
    last(): import("../node_modules/dexie/dist/dexie").PromiseExtended<any> | Promise<Model>;
    fetch(): Promise<any>;
    all(): Promise<any>;
    delete(): any;
    /**
     *
     * @returns Collection
     */
    build(): {
        sorted: false;
        collection: Dexie.Collection;
    } | {
        sorted: true;
        collection: Promise<any> | Dexie.Table<T, Key>;
    };
    /**
     *
     * @param {String} filterName
     * @param {mixed} value
     */
    _processFilter(filterName: keyof typeof filters, value: any): this;
}
