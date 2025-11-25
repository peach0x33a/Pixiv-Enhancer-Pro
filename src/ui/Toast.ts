/**
 * Toast.ts
 *
 * 一个简单的 toast 通知系统，用于显示简短的、自动消失的消息。
 */

// 确保 GM_addStyle 在油猴环境中可用
declare function GM_addStyle(css: string): void;

let stylesInjected = false;

/**
 * 注入 Toast 组件所需的 CSS 样式。
 * 只应在应用初始化时调用一次。
 */
function addToastStyles(): void {
    if (stylesInjected) {
        return;
    }

    const styles = `
        .pep-toast-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001; /* 比悬浮窗更高 */
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 10px;
        }

        .pep-toast {
            background-color: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.4s cubic-bezier(0.21, 1.02, 0.73, 1);
            font-size: 14px;
            max-width: 300px;
            word-break: break-all;
        }

        .pep-toast.show {
            opacity: 1;
            transform: translateX(0);
        }

        /* 不同类型的样式 */
        .pep-toast.success {
            background-color: #4CAF50; /* 绿色 */
        }
        .pep-toast.error {
            background-color: #F44336; /* 红色 */
        }
        .pep-toast.info {
            background-color: #2196F3; /* 蓝色 */
        }
    `;
    GM_addStyle(styles);
    stylesInjected = true;
}

/**
 * 获取或创建 Toast 容器。
 * @returns {HTMLElement} Toast 容器元素
 */
function getToastContainer(): HTMLElement {
    let container = document.getElementById('pep-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'pep-toast-container';
        container.className = 'pep-toast-container';
        document.body.appendChild(container);
    }
    return container;
}
export type ToastType = 'info' | 'success' | 'error';

/**
 * 显示一个 toast 通知。
 *
 * @param title - Toast 的标题
 * @param message - 要显示的消息。
 * @param type - Toast 的类型 ('info', 'success', 'error')，默认为 'info'。
 * @param duration - Toast 显示的持续时间（毫秒），默认为 3000。
 */
export function showToast(
    title: string,
    message: string,
    type: ToastType = 'info',
    duration: number = 3000
): void {
    // 确保样式已注入
    addToastStyles();

    const container = getToastContainer();

    const toast = document.createElement('div');
    toast.className = `pep-toast ${type}`;
    const titleElement = document.createElement('strong');
    titleElement.textContent = title;
    toast.appendChild(titleElement);
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    toast.appendChild(messageElement);

    container.appendChild(toast);

    // 触发显示动画
    // 使用 requestAnimationFrame 确保元素已插入 DOM 并且样式已应用
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // 设置超时以自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');

        // 在动画结束后从 DOM 中移除元素
        toast.addEventListener('transitionend', () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, { once: true });
    }, duration);
}