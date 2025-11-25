import { getMangaImageUrls, getIllustData } from "./network"
import { info , debug, error } from "./logger";
import { showToast } from "../ui/Toast";

// 声明 Greasemonkey/Tampermonkey 的 API
declare const GM_download: (options: {
    url: string;
    name: string;
    onload?: () => void;
    onerror?: (response: any) => void;
}) => void;

/**
 * 使用 GM_download 触发浏览器下载文件
 * @param url 文件的 URL
 * @param filename 下载后保存的文件名
 */
export async function downloadById(artId: number): Promise<void> {
    try {
        let CntTotalDownloads = 0;
        let CntFailedDownloads = 0;
        let CntSuccessDownload = 0;
        let successToast = true;
        const [urls, illustData] = await Promise.all([
            getMangaImageUrls(artId),
            getIllustData(artId)
        ]);

        if (!urls || urls.length === 0) {
            debug(`没有找到作品 ${artId} 的图片链接。`);
            return;
        }

        const namingFormat = GM_getValue('naming_format', '{id}-{p}') as string;
        if (urls.length >= 5){
            successToast = false;
            showToast("提示", `超过5张图片，将只显示下载失败的提示`, 'info');

        }
        for (const [index, url] of urls.entries()) {
            const title = illustData ? illustData.title : 'unknown_title';
            const author = illustData ? illustData.userName : 'unknown_author';

            // 替换文件名中的占位符
            let filename = namingFormat
                .replace('{title}', title)
                .replace('{author}', author)
                .replace('{id}', String(artId))
                .replace('{p}', String(index));

            // 移除文件名中的非法字符
            filename = filename.replace(/[\\/:*?"<>|]/g, '_');

            filename += `.${url.split('.').pop()}`;

            debug(`请求下载: ${filename} from ${url}`);
            
            GM_download({
                url,
                name: filename,
                onload: () => {
                    if (successToast) {
                        showToast("下载成功", `${title} | 第${index + 1}张`, 'success');
                    }
                    
                    CntSuccessDownload++;
                },
                onerror: (err) => {
                    error(`下载 ${filename} 失败: ${err}`);
                    showToast("下载失败", `${title} | 第${index + 1}张`, 'error');
                    CntFailedDownloads++;
                }
            });
            CntTotalDownloads++;
            await new Promise(resolve => setTimeout(resolve, 200)); // Add 200ms delay after each download initiation
        }

        if (CntTotalDownloads === urls.length) { // Changed to === for strict comparison
            showToast("下载全部完成", `总计${urls.length}张，成功${CntSuccessDownload}张，失败${CntFailedDownloads}张`, 'success'); // Changed illustData.index + 1 to urls.length
            info(`下载全部完成 , 总计${urls.length}张，成功${CntSuccessDownload}张，失败${CntFailedDownloads}张`); // Changed illustData.index + 1 to urls.length

        }

    } catch (e) {
        error(`下载作品 ${artId} 失败: ${e}`);
    }
}
