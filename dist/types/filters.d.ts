import { QueryBuilder } from "./QueryBuilder";
/**
 * @var Filters
 * For each filter, index function is used to call knex WhereQuery method
 */
export declare const filters: {
    above: {
        index: (builder: QueryBuilder, lowerBound: any) => QueryBuilder<import("./Model").Model, "id">;
        filter: (value: any, lowerBound: any) => boolean;
    };
    aboveOrEqual: {
        index: (builder: QueryBuilder, lowerBound: any) => QueryBuilder<import("./Model").Model, "id">;
        filter: (value: any, lowerBound: any) => boolean;
    };
    anyOf: {
        index: (builder: QueryBuilder, values: any[]) => QueryBuilder<import("./Model").Model, "id">;
        filter: (value: any, check: any[]) => boolean;
    };
    anyOfIgnoreCase: {
        index: (builder: QueryBuilder, values: any[]) => QueryBuilder<import("./Model").Model, "id">;
        filter: (value: any, check: any[]) => any;
    };
    below: {
        index: (builder: QueryBuilder, upperBound: any) => QueryBuilder<import("./Model").Model, "id">;
        filter: (value: any, upperBound: any) => boolean;
    };
    belowOrEqual: {
        index: (builder: QueryBuilder, upperBound: any) => QueryBuilder<import("./Model").Model, "id">;
        filter: (value: any, upperBound: any) => boolean;
    };
    between: {
        index: (builder: QueryBuilder, [lowerBound, upperBound, includeLower, includeUpper]: any) => QueryBuilder<import("./Model").Model, "id">;
        filter: (value: any, [lowerBound, upperBound, includeLower, includeUpper]: any) => boolean;
    };
    equals: {
        index: (builder: QueryBuilder, lowerBound: any) => QueryBuilder<import("./Model").Model, "id">;
        filter: (value: any, compare: any) => boolean;
    };
    equalsIgnoreCase: {
        index: (builder: QueryBuilder, value: any) => QueryBuilder<import("./Model").Model, "id">;
        filter: (value: any, compare: any) => boolean;
    };
    noneOf: {
        index: (builder: QueryBuilder, values: any[]) => QueryBuilder<import("./Model").Model, "id">;
        filter: (value: any, check: any[]) => boolean;
    };
    noneOfIgnoreCase: {
        index: (builder: QueryBuilder, values: any[]) => QueryBuilder<import("./Model").Model, "id">;
        filter: (value: any, check: any[]) => boolean;
    };
    notEqual: {
        index: (builder: QueryBuilder, value: any[]) => QueryBuilder<import("./Model").Model, "id">;
        filter: (value: any, check: any[]) => boolean;
    };
    startsWith: {
        index: (builder: QueryBuilder, value: string) => QueryBuilder<import("./Model").Model, "id">;
        filter: (value: any, check: any) => boolean;
    };
    startsWithIgnoreCase: {
        index: (builder: QueryBuilder, value: string) => QueryBuilder<import("./Model").Model, "id">;
        filter: (value: any, check: string) => boolean;
    };
    startsWithAnyOf: {
        index: (builder: QueryBuilder, value: string[]) => QueryBuilder<import("./Model").Model, "id">;
        filter: (value: any, check: string[]) => string | undefined;
    };
    startsWithAnyOfIgnoreCase: {
        index: (builder: QueryBuilder, value: string[]) => QueryBuilder<import("./Model").Model, "id">;
        filter: (value: any, check: string[]) => string | undefined;
    };
};
