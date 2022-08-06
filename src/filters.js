
/**
 * @var Filters
 * For each filter, index function is used to call knex WhereQuery method
 */
const filters = {
    above:{
        index: function(builder, lowerBound){
            return builder.above(lowerBound);
        },
        filter: function(value, lowerBound){
            return value > lowerBound;
        }    
    },
    aboveOrEqual:{
        index: function(builder, lowerBound){
            return builder.aboveOrEqual(lowerBound);
        },
        filter: function(value, lowerBound){
            return value >= lowerBound;
        }    
    },
    anyOf:{
        index: function(builder, values){
            return builder.anyOf(values);
        },
        filter: function(value, check){
            return check.includes(value);
        }    
    },
    anyOfIgnoreCase:{
        index: function(builder, values){
            return builder.anyOfIgnoreCase(values);
        },
        filter: function(value, check){
            return check.find(item => String(item).toLowerCase() == value);
        }    
    },
    below:{
        index: function(builder,  upperBound){
            return builder.below(upperBound);
        },
        filter: function(value, upperBound){
            return value < upperBound;
        }    
    },
    belowOrEqual:{
        index: function(builder,  upperBound){
            return builder.belowOrEqual(upperBound);
        },
        filter: function(value, upperBound){
            return value <= upperBound;
        }    
    },
    between:{
        index: function(builder, [lowerBound, upperBound]){
            return builder.between(lowerBound, upperBound);
        },
        filter: function(value, [lowerBound, upperBound]){
            return value > lowerBound && value < upperBound;
        }    
    },
    equals:{
        index: function(builder, lowerBound){
            return builder.equals(lowerBound);
        },
        filter: function(value, compare){
            return value === compare;
        }    
    },
    equalsIgnoreCase:{
        index: function(builder, value){
            return builder.equalsIgnoreCase(value);
        },
        filter: function(value, compare){
            return String(value).toLowerCase() === String(compare).toLowerCase();
        }    
    },
    noneOf:{
        index: function(builder, values){
            return builder.noneOf(values);
        },
        filter: function(value, check){
            return ! check.includes(value);
        }    
    },
    noneOfIgnoreCase:{
        index: function(builder, values){
            return builder.anyOfIgnoreCase(values);
        },
        filter: function(value, check){
            return !check.find(item => String(item).toLowerCase() == String(value).toLowerCase());
        }    
    },
    notEquals:{
        index: function(builder, value){
            return builder.notEquals(value);
        },
        filter: function(value, check){
            return value !== check
        }    
    },
    startsWith:{
        index: function(builder, value){
            return builder.startsWith(value);
        },
        filter: function(value, check){
            return String(value).startsWith(check);
        }    
    },
    startsWithIgnoreCase:{
        index: function(builder, value){
            return builder.startsWithIgnoreCase(value);
        },
        filter: function(value, check){
            return String(value).toLowerCase().startsWith(String(check).toLowerCase());
        }    
    },
    startsWithAnyOf:{
        index: function(builder, value){
            return builder.startsWithAnyOf(value);
        },
        filter: function(value, check){
            return check.find(item =>  String(value).startsWith(item));
        }    
    },

    startsWithAnyOfIgnoreCase:{
        index: function(builder, value){
            return builder.startsWithAnyOfIgnoreCase(value);
        },
        filter: function(value, check){
            return check.find(item =>  String(value).toLowerCase().startsWith(String(item).toLowerCase()));
        }    
    },
};


module.exports = filters;