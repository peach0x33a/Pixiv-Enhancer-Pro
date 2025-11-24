/**
 * 创建并显示一个悬浮窗。
 * @param content - 悬浮窗中要显示的内容 (HTML 字符串或 HTMLElement)
 */
export function createFloatingWindow(): void {
    const windowId = 'pep-window';

    // 避免重复创建
    if (document.getElementById(windowId)) {
        console.log('悬浮窗已存在。');
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
            display: flex;
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
            margin-bottom: 15px;
        }
        .pep-form-group label {
            display: block;
            margin-bottom: 5px;
        }
        .pep-input, .pep-button {
            width: 100%;
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
                <label for="text-input">文本输入框:</label>
                <input type="text" id="text-input" class="pep-input" placeholder="输入一些文本...">
            </div>
            <div class="pep-form-group pep-checkbox-group">
                <input type="checkbox" id="checkbox-input">
                <label for="checkbox-input">这是一个复选框</label>
            </div>
            <div class="pep-form-group">
                <button class="pep-button">点击我</button>
            </div>
        </div>
    `;

    document.body.appendChild(floatWindow);

    // 添加关闭功能
    const closeButton = floatWindow.querySelector('.pep-window-close');
    closeButton?.addEventListener('click', () => {
        floatWindow.remove();
    });

    // 添加拖拽功能
    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    const header = floatWindow.querySelector<HTMLElement>(`.pep-window-header`);

    if (header) {
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - floatWindow.offsetLeft;
            offsetY = e.clientY - floatWindow.offsetTop;
            header.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                floatWindow.style.left = `${e.clientX - offsetX}px`;
                floatWindow.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            header.style.cursor = 'move';
        });
    }
}
