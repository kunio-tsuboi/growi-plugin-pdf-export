const h="growi-plugin-pdf-export",y={name:h},p='<span class="material-symbols-outlined me-1">picture_as_pdf</span>PDF出力',x=`
<span
    class="spinner-border spinner-border-sm me-2"
    role="status"
    aria-hidden="true">
</span>
生成中...
`;function f(){return window.GROWI_PLUGIN_PDF_EXPORT_CONFIG}function U(){if(document.getElementById("unou-pdf-export-style"))return;const e=document.createElement("style");e.id="unou-pdf-export-style",e.textContent=`
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
    `,document.head.appendChild(e)}function m(){if(document.getElementById("unou-pdf-export"))return;const e=document.createElement("button");e.id="unou-pdf-export",e.className="shadow-none btn btn-seen-user border-0 d-flex align-items-center",e.innerHTML=p,Object.assign(e.style,{cursor:"pointer"}),e.onclick=async()=>{const o=f();if(!(o!=null&&o.apiUrl)){alert("PDF API URLが設定されていません");return}try{e.disabled=!0,e.innerHTML=x;const c=window.location.href,t=await fetch(o.apiUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:c})});if(!t.ok){const d=await t.text();throw new Error(`PDF generation failed (${t.status})
${d}`)}const r=t.headers.get("Content-Type");if(!(r!=null&&r.includes("pdf"))){const d=await t.text();throw new Error(`Unexpected response type: ${r}
${d}`)}const s=t.headers.get("Content-Disposition");console.log("[unou-pdf-export] Content-Disposition =",s),console.log("[unou-pdf-export] response headers =",[...t.headers.entries()]);const g=await t.blob(),i=URL.createObjectURL(g),n=document.createElement("a"),w=decodeURIComponent(location.pathname.replace(/^\/+/,"").replace(/\//g,"_"));n.href=i;let l=`${w}.pdf`;const u=s==null?void 0:s.match(/filename\*=UTF-8''(.+)$/);u&&(l=decodeURIComponent(u[1])),n.download=l,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(i)}catch(c){console.error(c),alert("PDF生成に失敗しました")}finally{e.disabled=!1,e.innerHTML=p}};const a=document.querySelector('[class*="grw-page-controls"]');if(a){const o=document.querySelector(".grw-page-item-control");o!=null?o.insertAdjacentElement("afterend",e):a.appendChild(e)}}const b=()=>{U();const e=f();console.log("[unou-pdf-export] apiUrl =",e==null?void 0:e.apiUrl),console.log("[unou-pdf-export] activated"),m(),new MutationObserver(()=>{m()}).observe(document.body,{childList:!0,subtree:!0})},T=()=>{};window.pluginActivators=window.pluginActivators||{};window.pluginActivators[y.name]={activate:b,deactivate:T};b();
