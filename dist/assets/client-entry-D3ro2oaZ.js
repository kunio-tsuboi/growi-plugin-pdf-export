const f="growi-plugin-pdf-export",g={name:f},i='<span class="material-symbols-outlined me-1">picture_as_pdf</span>PDF出力',w=`
<span
    class="spinner-border spinner-border-sm me-2"
    role="status"
    aria-hidden="true">
</span>
生成中...
`;function u(){return window.GROWI_PLUGIN_PDF_EXPORT_CONFIG}function y(){if(document.getElementById("unou-pdf-export-style"))return;const e=document.createElement("style");e.id="unou-pdf-export-style",e.textContent=`
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
    `,document.head.appendChild(e)}function l(){if(document.getElementById("unou-pdf-export"))return;const e=document.createElement("button");e.id="unou-pdf-export",e.className="shadow-none btn btn-seen-user border-0 d-flex align-items-center",e.innerHTML=i,Object.assign(e.style,{cursor:"pointer"}),e.onclick=async()=>{const t=u();if(!(t!=null&&t.apiUrl)){alert("PDF API URLが設定されていません");return}try{e.disabled=!0,e.innerHTML=w;const s=window.location.href,o=await fetch(t.apiUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:s})});if(!o.ok){const c=await o.text();throw new Error(`PDF generation failed (${o.status})
${c}`)}const r=o.headers.get("Content-Type");if(!(r!=null&&r.includes("pdf"))){const c=await o.text();throw new Error(`Unexpected response type: ${r}
${c}`)}const b=await o.blob(),d=URL.createObjectURL(b),n=document.createElement("a"),m=decodeURIComponent(location.pathname.replace(/^\/+/,"").replace(/\//g,"_"));n.href=d,n.download=`${m}.pdf`,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(d)}catch(s){console.error(s),alert("PDF生成に失敗しました")}finally{e.disabled=!1,e.innerHTML=i}};const a=document.querySelector('[class*="grw-page-controls"]');if(a){const t=document.querySelector(".grw-page-item-control");t!=null?t.insertAdjacentElement("afterend",e):a.appendChild(e)}}const p=()=>{y();const e=u();console.log("[unou-pdf-export] apiUrl =",e==null?void 0:e.apiUrl),console.log("[unou-pdf-export] activated"),l(),new MutationObserver(()=>{l()}).observe(document.body,{childList:!0,subtree:!0})},h=()=>{};window.pluginActivators=window.pluginActivators||{};window.pluginActivators[g.name]={activate:p,deactivate:h};p();
