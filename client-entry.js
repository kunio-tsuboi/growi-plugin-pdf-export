import config from './package.json';
console.log('[unou-pdf-export]', growiFacade);
const BUTTON_HTML = '<span class="material-symbols-outlined me-1">picture_as_pdf</span>PDF';
const BUTTON_WORKING_HTML = `
<span
    class="spinner-border spinner-border-sm me-2"
    role="status"
    aria-hidden="true">
</span>
生成中...
`;
function getPluginConfig() {
    return window
        .GROWI_PLUGIN_PDF_EXPORT_CONFIG;
}
function addStyle() {
    if (document.getElementById('unou-pdf-export-style')) {
        return;
    }
    const style = document.createElement('style');
    style.id = 'unou-pdf-export-style';
    style.textContent = `
        #unou-pdf-export {
            color: rgba(64, 60, 57, 0.5);
            
            transition:
                color 0.15s ease-in-out,
                background-color 0.15s ease-in-out,
                border-color 0.15s ease-in-out,
                box-shadow 0.15s ease-in-out;
        }
        
        #unou-pdf-export:hover {
            color: rgb(220, 53, 69);
            background-color: rgba(220, 53, 69, 0.2);
        }
    `;
    document.head.appendChild(style);
}
function createPdfButton() {
    if (document.getElementById('unou-pdf-export')) {
        return;
    }
    const button = document.createElement('button');
    button.id = 'unou-pdf-export';
    button.className = 'shadow-none btn btn-seen-user border-0 d-flex align-items-center';
    button.innerHTML = BUTTON_HTML;
    Object.assign(button.style, {
        cursor: 'pointer',
    });
    button.onclick = async () => {
        const pluginConfig = getPluginConfig();
        if (!pluginConfig?.apiUrl) {
            alert('PDF API URLが設定されていません');
            return;
        }
        try {
            button.disabled = true;
            button.innerHTML = BUTTON_WORKING_HTML;
            const pageUrl = window.location.href;
            const response = await fetch(pluginConfig.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: pageUrl,
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`PDF generation failed (${response.status})\n${errorText}`);
            }
            const contentType = response.headers.get('Content-Type');
            if (!contentType?.includes('pdf')) {
                const body = await response.text();
                throw new Error(`Unexpected response type: ${contentType}\n${body}`);
            }
            const disposition = response.headers.get('Content-Disposition');
            console.log('[unou-pdf-export] Content-Disposition =', disposition);
            console.log('[unou-pdf-export] response headers =', [...response.headers.entries()]);
            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const pageName = decodeURIComponent(location.pathname
                .replace(/^\/+/, '')
                .replace(/\//g, '_'));
            link.href = downloadUrl;
            let fileName = `${pageName}.pdf`;
            const match = disposition?.match(/filename\*=UTF-8''(.+)$/);
            if (match) {
                fileName = decodeURIComponent(match[1]);
            }
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
        }
        catch (e) {
            console.error(e);
            alert('PDF生成に失敗しました');
        }
        finally {
            button.disabled = false;
            button.innerHTML = BUTTON_HTML;
        }
    };
    const target = document.querySelector('[class*="grw-page-controls"]');
    if (target) {
        const menuButton = document.querySelector('.grw-page-item-control');
        if (menuButton != null) {
            menuButton.insertAdjacentElement('afterend', button);
        }
        else {
            target.appendChild(button);
        }
    }
}
const activate = () => {
    addStyle();
    const pluginConfig = getPluginConfig();
    console.log('[unou-pdf-export] apiUrl =', pluginConfig?.apiUrl);
    console.log('[unou-pdf-export] activated');
    createPdfButton();
    const observer = new MutationObserver(() => {
        createPdfButton();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
};
const deactivate = () => {
};
window.pluginActivators =
    window.pluginActivators || {};
window.pluginActivators[config.name] = {
    activate,
    deactivate,
};
//activate();
