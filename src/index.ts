export interface StructureCheckerBody<T> {
    (data: any): boolean;
}

export interface StructureChecker<T> {
    (data: any): data is T;
    cast<C>(data: T extends C ? C : never): T;
}

export function checker<T>(body: StructureCheckerBody<T>): StructureChecker<T> {
    const proxy: StructureChecker<T> = ((data: any) => body(data)) as StructureChecker<T>;
    proxy.cast = (data) => cast(proxy, data);
    return proxy;
}

export class TypeCastException extends Error {
}

export function cast<T, C>(checker: StructureChecker<T>, data: T extends C ? C : never): T {
    if (checker(data)) {
        return data;
    } else {
        throw new TypeCastException();
    }
}

export interface ObjectStructureChecker<K extends string, V> extends StructureChecker<{[key in K]: V}> {
}

export interface TupleStructureChecker<Es extends any[]> extends StructureChecker<Es> {
}
export interface ArrayStructureChecker<E> extends TupleStructureChecker<E[]> {
}

export function nullish(): StructureChecker<null> {
    return checker(data => data == null);
}

export function like<V>(value: V): StructureChecker<V> {
    return checker(data => data == value);
}

export function constant<V>(value: V): StructureChecker<V> {
    return checker(data => data === value);
}

export function string(): StructureChecker<string> {
    return checker(data => typeof data === 'string');
}

export function number(): StructureChecker<number> {
    return checker(data => typeof data === 'number');
}

export function symbol(): StructureChecker<symbol> {
    return checker(data => typeof data === 'symbol');
}

export function boolean(): StructureChecker<boolean> {
    return checker(data => typeof data === 'boolean');
}

export function func(): StructureChecker<Function> {
    return checker(data => typeof data === 'function');
}

export function optional<T>(checker: StructureChecker<T>): StructureChecker<T | null> {
    return or(checker, nullish());
}

export type SpreadObjectDataTypes<O extends object> = {[K in keyof O]: StructureChecker<O[K]>};

export function object<O extends object = {}>(structure?: SpreadObjectDataTypes<O>): StructureChecker<O> {
    return checker(data => {
        if (typeof data !== 'object' || Array.isArray(structure)) {
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

export function property<K extends string, V>(
    key: K,
    valueCheck: StructureChecker<V>
): ObjectStructureChecker<K, V> {
    return (data => (typeof data === 'object') && valueCheck(data[key])) as ObjectStructureChecker<K, V>;
}

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

export type SpreadArrayDataTypes<A extends any[]> = {[K in keyof A]: StructureChecker<A[K]>};

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

export type ExtractStructureCheckers<SCs> = SCs extends StructureChecker<infer T>[] ? T : never;
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

export function instance<T>(constructor: {new(...args: any[]): T}): StructureChecker<T> {
    return checker(data => data instanceof constructor);
}

export type ExportedStructureType<SC> = SC extends StructureChecker<infer T> ? T : never;
