
import Dexie from "../node_modules/dexie/dist/dexie.js"
import { Model } from "./Model.js"
import { QueryBuilder } from "./QueryBuilder.js"

export type SchemaConfig =  {
    version: number,
    columns: string,
    //db should be Dexie instance,unable to import the type
    upgrade?:(db: any)=> void
}

export type DexieModelStatic<T extends typeof Model = typeof Model> =  {
    getSchema():SchemaConfig[],
    getTableName(): string,
    getQueryBuilder(): QueryBuilder<T>,
    setTableConnection(conn: Dexie.Table):void
    getTableConnection(): Dexie.Table
    //dexie collection
    setTableName(name: string):void
}

export type WhereParameter<T extends Model> = TableData<T>

export type ColumnName<T extends Model>  = Exclude<keyof T, keyof Model>  | 'id'

// export type TableData<T extends typeof Model, K  extends ColumnName<T> = ColumnName<T>> = {
//     [Key in K]?: Key extends keyof T? T[Key] : any
// }

export type TableData<T extends Model, K  extends ColumnName<T> = ColumnName<T>> = {
    [Key in K]?: Key extends keyof T? T[Key] : any
}




