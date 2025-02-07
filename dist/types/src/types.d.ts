import Dexie from "../node_modules/dexie/dist/dexie.js";
import { QueryBuilder } from "./QueryBuilder.js";
export type SchemaConfig = {
    version: number;
    columns: string;
    upgrade?: (db: any) => void;
};
export type DexieModelStatic = {
    getSchema(): SchemaConfig[];
    getTableName(): string;
    getQueryBuilder(): QueryBuilder;
    setTableConnection(conn: Dexie.Table): void;
    getTableConnection(): Dexie.Table;
    setTableName(name: string): void;
};
