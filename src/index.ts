import { createFloatingWindow } from './FloatingWindow';
import { createFloatingActionButton, addFabStyles } from './ui/Button';
import { downloadById } from './utils/download';
import { currentArtId } from './utils/env';
import { debug, info } from './utils/logger';
// import { downloadFile } from './utils/download';

debug(`Current ArtWorks id: ${currentArtId}`);

// 声明由 webpack.DefinePlugin 注入的全局变量
declare const SCRIPT_VERSION: string;

/**
 * 创建并管理脚本的入口点（一个固定在左下角的设置按钮）
 */
function createEntryPoint(): void {
    const settingsIconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.44,0.17-0.48,0.41L9.18,5.18C8.59,5.42,8.06,5.74,7.56,6.12L5.17,5.16C4.95,5.09,4.7,5.16,4.59,5.38L2.67,8.7 c-0.11,0.2-0.06,0.47,0.12,0.61l2.03,1.58C4.78,11.36,4.76,11.68,4.76,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.42,2.37 c0.04,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.48-0.41l0.42-2.37c0.59-0.24,1.12-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0.01,0.59-0.22l1.92-3.32c0.11-0.2,0.06-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
        </svg>
    `;

    createFloatingActionButton(
        'pep-settings-button',
        '打开 Pixiv Enhancer Pro 设置面板',
        settingsIconSVG,
        { bottom: '20px', left: '20px' },
        () => {
            const floatingWindow = document.querySelector('.pep-window') as HTMLElement;
            if (floatingWindow) {
                if (floatingWindow.style.display === 'none' || !floatingWindow.style.display) {
                    floatingWindow.style.display = 'flex';
                } else {
                    floatingWindow.style.display = 'none';
                }
            }
        }
    );
}

/**
 * 创建下载按钮
 */
function createDownloadButton(): void {
    const downloadIconSVG = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v12m0 0l-4-4m4 4l4-4m6 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    `;
    
    createFloatingActionButton(
        'pep-download-button',
        '下载',
        downloadIconSVG,
        { bottom: '78px', left: '20px' }, // 20px (原按钮) + 48px (按钮高度) + 10px (间距)
        () => {
            downloadById(currentArtId)
        }
    );
}

// 主程序入口
(() => {
    "use strict";

    info(`=--- Pixiv Enhancer Pro v${SCRIPT_VERSION} ---=`);

    const init = () => {
        addFabStyles(); // 注入按钮样式
        createEntryPoint();
        createFloatingWindow();
        if (/https?:\/\/(www\.)?pixiv\.net\/artworks\//.test(window.location.href)) {
            createDownloadButton();
        }
    };

    // 等待页面完全加载后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
