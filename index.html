javascript:(function(){
    /* 既に開いている場合は削除 */
    const existing = document.getElementById('classi-custom-editor');
    if (existing) { existing.remove(); return; }

    /* UIの構築 */
    const container = document.createElement('div');
    container.id = 'classi-custom-editor';
    container.style = 'position:fixed;top:10px;right:10px;width:450px;height:90vh;background:white;z-index:999999;box-shadow:-5px 0 20px rgba(0,0,0,0.2);border-radius:12px;display:flex;flex-direction:column;font-family:sans-serif;overflow:hidden;border:1px solid #ccc;';

    /* ヘッダー */
    const header = document.createElement('div');
    header.style = 'background:#005bac;color:white;padding:15px;display:flex;justify-content:space-between;align-items:center;font-weight:bold;';
    header.innerHTML = '<span>Classi 爆速エディタ</span><button id="close-editor" style="background:none;border:none;color:white;cursor:pointer;font-size:20px;">×</button>';
    container.appendChild(header);

    /* コンテンツエリア */
    const content = document.createElement('div');
    content.style = 'flex:1;overflow-y:auto;padding:20px;background:#f8f9fa;';
    content.innerHTML = `
        <div style="margin-bottom:15px;">
            <label style="display:block;font-size:12px;font-weight:bold;color:#666;">日付</label>
            <input type="date" id="c-date" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;">
        </div>
        <div id="c-subjects" style="margin-bottom:15px;"></div>
        <div style="margin-bottom:15px;">
            <label style="display:block;font-size:12px;font-weight:bold;color:#666;">メッセージ</label>
            <textarea id="c-msg" style="width:100%;height:60px;padding:8px;border:1px solid #ddd;border-radius:4px;"></textarea>
        </div>
        <button id="c-submit" style="width:100%;background:#28a745;color:white;border:none;padding:12px;border-radius:6px;font-weight:bold;cursor:pointer;">直接送信する</button>
        <div id="c-status" style="margin-top:10px;font-size:12px;text-align:center;font-weight:bold;"></div>
    `;
    container.appendChild(content);
    document.body.appendChild(container);

    /* データ初期化 */
    const subjects = [
        { id: 34, name: "国語" }, { id: 38, name: "数学" }, { id: 42, name: "英語" },
        { id: 36, name: "理科" }, { id: 40, name: "社会" }, { id: 43, name: "その他" }
    ];
    
    const subjDiv = document.getElementById('c-subjects');
    subjects.forEach(s => {
        const d = document.createElement('div');
        d.style = 'background:white;padding:10px;border-radius:6px;margin-bottom:8px;border:1px solid #eee;';
        d.innerHTML = `
            <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                <span style="font-size:13px;font-weight:bold;">${s.name}</span>
                <input type="number" class="c-min" data-id="${s.id}" placeholder="分" style="width:60px;text-align:right;">
            </div>
            <input type="text" class="c-note" data-id="${s.id}" placeholder="内容" style="width:100%;font-size:12px;padding:4px;border:1px solid #eee;">
        `;
        subjDiv.appendChild(d);
    });

    document.getElementById('c-date').value = new Date().toISOString().split('T')[0];

    /* 閉じる処理 */
    document.getElementById('close-editor').onclick = () => container.remove();

    /* 送信処理 */
    document.getElementById('c-submit').onclick = async function() {
        const status = document.getElementById('c-status');
        status.innerText = "送信中...";
        status.style.color = "#666";

        const payload = {
            activityTimeReports: { awokeAt: null, schoolAt: null, homeAt: null, workStartedAt: null, sleptAt: null },
            satisfactionRate: { timeRating: 3, contentRating: 3 },
            subjectLearningReports: subjects.map(s => ({
                subjectId: s.id,
                learnedMinutes: parseInt(document.querySelector(`.c-min[data-id="${s.id}"]`).value) || null,
                note: document.querySelector(`.c-note[data-id="${s.id}"]`).value || null
            })),
            studentMessage: document.getElementById('c-msg').value,
            date: document.getElementById('c-date').value
        };

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

        try {
            const res = await fetch('https://study.classi.jp/api/study/my_report/form', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': csrfToken
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                status.innerText = "送信成功！反映にはリロードが必要です。";
                status.style.color = "#28a745";
            } else {
                status.innerText = "エラー: " + res.status;
                status.style.color = "#dc3545";
            }
        } catch (e) {
            status.innerText = "通信失敗";
            status.style.color = "#dc3545";
        }
    };
})();
