import { Model } from "./Model";
import { DexieModelStatic, SchemaConfig } from "./types";


/**
 * @param {Dexie} db 
 * @param {Object} db Key value pair table name key and model class as value  
 */
export const  setup = (db: any, models: ((new () => Model) & DexieModelStatic<typeof Model>)[])=> {

    /**
     * Group model schema by version
     */
    var items: Record<SchemaConfig['version'], Record<string, SchemaConfig['columns']>> = {};
    var callbacks: Record<string, SchemaConfig['upgrade'][]> = {};

    var recentModelColumns:  Record<string, SchemaConfig['columns']>  = {};

    for (let modelClass of models) {
        const table = modelClass.getTableName();
        let schema = modelClass.getSchema();
        
        if (Array.isArray(schema)) {

            schema.map((schema) => {

                if (!schema.version || !schema.columns) {
                    console.warn('Invalid schema configuraiont: ', modelClass.getTableName(), schema)
                    return;
                }

                if (!items[schema.version]) {
                    items[schema.version] = {};
                    callbacks[schema.version] = [];
                }
                items[schema.version][table] = schema.columns;
                recentModelColumns[table] = schema.columns;
                if (typeof schema.upgrade === 'function') {
                    callbacks[schema.version].push(schema.upgrade);
                }
            });
        }
    }
    for (let version in items) {

        //ensure that all models are added has key for each version
        for (let modelClass of models) {
            const table = modelClass.getTableName();
            if (items[version].hasOwnProperty(table)) {
                items[version][table] = recentModelColumns[table];
            }
        }
        let result = db.version(version).stores(items[version]);
        //fire version upgrad callbacks
        result.upgrade(function () {
            callbacks[version].map((cb) => {
                cb?.call(null, db);
            });
        });

    }
    //save table connection in model classes
    for (let modelClass of models) {
        const table = modelClass.getTableName();
        modelClass.setTableConnection(db[table]);
        modelClass.getTableConnection().mapToClass(modelClass as any);
    }
}
