/**
 * 根据作品 ID 获取多图作品的所有原始图片链接
 * @param {string | number} illustId 作品ID
 * @returns {Promise<string[]>} 包含所有原始图片 URL 的数组
 */
export async function getMangaImageUrls(illustId:number) {
    const url = `https://www.pixiv.net/ajax/illust/${illustId}/pages`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.error) {
            throw new Error(data.message);
        }
        // return data.body.map(page => page.urls.original);
        // 提取所有原始图片的 URL
        const imageUrls: string[] = data.body.map((page: { urls: { original: string } }) => page.urls.original.replace('i.pximg.net', 'i.pixiv.re'));
        return imageUrls;
    } catch (error) {
        console.error(`Failed to get manga image urls for illustId ${illustId}:`, error);
        return [];
    }
}

/**
 * 根据作品 ID 获取作品的详细信息
 * @param illustId 作品ID
 * @returns 作品数据
 */
export async function getIllustData(illustId: number): Promise<any> {
    const url = `https://www.pixiv.net/ajax/illust/${illustId}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.error) {
            throw new Error(data.message);
        }
        return data.body;
    } catch (error) {
        console.error(`Failed to get illust data for illustId ${illustId}:`, error);
        return null;
    }
}
