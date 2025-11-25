/**
 * 创建一个圆形浮动按钮的通用函数
 * @param id - 按钮的 HTML id
 * @param title - 按钮的 title 属性
 * @param svgIcon - 按钮内部的 SVG 图标字符串
 * @param position - 按钮的位置，包含 bottom 和 left
 * @param onClick - 点击事件的回调函数
 */
export function createFloatingActionButton(
    id: string,
    title: string,
    svgIcon: string,
    position: { bottom: string; left: string },
    onClick?: () => void
): void {
    const button = document.createElement('div');
    button.id = id;
    button.className = 'pep-fab'; // Floating Action Button
    button.title = title;
    button.innerHTML = svgIcon;
    button.style.bottom = position.bottom;
    button.style.left = position.left;

    if (onClick) {
        button.addEventListener('click', onClick);
    }

    document.body.appendChild(button);
}

/**
 * 为浮动按钮注入通用样式
 */
export function addFabStyles(): void {
    const styles = `
        .pep-fab {
            position: fixed;
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
        .pep-fab:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0,0,0,0.15);
        }
        .pep-fab svg {
            color: #495057;
            width: 24px;
            height: 24px;
        }

        /* 暗色模式适配 (Pixiv 在 html 标签上应用 theme-dark) */
        html.theme-dark .pep-fab {
            background-color: #333;
            border-color: #444;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        html.theme-dark .pep-fab svg {
            color: #e0e0e0;
        }
    `;
    GM_addStyle(styles);
}