
import { QueryBuilder } from "./QueryBuilder.js"

export type SchemaConfig =  {
    version: number,
    columns: string,
    //db should be Dexie instance,unable to import the type
    upgrade?:(db: any)=> void
}

export type DexieModelStatic =  {
    getSchema():SchemaConfig[],
    getTableName(): string,
    getQueryBuilder(): QueryBuilder,
    //dexie collection
    connection:any,
    tableName: string
}