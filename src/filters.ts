import { QueryBuilder } from "./QueryBuilder";

/**
 * @var Filters
 * For each filter, index function is used to call knex WhereQuery method
 */
export const filters = {
    above:{
        index: function(builder: QueryBuilder, lowerBound: any){
            return builder.above(lowerBound);
        },
        filter: function(value: any, lowerBound: any){
            return value > lowerBound;
        }    
    },
    aboveOrEqual:{
        index: function(builder: QueryBuilder, lowerBound: any){
            return builder.aboveOrEqual(lowerBound);
        },
        filter: function(value: any, lowerBound: any){
            return value >= lowerBound;
        }    
    },
    anyOf:{
        index: function(builder: QueryBuilder, values: any[]){
            return builder.anyOf(values);
        },
        filter: function(value: any, check: any[]){
            return check.includes(value);
        }    
    },
    anyOfIgnoreCase:{
        index: function(builder: QueryBuilder, values: any[]){
            return builder.anyOfIgnoreCase(values);
        },
        filter: function(value: any, check: any[]){
            return check.find(item => String(item).toLowerCase() == value);
        }    
    },
    below:{
        index: function(builder: QueryBuilder, upperBound: any){
            return builder.below(upperBound);
        },
        filter: function(value: any, upperBound: any){
            return value < upperBound;
        }    
    },
    belowOrEqual:{
        index: function(builder: QueryBuilder, upperBound: any){
            return builder.belowOrEqual(upperBound);
        },
        filter: function(value:any, upperBound: any){
            return value <= upperBound;
        }    
    },
    between:{
        index: function(builder: QueryBuilder, [lowerBound, upperBound, includeLower, includeUpper]: any){
            return builder.between(lowerBound, upperBound, includeLower, includeUpper);
        },
        filter: function(value:any, [lowerBound, upperBound, includeLower, includeUpper]: any){
            let from = includeLower? lowerBound - 1 : lowerBound;
            let to = includeUpper? upperBound + 1 : upperBound;
            return value > from && value < to;
        }    
    },
    equals:{
        index: function(builder: QueryBuilder, lowerBound: any){
            return builder.equals(lowerBound);
        },
        filter: function(value: any, compare: any){
            return value === compare;
        }    
    },
    equalsIgnoreCase:{
        index: function(builder: QueryBuilder, value: any){
            return builder.equalsIgnoreCase(value);
        },
        filter: function(value: any, compare: any){
            return String(value).toLowerCase() === String(compare).toLowerCase();
        }    
    },
    noneOf:{
        index: function(builder: QueryBuilder, values: any[]){
            return builder.noneOf(values);
        },
        filter: function(value: any, check: any[]){
            return ! check.includes(value);
        }    
    },
    noneOfIgnoreCase:{
        index: function(builder: QueryBuilder, values: any[]){
            return builder.anyOfIgnoreCase(values);
        },
        filter: function(value: any, check: any[]){
            return !check.find(item => String(item).toLowerCase() == String(value).toLowerCase());
        }    
    },
    notEqual:{
        index: function(builder: QueryBuilder, value: any[]){
            return builder.notEqual(value);
        },
        filter: function(value: any, check: any[]){
            return value !== check;
        }    
    },
    startsWith:{
        index: function(builder: QueryBuilder, value: string){
            return builder.startsWith(value);
        },
        filter: function(value: any, check: any){
            return String(value).startsWith(check);
        }    
    },
    startsWithIgnoreCase:{
        index: function(builder: QueryBuilder, value: string){
            return builder.startsWithIgnoreCase(value);
        },
        filter: function(value: any, check: string){
            return String(value).toLowerCase().startsWith(String(check).toLowerCase());
        }    
    },
    startsWithAnyOf:{
        index: function(builder: QueryBuilder, value: string[]){
            return builder.startsWithAnyOf(value);
        },
        filter: function(value: any, check: string[]){
            return check.find(item =>  String(value).startsWith(item));
        }    
    },

    startsWithAnyOfIgnoreCase:{
        index: function(builder: QueryBuilder, value: string[]){
            return builder.startsWithAnyOfIgnoreCase(value);
        },
        filter: function(value: any, check: string[]){
            return check.find(item =>  String(value).toLowerCase().startsWith(String(item).toLowerCase()));
        }    
    },
};
