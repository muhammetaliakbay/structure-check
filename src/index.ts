/**
 * Callable interface which defines how specific structure validated
 * @typeParam T - Specified type of data which is being validated
 */
export interface StructureCheckerBody<T> {
    /**
     * @param data - Input data to be validated
     * @returns Returns that if the data structure validated or not
     */
    (data: any): boolean;
}

/**
 * Essential structure of the validation provider
 * @typeParam T - Specified type of data which is being validated
 * @param data - Input data to be validated
 * @returns Returns that if the data structure fits in the specified type or not
 */
export interface StructureChecker<T> {
    /**
     * @param data - Input data to be validated
     * @returns Returns that if the data structure fits in the specified type or not
     */
    (data: any): data is T;

    /**
     * @typeParam C - Dummy type parameter which extends T
     * @param data - The input data to be checked that if it fits in the structure or not
     * @throws TypeCastException - Throws TypeCastException if the data doesn't fit into specified type
     * @returns Returns input data as T if it fits into T, throws TypeCastException otherwise.
     */
    cast<C>(data: T extends C ? C : never): T;
}

/**
 * Creates a custom structure checker implementation for validations and castings
 * @typeParam T - Specified type of data which is being validated
 * @param body - Validator logic function's body to be used to check that if input data fits in the structure or not while future usages of the checker
 * @returns StructureChecker instance to be used for validations
 */
export function checker<T>(body: StructureCheckerBody<T>): StructureChecker<T> {
    const proxy: StructureChecker<T> = ((data: any) => body(data)) as StructureChecker<T>;
    proxy.cast = (data) => cast(proxy, data);
    return proxy;
}

/**
 * A special exception which thrown when casting attempts fails on structure checks
 */
export class TypeCastException extends Error {
}

/**
 * @typeParam T - Specified type of data which is being validated. (Target type)
 * @typeParam C - Dummy type parameter which extends T. (Source type)
 * @param checker - Structure checker instance to be used while validation input type
 * @param data - The input data to be checked that if it fits in the structure or not
 * @throws TypeCastException - Throws TypeCastException if the data doesn't fit into specified type
 * @returns Returns input data as T if it fits into T, throws TypeCastException otherwise.
 */
export function cast<T, C>(checker: StructureChecker<T>, data: T extends C ? C : never): T {
    if (checker(data)) {
        return data;
    } else {
        throw new TypeCastException();
    }
}

/**
 * @internal
 */
interface ObjectStructureChecker<K extends string, V> extends StructureChecker<{[key in K]: V}> {
}

/**
 * @internal
 */
interface TupleStructureChecker<Es extends any[]> extends StructureChecker<Es> {
}

/**
 * @internal
 */
interface ArrayStructureChecker<E> extends TupleStructureChecker<E[]> {
}

/**
 * Defines the union of 'null' and 'undefined' types
 */
export type Nullish = null | undefined;

/**
 * Creates an essential structure checker which validates that if the input data equals to the null or undefined
 * @returns A structure checker instance which validates that if the input data equals to the null or undefined
 */
export function nullish(): StructureChecker<Nullish> {
    return checker(data => data === null || data === undefined);
}

/**
 * Creates an essential structure checker which validates that if the input data strictly equals to undefined
 * @returns A structure checker instance which validates that if the input data strictly equals to undefined
 */
export function undef(): StructureChecker<undefined> {
    return checker(data => data === undefined);
}

/**
 * Creates an essential structure checker which validates that if the input data strictly equals to null
 * @returns A structure checker instance which validates that if the input data strictly equals to null
 */
export function nul(): StructureChecker<null> {
    return checker(data => data === null);
}

/**
 * Creates an essential structure checker which validates that if the input data weakly equals specified constant value
 * @typeParam V - Type of specified constant value
 * @param value - Value to check that if input data weakly equals to
 * @returns A structure checker instance which validates that if the input data weakly equals specified constant value
 */
export function like<V>(value: V): StructureChecker<V> {
    return checker(data => data == value);
}

/**
 * Creates an essential structure checker which validates that if the input data strictly equals to the specified constant value
 * @typeParam V - Type of specified constant value
 * @param value - Value to check that if input data strictly equals to
 * @returns A structure checker instance which validates that if the input data strictly equals to specified constant value
 */
export function constant<V>(value: V): StructureChecker<V> {
    return checker(data => data === value);
}

/**
 * @internal
 */
type TypeName = "string" | "number" | "boolean" | "undefined" | "function" | "object" | "symbol";

/**
 * @internal
 */
type TypeFromName<TN extends TypeName> =
    TN extends "string" ? string :
        TN extends "number" ? number :
            TN extends "boolean" ? boolean :
                TN extends "undefined" ? undefined :
                    TN extends "function" ? Function :
                        TN extends "object" ? object :
                            TN extends "symbol" ? symbol :
                                never;

/**
 * Creates an essential structure checker which validates that if typeof the input data is 'string'
 * @param name - Must be 'string'
 * @returns A structure checker instance which validates that if typeof the input data is 'string'
 */
export function typename(name: 'string'): StructureChecker<string>;
/**
 * Creates an essential structure checker which validates that if typeof the input data is 'number'
 * @param name - Must be 'number'
 * @returns A structure checker instance which validates that if typeof the input data is 'number'
 */
export function typename(name: 'number'): StructureChecker<number>;
/**
 * Creates an essential structure checker which validates that if typeof the input data is 'boolean'
 * @param name - Must be 'boolean'
 * @returns A structure checker instance which validates that if typeof the input data is 'boolean'
 */
export function typename(name: 'boolean'): StructureChecker<boolean>;
/**
 * Creates an essential structure checker which validates that if typeof the input data is 'undefined'
 * @param name - Must be 'undefined'
 * @returns A structure checker instance which validates that if typeof the input data is 'undefined'
 */
export function typename(name: 'undefined'): StructureChecker<undefined>;
/**
 * Creates an essential structure checker which validates that if typeof the input data is 'function'
 * @param name - Must be 'function'
 * @returns A structure checker instance which validates that if typeof the input data is 'function'
 */
export function typename(name: 'function'): StructureChecker<Function>;
/**
 * Creates an essential structure checker which validates that if typeof the input data is 'object'
 * @param name - Must be 'object'
 * @returns A structure checker instance which validates that if typeof the input data is 'object'
 */
export function typename(name: 'object'): StructureChecker<object>;
/**
 * Creates an essential structure checker which validates that if typeof the input data is 'symbol'
 * @param name - Must be 'symbol'
 * @returns A structure checker instance which validates that if typeof the input data is 'symbol'
 */
export function typename(name: 'symbol'): StructureChecker<symbol>;

export function typename<
    TN extends TypeName
    >(name: TN): StructureChecker<TypeFromName<typeof name>> {
    return checker(data => typeof data === name);
}

/**
 * Creates an essential structure checker which validates that if type of the input data is 'string'
 * @returns A structure checker instance which validates that if type of the input data is 'string'
 * @see typename
 */
export function string(): StructureChecker<string> {
    return typename('string');
}

/**
 * Creates an essential structure checker which validates that if type of the input data is 'number'
 * @returns A structure checker instance which validates that if type of the input data is 'number'
 * @see typename
 */
export function number(): StructureChecker<number> {
    return typename('number');
}

/**
 * Creates an essential structure checker which validates that if type of the input data is 'symbol'
 * @returns A structure checker instance which validates that if type of the input data is 'symbol'
 * @see typename
 */
export function symbol(): StructureChecker<symbol> {
    return typename('symbol');
}

/**
 * Creates an essential structure checker which validates that if type of the input data is 'boolean'
 * @returns A structure checker instance which validates that if type of the input data is 'boolean'
 * @see typename
 */
export function boolean(): StructureChecker<boolean> {
    return typename('boolean');
}

/**
 * Creates an essential structure checker which validates that if type of the input data is 'function'
 * @returns A structure checker instance which validates that if type of the input data is 'function'
 * @see typename
 */
export function func(): StructureChecker<Function> {
    return typename('function');
}

/**
 * Creates an essential structure checker which validates that if input data is nullish or fits in the specified structure
 * @param checker - Structure checker instance to validate if the input data fits into when the data is not nullish
 * @returns A structure checker instance which validates that if input data is nullish or fits in the specified structure
 */
export function optional<T>(checker: StructureChecker<T>): StructureChecker<T | Nullish> {
    return or(checker, nullish());
}

/**
 * @internal
 */
type SpreadObjectDataTypes<O extends object> = {[K in keyof O]: StructureChecker<O[K]>};

/**
 * Creates an essential structure checker which validates that if input data is and object an its field structure fits into the specified one
 * @typeParam O - Type definition of the desired structure
 * @param structure - An object which specifies fields and their structures to be used for object validation
 * @returns Returns a structure checker instance which validates that if input data is an object and its field structure fits into the specified one
 */
export function object<O extends object = {}>(structure: SpreadObjectDataTypes<O>): StructureChecker<O>;
/**
 * Creates an essential structure checker which validates that if input data is an object (or an array)
 * @returns Returns a structure checker instance which validates that if input data is an object (or an array)
 */
export function object(): StructureChecker<{} | []>;

export function object<O extends object = {}>(structure?: SpreadObjectDataTypes<O>): StructureChecker<O> {
    return checker(data => {
        if (data == null || typeof data !== 'object' || Array.isArray(structure)) {
            return false;
        }

        if (structure != null) {
            for (const key of Object.keys(structure)) {
                if (!(((structure as any)[key] as StructureChecker<any>) (data[key]))) {
                    return false;
                }
            }
        }

        return true;
    });
}

/**
 * Creates an essential structure checker which validates that if input data is an object and its specific field's type fits into the specified structure
 * @typeParam K - Name definition of the field
 * @typeParam V - Type definition of the field value
 * @param key - Name of the field
 * @param valueCheck - Structure of the field
 * @returns Returns a structure checker instance which validates that if input data is an object and its specific field's type fits into the specified structure
 */
export function property<K extends string, V>(
    key: K,
    valueCheck: StructureChecker<V>
): ObjectStructureChecker<K, V> {
    return (data => (typeof data === 'object') && valueCheck(data[key])) as ObjectStructureChecker<K, V>;
}

/**
 * Creates an essential structure checker which validates that if input data is an array of the specified element structure
 * @typeParam E - Type definition of elements in the array
 * @param elementChecker - Structure of elements in the array
 * @returns Returns a structure checker instance which validates that if input data is an array of the specified element structure
 */
export function array<E>(elementChecker: StructureChecker<E>): ArrayStructureChecker<E> {
    return (data => {
        if (!Array.isArray(data)) {
            return false;
        }
        for (const elm of data) {
            if (!elementChecker(elm)) {
                return false;
            }
        }
        return true;
    }) as ArrayStructureChecker<E>;
}

/**
 * @internal
 */
type SpreadArrayDataTypes<A extends any[]> = {[K in keyof A]: StructureChecker<A[K]>};

/**
 * Creates an essential structure checker which validates that if input data is an array of the specified element structure and its length equals to the length of specified parameters
 * @typeParam Es - Type definitions tuple of elements in the array
 * @param elementCheckers - Structures of elements in the array
 * @returns Returns a structure checker instance which validates that if input data is an array of the specified element structure and its length equals to the length of specified parameters
 */
export function tuple<Es extends any[]>(...elementCheckers: SpreadArrayDataTypes<Es>): TupleStructureChecker<Es> {
    return (data => {
        if (!Array.isArray(data)) {
            return false;
        }
        for (let i = 0; i < elementCheckers.length; i ++) {
            if (!elementCheckers[i](data[i])) {
                return false;
            }
        }
        return true;
    }) as TupleStructureChecker<Es>;
}

/**
 * @internal
 */
type ExtractStructureCheckers<SCs> = SCs extends StructureChecker<infer T>[] ? T : never;

/**
 * Creates an essential structure checker which validates that if input data fits at least one of the specified structures
 * @typeParam SCs - Union type definition of the possible structures
 * @param checkers - Structures to check that if the input data fits into at least one of them
 * @returns Returns a structure checker instance which validates that if input data fits at least one of the specified structures
 */
export function or<SCs extends StructureChecker<any>[]>(... checkers: SCs): StructureChecker<ExtractStructureCheckers<SCs>> {
    return checker(data => {
        for(const checker of checkers) {
            if (checker(data)) {
                return true;
            }
        }
        return false;
    });
}

/**
 * Creates an essential structure checker which validates that if input data fits both of the specified structures A and B
 * @typeParam A - First type structure
 * @typeParam B - Second type structure
 * @param checkers - First (A) and second (B) structures to check that if the input data fits into both of them
 * @returns Returns a structure checker instance which validates that if input data fits both of the specified structures A and B
 */
export function and<A, B>(... checkers: [StructureChecker<A>, StructureChecker<B>]): StructureChecker<A & B> {
    return checker(data => {
        for(const checker of checkers) {
            if (!checker(data)) {
                return false;
            }
        }
        return true;
    });
}

/**
 * Creates an essential structure checker which validates that if input data is an instance of the specified constructor or class
 * @typeParam T - Type definition of the specified constructor or class
 * @param constructor - Specified constructor or class to validate that if input data is an instance of it
 * @returns Returns a structure checker instance which validates that if input data is an instance of the specified constructor or class
 */
export function instance<T>(constructor: {new(...args: any[]): T}): StructureChecker<T> {
    return checker(data => data instanceof constructor);
}

/**
 * @internal
 */
type ExportedStructureType<SC> = SC extends StructureChecker<infer T> ? T : never;
