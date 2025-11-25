import { showToast } from './ui/Toast';
import { debug, info } from './utils/logger';
import { downloadById } from './utils/download';


// 添加数据，请注意数据只能为 bool;string;number;object 四种类型，不能存储对象实例
declare function GM_setValue(name: string, value: any): void;
// 获取数据
declare function GM_getValue(name: string, defaultValue?: any): any | undefined;

/**
 * 创建并显示一个悬浮窗。
 */
export function createFloatingWindow(): void {
    const windowId = 'pep-window';

    // 避免重复创建
    if (document.getElementById(windowId)) {
        debug('悬浮窗已存在。');
        return;
    }

    const styles = `
        .pep-window {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 600px;
            height: 70%;
            max-height: 500px;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            z-index: 10000;
            display: none;
            flex-direction: column;
        }
        .pep-window-header {
            padding: 10px 15px;
            background-color: #f1f1f1;
            border-bottom: 1px solid #ccc;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .pep-window-title {
            font-weight: bold;
        }
        .pep-window-close {
            cursor: pointer;
            font-size: 20px;
            font-weight: bold;
        }
        .pep-window-body {
            padding: 15px;
            overflow-y: auto;
            flex-grow: 1;
        }
        /* 暗色模式 */
        @media (prefers-color-scheme: dark) {
            body.theme-dark .pep-window, .pep-window {
                background-color: #2b2b2b;
                border-color: #444;
                color: #e0e0e0;
            }
            body.theme-dark .pep-window-header, .pep-window-header {
                background-color: #3c3c3c;
                border-bottom-color: #555;
            }
            body.theme-dark .pep-window-title,
            body.theme-dark .pep-window-close,
            .pep-window-title,
            .pep-window-close {
                color: #e0e0e0;
            }
            body.theme-dark .pep-window-body, .pep-window-body {
                color: #ddd;
            }
        }
        .pep-form-group {
            display: flex;
            align-items: center;
            gap: 8px; /* 在输入框和按钮之间添加一些间距 */
            margin-bottom: 15px;
        }
        .pep-form-group label {
            display: block;
            margin-bottom: 5px;
            flex-shrink: 0; /* 防止标签在空间不足时被压缩 */
        }
        .pep-input {
            flex-grow: 1;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            box-sizing: border-box; /* 保证padding和border不会增加元素的总宽度 */
        }
        .pep-button {
            flex-shrink: 0; /* 防止按钮在空间不足时被压缩 */
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            background-color: #fff;
            color: #333;
            box-sizing: border-box;
        }
        .pep-checkbox-group {
            display: flex;
            align-items: center;
        }
        .pep-checkbox-group input {
            margin-right: 8px;
        }
        .pep-button {
            cursor: pointer;
            background-color: #007bff;
            color: white;
            border: none;
        }

        /* 暗色模式下的表单样式 */
        @media (prefers-color-scheme: dark) {
            body.theme-dark .pep-input, .pep-input,
            body.theme-dark .pep-button, .pep-button {
                background-color: #3c3c3c;
                border-color: #555;
                color: #e0e0e0;
            }
            body.theme-dark .pep-button, .pep-button {
                background-color: #0056b3;
            }
        }
    `;
    GM_addStyle(styles);

    const floatWindow = document.createElement('div');
    floatWindow.id = windowId;
    floatWindow.className = 'pep-window';
    floatWindow.innerHTML = `
        <div class="pep-window-header" id="${windowId}-header">
            <span class="pep-window-title">Pixiv Enhancer Pro 设置</span>
            <span class="pep-window-close" title="关闭">&times;</span>
        </div>
        <div class="pep-window-body">
            <div class="pep-form-group">
                <label for="naming-format-input">图片命名格式:</label>
                <input type="text" id="naming-format-input" class="pep-input" placeholder="例如：{title}-{id}-{p}">
                <button id="save-naming-format" class="pep-button">保存</button>
                <div style="width: 100%; font-size: 12px; color: #888; margin-top: 5px;">可用变量: {title}, {author}, {id}, {p}</div>
            </div>
            <div class="pep-form-group" id="downloadtest">
                <label for="id-input">指定ID下载:</label>
                <input type="text" id="id-input" class="pep-input" placeholder="输入艺术集ID...">
                <button id="download-test-button" class="pep-button">下载</button>
            </div>
        </div>
    `;

    document.body.appendChild(floatWindow);

    // 添加关闭功能
    const closeButton = floatWindow.querySelector('.pep-window-close');
    closeButton?.addEventListener('click', () => {
        floatWindow.remove();
    });

    // 添加拖动功能
    const header = floatWindow.querySelector<HTMLElement>(`#${windowId}-header`);
    if (header) {
        let isDragging = false;
        let offsetX: number, offsetY: number;
        let initialWindowX: number, initialWindowY: number;

        header.addEventListener('mousedown', (e: MouseEvent) => {
            isDragging = true;
            const rect = floatWindow.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            // 临时移除transform，确保left/top直接控制位置
            floatWindow.style.transform = 'none';
            floatWindow.style.transition = 'none';
            // 将窗口的当前位置设置为由 transform 转换后的实际位置
            floatWindow.style.left = `${rect.left}px`;
            floatWindow.style.top = `${rect.top}px`;

            const onMouseMove = (e: MouseEvent) => {
                if (!isDragging) return;

                // 计算新的位置
                let newX = e.clientX - offsetX;
                let newY = e.clientY - offsetY;

                // 限制窗口不超出屏幕边界
                newX = Math.max(0, Math.min(newX, window.innerWidth - floatWindow.offsetWidth));
                newY = Math.max(0, Math.min(newY, window.innerHeight - floatWindow.offsetHeight));

                floatWindow.style.left = `${newX}px`;
                floatWindow.style.top = `${newY}px`;
            };

            const onMouseUp = () => {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                floatWindow.style.transition = ''; // 恢复transition
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    // 命名格式设置
    const namingFormatInput = floatWindow.querySelector<HTMLInputElement>('#naming-format-input');
    const saveNamingFormatButton = floatWindow.querySelector('#save-naming-format');

    // 加载已保存的设置
    if (namingFormatInput) {
        const savedFormat = GM_getValue("naming_format", '{title}-{id}-{p}');
        namingFormatInput.value = savedFormat as string;
    }

    // 保存设置
    saveNamingFormatButton?.addEventListener('click', () => {
        if (namingFormatInput) {
            const newFormat = namingFormatInput.value;
            GM_setValue("naming_format", newFormat);
            info(`命名格式已保存: ${newFormat}`);
            showToast('命名格式已保存!', 'success');
        }
    });

    const downloadTestContainer = floatWindow.querySelector('#downloadtest');
    if (downloadTestContainer) {
        const downloadTestButton = downloadTestContainer.querySelector('#download-test-button');
        const idInput = downloadTestContainer.querySelector<HTMLInputElement>('#id-input');

        downloadTestButton?.addEventListener('click', () => {
            if (idInput) {
                const artIdStr = idInput.value;
                const artId = parseInt(artIdStr, 10);
                if (!isNaN(artId)) {
                    info(`准备下载艺术集: ${artId}`);
                    debug(`点击了下载测试按钮，ID: ${artId}`);
                    downloadById(artId);
                } else {
                    info(`无效的ID: ${artIdStr}`);
                    showToast(`无效的ID: ${artIdStr}`, 'error');
                }
            }
        });
    }
}
