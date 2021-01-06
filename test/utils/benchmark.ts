type GenericFunction = (...args: any) => any;

export default async function benchmark(n: number, callback: GenericFunction): Promise<number> {
    let total = 0;

    for (let i = 0; i < n; i++) {
        const start = Date.now();
        await callback();
        const end = Date.now();
        total += end - start;
    }

    return total / n;
}
