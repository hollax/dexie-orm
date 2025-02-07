import { Model } from "./Model";
import { DexieModelStatic } from "./types";
/**
 * @param {Dexie} db
 * @param {Object} db Key value pair table name key and model class as value
 */
export declare const setup: (db: any, models: ((new () => Model) & DexieModelStatic<typeof Model>)[]) => void;
