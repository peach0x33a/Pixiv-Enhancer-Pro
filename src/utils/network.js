// 导出一个函数
export function fetchData(url) {
    return fetch(url).then(res => res.json());
}
