import { createFloatingWindow } from './FloatingWindow';

// 声明由 webpack.DefinePlugin 注入的全局变量
declare const SCRIPT_VERSION: string;

/**
 * 创建并管理脚本的入口点（一个固定在右下角的设置按钮）
 */
function createEntryPoint(): void {
    // 使用 SVG 图标，比文字更美观且不受字体影响
    const settingsIconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px" height="24px">
            <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.44,0.17-0.48,0.41L9.18,5.18C8.59,5.42,8.06,5.74,7.56,6.12L5.17,5.16C4.95,5.09,4.7,5.16,4.59,5.38L2.67,8.7 c-0.11,0.2-0.06,0.47,0.12,0.61l2.03,1.58C4.78,11.36,4.76,11.68,4.76,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.42,2.37 c0.04,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.48-0.41l0.42-2.37c0.59-0.24,1.12-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0.01,0.59-0.22l1.92-3.32c0.11-0.2,0.06-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
        </svg>
    `;

    const styles = `
        .pep-entry-button {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 48px;
            height: 48px;
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 9998;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }
        .pep-entry-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        }
        .pep-entry-button svg {
            color: #495057;
        }

        /* 暗色模式适配 */
        body.theme-dark .pep-entry-button {
            background-color: #333;
            border-color: #444;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        body.theme-dark .pep-entry-button svg {
            color: #e0e0e0;
        }
    `;
    GM_addStyle(styles);

    const entryButton = document.createElement('div');
    entryButton.className = 'pep-entry-button';
    entryButton.title = '打开 Pixiv Enhancer Pro 设置面板';
    entryButton.innerHTML = settingsIconSVG;

    // 核心逻辑：点击按钮时才创建悬浮窗
    entryButton.addEventListener('click', () => {
        // 检查页面上是否已经存在悬浮窗，防止重复创建
        if (document.querySelector('.pep-window')) {
            console.log('悬浮窗已存在。');
            return;
        }
        createFloatingWindow();
    });

    document.body.appendChild(entryButton);
}

// 主程序入口
(() => {
    "use strict";

    console.log(`=--- Pixiv Enhancer Pro v${SCRIPT_VERSION} ---=`);

    // 等待页面完全加载后，再创建入口按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createEntryPoint);
    } else {
        createEntryPoint();
    }
})();
