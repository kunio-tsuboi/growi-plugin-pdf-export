import config from './package.json';

type PluginConfig = {
    apiUrl: string;
}

function getPluginConfig(): PluginConfig | undefined {
    return (window as any)
        .GROWI_PLUGIN_PDF_EXPORT_CONFIG;
}

function createPdfButton() {
    

    if (document.getElementById('unou-pdf-export')) {
        return;
    }

    const button = document.createElement('button');

    button.id = 'unou-pdf-export';
    button.innerText = 'PDF出力';

    Object.assign(button.style, {
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        zIndex: '9999',
        padding: '10px 16px',
        borderRadius: '6px',
        border: 'none',
        background: '#337ab7',
        color: '#fff',
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
            button.innerText = '生成中...';

            const pageUrl = window.location.href;

            const response = await fetch(
                pluginConfig.apiUrl,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        url: pageUrl,
                    }),
                },
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `PDF generation failed (${response.status})\n${errorText}`
                );
            }

            const contentType = response.headers.get('Content-Type');
            if (!contentType?.includes('pdf')) {
                const body = await response.text();
                throw new Error(
                    `Unexpected response type: ${contentType}\n${body}`
                );
            }

            const blob = await response.blob();

            const downloadUrl =
                URL.createObjectURL(blob);

            const link =
                document.createElement('a');

            const pageName =
                decodeURIComponent(
                    location.pathname
                        .replace(/^\/+/, '')
                        .replace(/\//g, '_'),
                );

            link.href = downloadUrl;
            link.download = `${pageName}.pdf`;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            URL.revokeObjectURL(downloadUrl);
        }
        catch (e) {

            console.error(e);

            alert(
                'PDF生成に失敗しました'
            );
        }
        finally {

            button.disabled = false;
            button.innerText = 'PDF出力';
        }
    };

    document.body.appendChild(button);
}

const activate = () => {
    const pluginConfig = getPluginConfig();

    console.log(
        '[unou-pdf-export] apiUrl =',
        pluginConfig?.apiUrl,
    );

    console.log(
        '[unou-pdf-export] activated',
    );

    createPdfButton();

    const observer =
        new MutationObserver(() => {
            createPdfButton();
        });

    observer.observe(
        document.body,
        {
            childList: true,
            subtree: true,
        },
    );
};

const deactivate = () => {
};

(window as any).pluginActivators =
    (window as any).pluginActivators || {};

(window as any).pluginActivators[
    config.name
] = {
    activate,
    deactivate,
};

activate();