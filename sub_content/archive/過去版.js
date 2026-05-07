javascript:(function(){
    const d=document,
          q=id=>d.getElementById(id),
          existing=q('classi-custom-editor');
    if(existing){existing.remove();return}

    const c=d.createElement('div');
    c.id='classi-custom-editor';
    c.style='position:fixed;top:10px;right:10px;width:550px;height:95vh;background:#fff;z-index:999999;box-shadow:0 0 0 2px #000;border-radius:2px;display:flex;flex-direction:column;font-family:monospace;overflow:hidden;border:2px solid #000;';

    const h=d.createElement('div');
    h.style='background:#000;color:#fff;padding:8px 12px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;';
    h.innerHTML='<span style="font-size:12px;font-weight:bold;letter-spacing:1px;">STUDY_REPORT_TERMINAL v3.1</span><button id="close-editor" style="background:none;border:none;color:#fff;cursor:pointer;font-size:14px;">[ESC_X]</button>';
    c.appendChild(h);

    const nav=d.createElement('div');
    nav.style='display:flex;background:#333;border-bottom:2px solid #000;';
    nav.innerHTML=`<button id="t1" style="flex:1;padding:8px;background:#eee;border:none;border-right:2px solid #000;cursor:pointer;font-weight:bold;">1:UI_INPUT</button><button id="t2" style="flex:1;padding:8px;background:#333;color:#ccc;border:none;cursor:pointer;font-weight:bold;">2:JSON_RAW</button>`;
    c.appendChild(nav);

    const b=d.createElement('div');
    b.style='flex:1;overflow-y:auto;padding:12px;background:#e5e5e5;display:flex;flex-direction:column;';
    c.appendChild(b);

    const u=d.createElement('div');
    u.id='au';
    u.innerHTML=`
        <div style="background:#fff;padding:12px;border:2px solid #000;margin-bottom:12px;">
            <div style="margin-bottom:10px;display:flex;gap:8px;align-items:center;">
                <label style="font-size:11px;font-weight:bold;width:60px;">報告日付:</label>
                <input type="text" id="cd" style="flex:1;padding:4px;border:2px solid #000;outline:none;">
            </div>
            <div style="margin-bottom:10px;display:flex;gap:8px;align-items:center;padding-top:8px;border-top:1px dashed #000;">
                <label style="font-size:11px;font-weight:bold;width:60px;color:#005bac;">コピー元:</label>
                <input type="text" id="cc" placeholder="YYYY-MM-DD" style="flex:1;padding:4px;border:2px solid #000;outline:none;">
                <button id="cl" style="background:#005bac;color:#fff;border:none;padding:4px 12px;font-size:10px;cursor:pointer;font-weight:bold;border:1px solid #000;">LOAD_FROM_DATE</button>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                ${['起床','登校','帰宅','開始','就寝'].map((n,i)=>`<div style="display:flex;align-items:center;${i==4?'grid-column:span 2':''}"><label style="font-size:9px;width:60px;font-weight:bold;">${n}</label><input type="text" id="c${i}" style="flex:1;padding:3px;border:2px solid #000;outline:none;"></div>`).join('')}
            </div>
        </div>
        <div style="background:#fff;border:2px solid #000;margin-bottom:12px;overflow:hidden;">
            <table style="width:100%;border-collapse:collapse;font-size:11px;">
                <thead style="background:#000;color:#fff;"><tr><th style="padding:4px;text-align:left;width:60px;">科目</th><th style="padding:4px;text-align:center;width:40px;">分</th><th style="padding:4px;text-align:left;">内容</th></tr></thead>
                <tbody id="sb"></tbody>
            </table>
        </div>
        <div style="background:#fff;padding:10px;border:2px solid #000;margin-bottom:12px;">
            <label style="display:block;font-size:10px;font-weight:bold;margin-bottom:4px;">メッセージ</label>
            <textarea id="cm" style="width:100%;height:50px;padding:6px;border:2px solid #000;font-size:11px;resize:none;outline:none;box-sizing:border-box;"></textarea>
        </div>
    `;
    b.appendChild(u);

    const j=d.createElement('div');
    j.id='aj';j.style='display:none;flex:1;';
    j.innerHTML='<textarea id="je" style="width:100%;height:100%;background:#1e1e1e;color:#85ff00;border:2px solid #000;padding:10px;font-size:12px;box-sizing:border-box;outline:none;resize:none;"></textarea>';
    b.appendChild(j);

    const f=d.createElement('div');
    f.style='padding:12px;background:#e5e5e5;';
    f.innerHTML=`<button id="cs" style="width:100%;background:#000;color:#fff;border:none;padding:12px;font-weight:bold;cursor:pointer;font-size:14px;border:2px solid #000;">> RUN_PUT_COMMIT</button><div id="st" style="margin-top:8px;font-size:10px;text-align:center;height:14px;font-weight:bold;">INITIALIZING...</div>`;
    c.appendChild(f);
    d.body.appendChild(c);

    const ss=[{id:34,n:"国語"},{id:36,n:"社会"},{id:38,n:"数学"},{id:40,n:"理科"},{id:42,n:"英語"},{id:43,n:"その他"},{id:57,n:"読書"}];
    let st={activityTimeReports:{awokeAt:"",schoolAt:"",homeAt:"",workStartedAt:"",sleptAt:""},satisfactionRate:{timeRating:3,contentRating:3},subjectLearningReports:ss.map(s=>({subjectId:s.id,learnedMinutes:null,note:""})),studentMessage:"",date:new Date().toISOString().split('T')[0]};

    const tBody=q('sb');
    ss.forEach(s=>{
        const tr=d.createElement('tr');tr.style='border-bottom:2px solid #000;';
        tr.innerHTML=`<td style="padding:4px 8px;font-weight:bold;background:#f0f0f0;border-right:2px solid #000;">${s.n}</td><td style="border-right:2px solid #000;"><input type="text" class="mi" data-id="${s.id}" style="width:100%;border:none;text-align:right;outline:none;"></td><td><input type="text" class="no" data-id="${s.id}" style="width:100%;border:none;outline:none;"></td>`;
        tBody.appendChild(tr);
    });

    const s2u=()=>{
        q('cd').value=st.date;
        ['awokeAt','schoolAt','homeAt','workStartedAt','sleptAt'].forEach((k,i)=>q('c'+i).value=st.activityTimeReports[k]||"");
        q('cm').value=st.studentMessage||"";
        ss.forEach(s=>{
            const r=st.subjectLearningReports.find(x=>x.subjectId===s.id);
            d.querySelector(`.mi[data-id="${s.id}"]`).value=r?.learnedMinutes||"";
            d.querySelector(`.no[data-id="${s.id}"]`).value=r?.note||"";
        });
        q('je').value=JSON.stringify(st,null,2);
    };

    const u2s=()=>{
        st.date=q('cd').value;
        ['awokeAt','schoolAt','homeAt','workStartedAt','sleptAt'].forEach((k,i)=>st.activityTimeReports[k]=q('c'+i).value||null);
        st.studentMessage=q('cm').value;
        ss.forEach(s=>{
            const r=st.subjectLearningReports.find(x=>x.subjectId===s.id);
            if(r){
                const v=d.querySelector(`.mi[data-id="${s.id}"]`).value;
                r.learnedMinutes=v===""?null:parseInt(v);
                r.note=d.querySelector(`.no[data-id="${s.id}"]`).value||null;
            }
        });
        q('je').value=JSON.stringify(st,null,2);
    };

    const up=(m,k="#000")=>{const x=q('st');if(x){x.innerText=m;x.style.color=k}};

    const fd=async(t,a=false)=>{
        up(`> データ取得中 (${t})...`);
        try{
            const r=await fetch(`https://study.classi.jp/api/study/my_report/form?date=${t}`,{headers:{'X-Requested-With':'XMLHttpRequest'}});
            if(r.ok){
                const data=await r.json();
                if(a)st=data;else{const cur=st.date;st=data;st.date=cur}
                s2u();up(a?"SUCCESS: 当日データを取得しました":"SUCCESS: データをコピーしました","#005bac");
            }else up(`FETCH_ERROR: ${r.status}`,"#f00");
        }catch(e){up("CONNECTION_ERROR","#f00")}
    };

    u.oninput=u2s;
    q('je').oninput=e=>{try{st=JSON.parse(e.target.value);s2u();up("JSON_SYNCED","#008")}catch(h){up("JSON_ERR","#f00")}};

    const sw=(z)=>{
        q('au').style.display=z?'block':'none';q('aj').style.display=z?'none':'flex';
        q('t1').style.background=z?'#eee':'#333';q('t1').style.color=z?'#000':'#ccc';
        q('t2').style.background=z?'#333':'#eee';q('t2').style.color=z?'#ccc':'#000';
    };
    q('t1').onclick=()=>sw(1);q('t2').onclick=()=>sw(0);
    q('cl').onclick=()=>fd(q('cc').value);

    q('cs').onclick=async()=>{
        up("> サーバーへ送信中...");
        const t=d.querySelector('meta[name="csrf-token"]')?.content;
        try{
            const r=await fetch('https://study.classi.jp/api/study/my_report/form',{method:'PUT',headers:{'Content-Type':'application/json','X-Requested-With':'XMLHttpRequest','X-CSRF-Token':t},body:JSON.stringify(st)});
            if(r.ok){up("> 送信完了","#008");location.reload()}else up("> 送信エラー: "+r.status,"#f00");
        }catch(e){up("> 重大な通信エラー","#f00")}
    };

    c.onkeydown=e=>{
        if(e.ctrlKey&&e.key==='Enter')q('cs').click();
        if(e.key==='Escape')c.remove();
    };
    q('close-editor').onclick=()=>c.remove();

    s2u();
    setTimeout(()=>fd(st.date,true),300);
})();