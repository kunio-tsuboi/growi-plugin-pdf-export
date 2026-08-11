import config from './package.json';
const BUTTON_HTML = '<span class="material-symbols-outlined me-1">picture_as_pdf</span>PDF出力';
const BUTTON_WORKING_HTML = '<span class="material-symbols-outlined me-1">hourglass_top</span>生成中...';
function getPluginConfig() {
    return window
        .GROWI_PLUGIN_PDF_EXPORT_CONFIG;
}
function createPdfButton() {
    if (document.getElementById('unou-pdf-export')) {
        return;
    }
    const button = document.createElement('button');
    button.id = 'unou-pdf-export';
    button.className = 'btn btn-transparent';
    //button.innerText = 'PDF出力';
    button.innerHTML = BUTTON_HTML;
    Object.assign(button.style, {
        padding: '6px 12px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        background: 'transparent',
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
            //button.innerText = '生成中...';
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
            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const pageName = decodeURIComponent(location.pathname
                .replace(/^\/+/, '')
                .replace(/\//g, '_'));
            link.href = downloadUrl;
            link.download = `${pageName}.pdf`;
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
            //button.innerText = 'PDF出力';
            button.innerHTML = BUTTON_HTML;
        }
    };
    //document.body.appendChild(button);
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
activate();
