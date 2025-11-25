const prefix = "[Pixiv Enhancer Pro]";

export function debug(log: string) {
    console.debug(`${prefix} (debug) ${log}`);
}
export function info(log: string) {
    console.log(`${prefix} ${log}`);
}
export function warn(log: string) {
    console.warn(`${prefix} ${log}`);
}
export function error(log: string) {
    console.error(`${prefix} ${log}`);
}
