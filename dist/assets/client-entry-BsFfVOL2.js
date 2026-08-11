const h="growi-plugin-pdf-export",y={name:h},p='<span class="material-symbols-outlined me-1">picture_as_pdf</span>PDF出力',U=`
<span
    class="spinner-border spinner-border-sm me-2"
    role="status"
    aria-hidden="true">
</span>
生成中...
`;function f(){return window.GROWI_PLUGIN_PDF_EXPORT_CONFIG}function x(){if(document.getElementById("unou-pdf-export-style"))return;const e=document.createElement("style");e.id="unou-pdf-export-style",e.textContent=`
        #unou-pdf-export {
            color: var(--bs-secondary-color);
            
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
    `,document.head.appendChild(e)}function m(){if(document.getElementById("unou-pdf-export"))return;const e=document.createElement("button");e.id="unou-pdf-export",e.className="shadow-none btn btn-seen-user border-0 d-flex align-items-center",e.innerHTML=p,Object.assign(e.style,{cursor:"pointer"}),e.onclick=async()=>{const t=f();if(!(t!=null&&t.apiUrl)){alert("PDF API URLが設定されていません");return}try{e.disabled=!0,e.innerHTML=U;const s=window.location.href,o=await fetch(t.apiUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:s})});if(!o.ok){const d=await o.text();throw new Error(`PDF generation failed (${o.status})
${d}`)}const r=o.headers.get("Content-Type");if(!(r!=null&&r.includes("pdf"))){const d=await o.text();throw new Error(`Unexpected response type: ${r}
${d}`)}const g=await o.blob(),i=URL.createObjectURL(g),n=document.createElement("a"),w=decodeURIComponent(location.pathname.replace(/^\/+/,"").replace(/\//g,"_"));n.href=i;const c=o.headers.get("Content-Disposition");let l=`${w}.pdf`;const u=c==null?void 0:c.match(/filename\*=UTF-8''(.+)$/);u&&(l=decodeURIComponent(u[1])),n.download=l,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(i)}catch(s){console.error(s),alert("PDF生成に失敗しました")}finally{e.disabled=!1,e.innerHTML=p}};const a=document.querySelector('[class*="grw-page-controls"]');if(a){const t=document.querySelector(".grw-page-item-control");t!=null?t.insertAdjacentElement("afterend",e):a.appendChild(e)}}const b=()=>{x();const e=f();console.log("[unou-pdf-export] apiUrl =",e==null?void 0:e.apiUrl),console.log("[unou-pdf-export] activated"),m(),new MutationObserver(()=>{m()}).observe(document.body,{childList:!0,subtree:!0})},v=()=>{};window.pluginActivators=window.pluginActivators||{};window.pluginActivators[y.name]={activate:b,deactivate:v};b();
