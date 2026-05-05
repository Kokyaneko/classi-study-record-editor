javascript:(function(){
    const existing = document.getElementById('classi-custom-editor');
    if (existing) { existing.remove(); return; }

    const container = document.createElement('div');
    container.id = 'classi-custom-editor';
    container.style = 'position:fixed;top:10px;right:10px;width:550px;height:95vh;background:#fff;z-index:999999;box-shadow:0 0 0 2px #000;border-radius:2px;display:flex;flex-direction:column;font-family:"Consolas", "Monaco", "Courier New", "Meiryo", monospace;overflow:hidden;border:2px solid #000;';

    const header = document.createElement('div');
    header.style = 'background:#000;color:#fff;padding:8px 12px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;';
    header.innerHTML = '<span style="font-size:12px;font-weight:bold;letter-spacing:1px;">Classi学習記録エディタ</span><button id="close-editor" style="background:none;border:none;color:#fff;cursor:pointer;font-size:14px;">閉じる(Esc)</button>';
    container.appendChild(header);

    /* タブ制御 */
    const tabNav = document.createElement('div');
    tabNav.style = 'display:flex;background:#333;border-bottom:2px solid #000;';
    tabNav.innerHTML = `
        <button id="tab-ui" style="flex:1;padding:8px;background:#eee;border:none;border-right:2px solid #000;cursor:pointer;font-weight:bold;font-family:monospace;">1:GUI</button>
        <button id="tab-json" style="flex:1;padding:8px;background:#333;color:#ccc;border:none;cursor:pointer;font-weight:bold;font-family:monospace;">2:JSON</button>
    `;
    container.appendChild(tabNav);

    const content = document.createElement('div');
    content.style = 'flex:1;overflow-y:auto;padding:12px;background:#e5e5e5;display:flex;flex-direction:column;';
    container.appendChild(content);

    /* UIエリア */
    const uiArea = document.createElement('div');
    uiArea.id = 'area-ui';
    uiArea.innerHTML = `
        <div style="background:#fff;padding:12px;border:2px solid #000;margin-bottom:12px;">
            <div style="margin-bottom:10px;display:flex;gap:8px;align-items:center;">
                <label style="font-size:11px;font-weight:bold;width:60px;">編集日:</label>
                <input type="text" id="c-date" style="flex:1;padding:4px;border:2px solid #000;outline:none;font-family:monospace;">
            </div>
            <div style="margin-bottom:10px;display:flex;gap:8px;align-items:center;padding-top:8px;border-top:1px dashed #000;">
                <label style="font-size:11px;font-weight:bold;width:60px;color:#005bac;">コピー元:</label>
                <input type="text" id="c-copy-date" placeholder="YYYY-MM-DD" style="flex:1;padding:4px;border:2px solid #000;outline:none;font-family:monospace;">
                <button id="c-load" style="background:#005bac;color:#fff;border:none;padding:4px 12px;font-size:10px;cursor:pointer;font-weight:bold;border:1px solid #000;">データを読み込む</button>
            </div>
            <div style="display:grid;grid-template-columns: 1fr 1fr;gap:8px;">
                <div style="display:flex;align-items:center;"><label style="font-size:9px;width:60px;font-weight:bold;">起床</label><input type="text" id="c-awoke" style="flex:1;padding:3px;border:2px solid #000;outline:none;font-family:monospace;"></div>
                <div style="display:flex;align-items:center;"><label style="font-size:9px;width:60px;font-weight:bold;">登校</label><input type="text" id="c-school" style="flex:1;padding:3px;border:2px solid #000;outline:none;font-family:monospace;"></div>
                <div style="display:flex;align-items:center;"><label style="font-size:9px;width:60px;font-weight:bold;">帰宅</label><input type="text" id="c-home" style="flex:1;padding:3px;border:2px solid #000;outline:none;font-family:monospace;"></div>
                <div style="display:flex;align-items:center;"><label style="font-size:9px;width:60px;font-weight:bold;">学習開始</label><input type="text" id="c-started" style="flex:1;padding:3px;border:2px solid #000;outline:none;font-family:monospace;"></div>
                <div style="grid-column: span 2;display:flex;align-items:center;"><label style="font-size:9px;width:60px;font-weight:bold;">就寝</label><input type="text" id="c-slept" style="flex:1;padding:3px;border:2px solid #000;outline:none;font-family:monospace;"></div>
            </div>
        </div>
        <div style="background:#fff;border:2px solid #000;margin-bottom:12px;overflow:hidden;">
            <table style="width:100%;border-collapse:collapse;font-size:11px;">
                <thead style="background:#000;color:#fff;">
                    <tr>
                        <th style="padding:4px;text-align:left;border-right:2px solid #fff;width:60px;">科目</th>
                        <th style="padding:4px;text-align:center;width:40px;border-right:2px solid #fff;">分</th>
                        <th style="padding:4px;text-align:left;">学習内容</th>
                    </tr>
                </thead>
                <tbody id="c-subjects-body"></tbody>
            </table>
        </div>
        <div style="background:#fff;padding:10px;border:2px solid #000;margin-bottom:12px;">
            <label style="display:block;font-size:10px;font-weight:bold;margin-bottom:4px;">コメント</label>
            <textarea id="c-msg" style="width:100%;height:50px;padding:6px;border:2px solid #000;font-size:11px;font-family:monospace;resize:none;outline:none;box-sizing:border-box;"></textarea>
        </div>
    `;
    content.appendChild(uiArea);

    /* JSONエリア */
    const jsonArea = document.createElement('div');
    jsonArea.id = 'area-json';
    jsonArea.style.display = 'none';
    jsonArea.style.flex = '1';
    jsonArea.innerHTML = `<textarea id="c-json-editor" style="width:100%;height:100%;background:#1e1e1e;color:#85ff00;border:2px solid #000;padding:10px;font-family:monospace;font-size:12px;box-sizing:border-box;outline:none;resize:none;"></textarea>`;
    content.appendChild(jsonArea);

    /* ステータスと送信ボタン */
    const footer = document.createElement('div');
    footer.style = 'padding:12px;background:#e5e5e5;flex-shrink:0;';
    footer.innerHTML = `
        <button id="c-submit" style="width:100%;background:#000;color:#fff;border:none;padding:12px;font-weight:bold;cursor:pointer;font-size:14px;font-family:monospace;letter-spacing:1px;border:2px solid #000;">> 保存</button>
        <div id="c-status" style="margin-top:8px;font-size:10px;text-align:center;font-family:monospace;color:#000;height:14px;font-weight:bold;">INITIALIZING...</div>
    `;
    container.appendChild(footer);
    document.body.appendChild(container);

    /* データモデル */
    const subjects = [
        { id: 34, name: "国語" }, { id: 36, name: "社会" }, { id: 38, name: "数学" },
        { id: 40, name: "理科" }, { id: 42, name: "英語" }, { id: 43, name: "その他" },
        { id: 57, name: "読書" }
    ];
    
    let state = {
        activityTimeReports: { awokeAt: "", schoolAt: "", homeAt: "", workStartedAt: "", sleptAt: "" },
        satisfactionRate: { timeRating: 3, contentRating: 3 },
        subjectLearningReports: subjects.map(s => ({ subjectId: s.id, learnedMinutes: null, note: "" })),
        studentMessage: "",
        date: new Date().toISOString().split('T')[0]
    };

    const tableBody = document.getElementById('c-subjects-body');
    subjects.forEach(s => {
        const tr = document.createElement('tr');
        tr.style = 'border-bottom:2px solid #000;';
        tr.innerHTML = `
            <td style="padding:4px 8px;font-weight:bold;background:#f0f0f0;border-right:2px solid #000;">${s.name}</td>
            <td style="padding:0;border-right:2px solid #000;"><input type="text" class="c-min" data-id="${s.id}" style="width:100%;height:28px;padding:4px;border:none;text-align:right;font-family:monospace;outline:none;box-sizing:border-box;"></td>
            <td style="padding:0;"><input type="text" class="c-note" data-id="${s.id}" style="width:100%;height:28px;padding:4px;border:none;font-family:monospace;outline:none;box-sizing:border-box;"></td>
        `;
        tableBody.appendChild(tr);
    });

    /* 同期関数: State -> UI */
    const syncStateToUI = () => {
        document.getElementById('c-date').value = state.date;
        document.getElementById('c-awoke').value = state.activityTimeReports.awokeAt || "";
        document.getElementById('c-school').value = state.activityTimeReports.schoolAt || "";
        document.getElementById('c-home').value = state.activityTimeReports.homeAt || "";
        document.getElementById('c-started').value = state.activityTimeReports.workStartedAt || "";
        document.getElementById('c-slept').value = state.activityTimeReports.sleptAt || "";
        document.getElementById('c-msg').value = state.studentMessage || "";
        
        subjects.forEach(s => {
            const r = state.subjectLearningReports.find(item => item.subjectId === s.id);
            document.querySelector(`.c-min[data-id="${s.id}"]`).value = r?.learnedMinutes || "";
            document.querySelector(`.c-note[data-id="${s.id}"]`).value = r?.note || "";
        });
        document.getElementById('c-json-editor').value = JSON.stringify(state, null, 2);
    };

    /* 同期関数: UI -> State */
    const syncUIToState = () => {
        state.date = document.getElementById('c-date').value;
        state.activityTimeReports.awokeAt = document.getElementById('c-awoke').value || null;
        state.activityTimeReports.schoolAt = document.getElementById('c-school').value || null;
        state.activityTimeReports.homeAt = document.getElementById('c-home').value || null;
        state.activityTimeReports.workStartedAt = document.getElementById('c-started').value || null;
        state.activityTimeReports.sleptAt = document.getElementById('c-slept').value || null;
        state.studentMessage = document.getElementById('c-msg').value;
        
        subjects.forEach(s => {
            const r = state.subjectLearningReports.find(item => item.subjectId === s.id);
            if(r) {
                const minVal = document.querySelector(`.c-min[data-id="${s.id}"]`).value;
                r.learnedMinutes = minVal === "" ? null : parseInt(minVal);
                r.note = document.querySelector(`.c-note[data-id="${s.id}"]`).value || null;
            }
        });
        document.getElementById('c-json-editor').value = JSON.stringify(state, null, 2);
    };

    const updateStatus = (msg, color = "#000") => {
        const status = document.getElementById('c-status');
        if (status) {
            status.innerText = msg;
            status.style.color = color;
        }
    };

    /* 汎用読込関数 */
    const fetchData = async (targetDate, isAutoLoad = false) => {
        updateStatus(`> データ取得中 (${targetDate})...`);
        try {
            const res = await fetch(`https://study.classi.jp/api/study/my_report/form?date=${targetDate}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (res.ok) {
                const data = await res.json();
                if (isAutoLoad) {
                    state = data;
                } else {
                    const currentDate = state.date;
                    state = data;
                    state.date = currentDate; 
                }
                syncStateToUI();
                updateStatus(isAutoLoad ? "SUCCESS: データ取得完了" : "SUCCESS: コピー完了", "#005bac");
            } else {
                updateStatus(`FETCH_ERROR: ${res.status}`, "#f00");
            }
        } catch (e) {
            updateStatus("CONNECTION_ERROR", "#f00");
        }
    };

    /* 接続テスト用関数 */
    const checkConnection = async () => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        if (!csrfToken) {
            updateStatus("TEST_FAILED: CSRFトークンが見つかりません", "#f00");
            return false;
        }
        updateStatus("TESTING_CONNECTION...");
        try {
            const res = await fetch(`https://study.classi.jp/api/study/my_report/form?date=${state.date}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            if (res.ok) {
                updateStatus("AUTH_CHECK: OK (書き込み可能)", "#008000");
                return true;
            } else {
                updateStatus(`AUTH_CHECK: FAILED (${res.status})`, "#f00");
                return false;
            }
        } catch (e) {
            updateStatus("TEST_ERROR: 接続できません", "#f00");
            return false;
        }
    };

    /* 初期化と自動読込 */
    const init = async () => {
        syncStateToUI();
        const isReady = await checkConnection();
        if (isReady) {
            setTimeout(() => fetchData(state.date, true), 300);
        }
    };

    /* イベントリスナー */
    uiArea.addEventListener('input', syncUIToState);
    document.getElementById('c-json-editor').addEventListener('input', (e) => {
        try {
            state = JSON.parse(e.target.value);
            syncStateToUI();
            updateStatus("JSON_SYNCED", "#008");
        } catch(err) {
            updateStatus("JSON_PARSE_ERROR", "#f00");
        }
    });

    /* タブ切り替え */
    const switchTab = (target) => {
        const btnUi = document.getElementById('tab-ui');
        const btnJson = document.getElementById('tab-json');
        if (target === 'ui') {
            uiArea.style.display = 'block';
            jsonArea.style.display = 'none';
            btnUi.style.background = '#eee'; btnUi.style.color = '#000';
            btnJson.style.background = '#333'; btnJson.style.color = '#ccc';
        } else {
            uiArea.style.display = 'none';
            jsonArea.style.display = 'flex';
            btnJson.style.background = '#eee'; btnJson.style.color = '#000';
            btnUi.style.background = '#333'; btnUi.style.color = '#ccc';
        }
    };
    document.getElementById('tab-ui').onclick = () => switchTab('ui');
    document.getElementById('tab-json').onclick = () => switchTab('json');

    /* 手動コピー読込 */
    document.getElementById('c-load').onclick = () => {
        const copyDate = document.getElementById('c-copy-date').value;
        if(!copyDate) { updateStatus("コピー元日付を入力してください", "#f00"); return; }
        fetchData(copyDate, false);
    };

    /* COMMIT 処理 */
    document.getElementById('c-submit').onclick = async function() {
        updateStatus("> サーバーへ送信中...");
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
        try {
            const res = await fetch('https://study.classi.jp/api/study/my_report/form', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify(state)
            });
            if (res.ok) {
                updateStatus("> 送信完了", "#008");
                window.location.reload();
            } else {
                updateStatus("> 送信エラー: " + res.status, "#f00");
            }
        } catch (e) {
            updateStatus("> 重大な通信エラー", "#f00");
        }
    };

    /* ショートカット */
    container.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') document.getElementById('c-submit').click();
        if (e.ctrlKey && e.key === '1') switchTab('ui');
        if (e.ctrlKey && e.key === '2') switchTab('json');
        if (e.key === 'Escape') container.remove();
    });
    document.getElementById('close-editor').onclick = () => container.remove();

    init();
})();