
/**
 * @param {Dexie} db 
 * @param {Object} db Key value pair table name key and model class as value  
 */
function setup(db, models) {

    /**
     * Group model schema by version
     */
    var items = {};
    var callbacks = {};
    var recentModelColumns = {};

    for (let table in models) {
        let modelClass = models[table];
        let schema = modelClass.getSchema();
        if (Array.isArray(schema)) {

            schema.map((schema) => {

                if (!schema.version || !schema.columns) {
                    console.warn('Invalid schema configuraiont: ', this.getTableName(), schema)
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
        for (let table in models) {
            if (items[version].hasOwnProperty(table)) {
                items[version][table] = recentModelColumns[table];
            }
        }
        let result = db.version(version).stores(items[version]);
        //fire version upgrad callbacks
        result.upgrade(function () {
            callbacks[version].map((cb) => {
                cb.call(null, arguments);
            });
        });

    }
    //save table connection in model classes
    for (let table in models) {
        let modelClass = models[table];
        modelClass.connection = db[table];
        modelClass.tableName = table;
        modelClass.connection.mapToClass(modelClass);
    }
}

module.exports = setup;