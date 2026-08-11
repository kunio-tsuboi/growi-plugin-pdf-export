const f="growi-plugin-pdf-export",w={name:f},d='<span class="material-symbols-outlined me-1">picture_as_pdf</span>PDF出力',g=`
<span
    class="spinner-border spinner-border-sm me-2"
    role="status"
    aria-hidden="true">
</span>
生成中...
`;function p(){return window.GROWI_PLUGIN_PDF_EXPORT_CONFIG}function l(){if(document.getElementById("unou-pdf-export"))return;const e=document.createElement("button");e.id="unou-pdf-export",e.className="shadow-none btn btn-seen-user border-0 d-flex align-items-center",e.innerHTML=d,Object.assign(e.style,{cursor:"pointer"}),e.onclick=async()=>{const t=p();if(!(t!=null&&t.apiUrl)){alert("PDF API URLが設定されていません");return}try{e.disabled=!0,e.innerHTML=g;const s=window.location.href,n=await fetch(t.apiUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:s})});if(!n.ok){const c=await n.text();throw new Error(`PDF generation failed (${n.status})
${c}`)}const r=n.headers.get("Content-Type");if(!(r!=null&&r.includes("pdf"))){const c=await n.text();throw new Error(`Unexpected response type: ${r}
${c}`)}const m=await n.blob(),i=URL.createObjectURL(m),o=document.createElement("a"),b=decodeURIComponent(location.pathname.replace(/^\/+/,"").replace(/\//g,"_"));o.href=i,o.download=`${b}.pdf`,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(i)}catch(s){console.error(s),alert("PDF生成に失敗しました")}finally{e.disabled=!1,e.innerHTML=d}};const a=document.querySelector('[class*="grw-page-controls"]');if(a){const t=document.querySelector(".grw-page-item-control");t!=null?t.insertAdjacentElement("afterend",e):a.appendChild(e)}}const u=()=>{const e=p();console.log("[unou-pdf-export] apiUrl =",e==null?void 0:e.apiUrl),console.log("[unou-pdf-export] activated"),l(),new MutationObserver(()=>{l()}).observe(document.body,{childList:!0,subtree:!0})},h=()=>{};window.pluginActivators=window.pluginActivators||{};window.pluginActivators[w.name]={activate:u,deactivate:h};u();
