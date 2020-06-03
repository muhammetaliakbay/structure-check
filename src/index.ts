export interface StructureChecker<T> {
    (data: any): data is T;
}

export interface ObjectStructureChecker<K extends string, V> extends StructureChecker<{[key in K]: V}> {
}

export interface TupleStructureChecker<Es extends any[]> extends StructureChecker<Es> {
}
export interface ArrayStructureChecker<E> extends TupleStructureChecker<E[]> {
}

export function nullish(): StructureChecker<null> {
    return (data => data == null) as StructureChecker<null>;
}

export function like<V>(value: V): StructureChecker<V> {
    return (data => data == value) as StructureChecker<V>;
}

export function constant<V>(value: V): StructureChecker<V> {
    return (data => data === value) as StructureChecker<V>;
}

export function string(): StructureChecker<string> {
    return (data => typeof data === 'string') as StructureChecker<string>;
}

export function number(): StructureChecker<number> {
    return (data => typeof data === 'number') as StructureChecker<number>;
}

export function symbol(): StructureChecker<symbol> {
    return (data => typeof data === 'symbol') as StructureChecker<symbol>;
}

export function boolean(): StructureChecker<boolean> {
    return (data => typeof data === 'boolean') as StructureChecker<boolean>;
}

export function func(): StructureChecker<Function> {
    return (data => typeof data === 'function') as StructureChecker<Function>;
}

export function optional<T>(checker: StructureChecker<T>): StructureChecker<T | null> {
    return or(checker, nullish());
}

export type SpreadObjectDataTypes<O extends object> = {[K in keyof O]: StructureChecker<O[K]>};

export function object<O extends object = {}>(structure?: SpreadObjectDataTypes<O>): StructureChecker<O> {
    return (data => {
        if (typeof data !== 'object' && !Array.isArray(structure)) {
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
    }) as StructureChecker<O>;
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
    return (data => {
        for(const checker of checkers) {
            if (checker(data)) {
                return true;
            }
        }
        return false;
    }) as StructureChecker<ExtractStructureCheckers<SCs>>;
}

export function and<A, B>(... checkers: [StructureChecker<A>, StructureChecker<B>]): StructureChecker<A & B> {
    return (data => {
        for(const checker of checkers) {
            if (!checker(data)) {
                return false;
            }
        }
        return true;
    }) as StructureChecker<A & B>;
}

export function instance<T>(constructor: {new(...args: any[]): T}): StructureChecker<T> {
    return (data => data instanceof constructor) as StructureChecker<T>;
}

export type ExportedStructureType<SC> = SC extends StructureChecker<infer T> ? T : never;
