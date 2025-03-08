function throttle<T extends (...args: any[]) => any>(func: T, wait: number): T {
    let previous = 0;
    return function throttled(this: ThisParameterType<T>, ...args: Parameters<T>) {
        const now = Date.now();
        const remain = wait - (now - previous);
        if (remain <= 0) {
            func.apply(this, args);
            previous = now;
        }
    } as T;
}

export {
    throttle
}