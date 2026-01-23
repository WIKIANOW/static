let user = JSON.parse(localStorage.getItem('st_user'));
let selectedPlatform = 'discord';
let isPublicFile = false;
let viewMode = localStorage.getItem('viewMode') || 'grid';
let filesData = [];
let currentPage = 1;
let isLoading = false;
let hasMore = true;
let currentQ = "";
let selectedServerId = '';
let serversList = [];
let currentEditingUser = '';

const iconConfig = {
    'js': { icon: 'fab fa-js-square', color: 'text-yellow-400' },
    'css': { icon: 'fab fa-css3-alt', color: 'text-blue-400' },
    'html': { icon: 'fab fa-html5', color: 'text-orange-500' },
    'py': { icon: 'fab fa-python', color: 'text-sky-500' },
    'sql': { icon: 'fas fa-database', color: 'text-emerald-400' },
    'doc': { icon: 'fas fa-file-word', color: 'text-blue-500' },
    'docx': { icon: 'fas fa-file-word', color: 'text-blue-500' },
    'xls': { icon: 'fas fa-file-excel', color: 'text-emerald-500' },
    'xlsx': { icon: 'fas fa-file-excel', color: 'text-emerald-500' },
    'pdf': { icon: 'fas fa-file-pdf', color: 'text-rose-500' }
};

async function loadServers() {
    try {
        const res = await fetch('/api/servers', { headers: { 'x-user-data': JSON.stringify(user) } });
        serversList = await res.json();
        const select = document.getElementById('serverSelect');

        if (serversList.length > 0) {
            select.innerHTML = serversList.map(s => `
                      <option value="${s.server_id}">
                          ${s.type === 'discord' ? 'DS' : 'TG'} | ${s.server_name.toUpperCase()}
                      </option>
                  `).join('');
            selectedServerId = serversList[0].server_id;
            updateHintText(serversList[0].type);
        } else {
            select.innerHTML = '<option value="">KHÔNG CÓ SERVER</option>';
        }
    } catch (err) {
        console.error("Lỗi tải server:", err);
    }
}

function updateHintText(type) {
    const hint = document.getElementById('hintText');
    hint.innerText = type === 'telegram' ? 'Hỗ trợ tối đa 50MB (Telegram)' : 'Hỗ trợ tối đa 25MB (Discord)';
}

document.getElementById('serverSelect').onchange = (e) => {
    selectedServerId = e.target.value;
    const s = serversList.find(x => x.server_id === selectedServerId);
    if (s) updateHintText(s.type);
};

document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});
function updateAuthUI() {
    const navRight = document.getElementById('navRight');
    const tabSwitcher = document.getElementById('tabSwitcher');
    const tabUsers = document.getElementById('tabUsers');
    const tabServers = document.getElementById('tabServers');

    if (user) {
        navRight.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="text-right hidden sm:block">
                    <p class="text-[10px] font-extrabold dark:text-slate-200 uppercase">${user.fullname}</p>
                    <p class="text-[9px] text-indigo-500 font-bold">${user.role.toUpperCase()}</p>
                </div>
                <button onclick="logout()" class="w-11 h-11 bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-500 transition-all"><i class="fas fa-power-off"></i></button>
            </div>`;
        tabSwitcher.classList.remove('hidden');
        tabSwitcher.classList.add('flex');
        user.role === 'admin' ? tabUsers.classList.remove('hidden') : tabUsers.classList.add('hidden');
        user.role === 'admin' ? tabServers.classList.remove('hidden') : tabServers.classList.add('hidden');
    } else {
        navRight.innerHTML = `
            <button onclick="document.getElementById('loginModal').classList.remove('hidden')" 
                    class="bg-indigo-600 text-white px-7 py-3 rounded-xl text-[10px] font-bold uppercase shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all">
                Đăng nhập
            </button>`;
        tabSwitcher.classList.add('hidden');
    }
    switchTab('files');
}

// 2. Chuyển đổi giữa các Tab
function switchTab(tabId) {
    const config = {
        'files': { s: 'sectionFiles', t: 'tabFiles' },
        'upload': { s: 'sectionUpload', t: 'tabUpload' },
        'users': { s: 'sectionUsers', t: 'tabUsers' },
        'servers': { s: 'sectionServers', t: 'tabServers' }
    };

    Object.keys(config).forEach(key => {
        const section = document.getElementById(config[key].s);
        const tabBtn = document.getElementById(config[key].t);
        if (section) section.classList.add('hidden');
        if (tabBtn) {
            tabBtn.classList.remove('text-indigo-600', 'border-b-2', 'border-indigo-600');
            tabBtn.classList.add('text-slate-400');
        }
    });

    const active = config[tabId];
    if (active) {
        document.getElementById(active.s).classList.remove('hidden');
        const btn = document.getElementById(active.t);
        btn.classList.add('text-indigo-600', 'border-b-2', 'border-indigo-600');
        btn.classList.remove('text-slate-400');
    }

    // Tự động load dữ liệu
    if (tabId === 'files') loadFiles();
    if (tabId === 'upload' && user) loadServers();
    if (tabId === 'users' && user?.role === 'admin') loadUsers();
    if (tabId === 'servers') loadServersList();
}

async function loadUsers() {
    try {
        const res = await fetch('/api/users', {
            headers: { 'x-user-data': JSON.stringify(user) }
        });
        const users = await res.json();

        userTableBody.innerHTML = users.map(u => `
            <tr class="border-b border-slate-50 hover:bg-slate-600 transition-colors">
                <td class="py-5">${u.fullname}</td>
                <td class="py-5">${u.username}</td>
                <td class="py-5">
                    <span class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-extrabold">
                        ${u.role.toUpperCase()}
                    </span>
                </td>
                <td class="py-5 text-right space-x-2">
                    <button onclick="openPermModal('${u.username}')" 
                            class="text-amber-500 hover:text-amber-700 px-3 transition-colors" 
                            title="Phân quyền server">
                        <i class="fas fa-shield-alt"></i>
                    </button>
                    
                    <button onclick="delUser('${u.username}')" 
                            class="text-rose-400 hover:text-rose-600 px-3 transition-colors">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Lỗi tải người dùng:", err);
    }
}

async function submitUser() {
    const payload = { fullname: u_fullname.value, username: u_username.value, password: u_password.value, role: u_role.value };
    if (!payload.username || !payload.password) return showAlert('error', 'Thiếu thông tin!', 2000);
    const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-data': JSON.stringify(user) },
        body: JSON.stringify(payload)
    });
    if (res.ok) { document.getElementById('userModal').classList.add('hidden'); loadUsers(); }
}

async function delUser(un) {
    showConfirmModal('Xóa thành viên này?', async () => {
        await fetch(`/api/users?username=${un}`, { method: 'DELETE', headers: { 'x-user-data': JSON.stringify(user) } });
        loadUsers();
    });
}

function logout() { localStorage.clear(); location.reload(); }
searchInput.oninput = (e) => {
    hasMore = true;
    loadFiles(e.target.value, false);
};

function setPlatform(p) {
    selectedPlatform = p;
    document.getElementById('pDiscord').className = p === 'discord' ? 'px-6 rounded-lg text-[10px] font-bold btn-toggle-active transition-all' : 'px-6 rounded-lg text-[10px] font-bold text-slate-400 transition-all';
    document.getElementById('pTelegram').className = p === 'telegram' ? 'px-6 rounded-lg text-[10px] font-bold btn-toggle-active transition-all' : 'px-6 rounded-lg text-[10px] font-bold text-slate-400 transition-all';
    document.getElementById('hintText').innerText = p === 'telegram' ? 'Hỗ trợ tối đa 50MB (Telegram)' : 'Hỗ trợ tối đa 25MB (Discord)';
}

function setIsPublic(v) {
    isPublicFile = v;
    document.getElementById('vPrivate').className = !v ? 'flex-1 px-6 rounded-lg text-[10px] font-bold btn-toggle-active transition-all' : 'flex-1 px-6 rounded-lg text-[10px] font-bold text-slate-400 transition-all';
    document.getElementById('vPublic').className = v ? 'flex-1 px-6 rounded-lg text-[10px] font-bold btn-toggle-active transition-all' : 'flex-1 px-6 rounded-lg text-[10px] font-bold text-slate-400 transition-all';
}

document.addEventListener('DOMContentLoaded', () => {
    updateViewButtons();
});

function updateViewButtons() {
    const btnGrid = document.getElementById('btnGrid');
    const btnList = document.getElementById('btnList');
    if (!btnGrid || !btnList) return;
    const activeClasses = ['btn-toggle-active'];
    const inactiveClasses = ['text-slate-400'];
    if (viewMode === 'grid') {
        btnGrid.classList.add(...activeClasses);
        btnGrid.classList.remove(...inactiveClasses);
        btnList.classList.add(...inactiveClasses);
        btnList.classList.remove(...activeClasses);
    } else {
        btnList.classList.add(...activeClasses);
        btnList.classList.remove(...inactiveClasses);
        btnGrid.classList.add(...inactiveClasses);
        btnGrid.classList.remove(...activeClasses);
    }
}

function setViewMode(m) {
    viewMode = m;
    localStorage.setItem('viewMode', viewMode);
    updateViewButtons();
    renderFiles();
}

async function loadFiles(q = "", isAppend = false) {
    if (isLoading || (!hasMore && isAppend)) return;
    isLoading = true;
    currentQ = q;
    if (!isAppend) {
        currentPage = 1;
        filesData = [];
    }
    document.getElementById('loadSpinner').classList.remove('hidden');
    const res = await fetch(`/list?q=${q}&page=${currentPage}`, {
        headers: user ? { 'x-user-data': JSON.stringify(user) } : {}
    });
    const result = await res.json();
    filesData = isAppend ? [...filesData, ...result.data] : result.data;
    hasMore = result.hasMore;
    renderFiles();
    isLoading = false;
    document.getElementById('loadSpinner').classList.add('hidden');
    if (hasMore) currentPage++;
}

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMore && !isLoading) {
        loadFiles(currentQ, true);
    }
}, { threshold: 0.5 });
observer.observe(document.getElementById('scrollEnd'));

function renderFiles() {
    const grid = document.getElementById('grid');
    if (viewMode === 'list') {
        grid.className = "flex flex-col gap-3";
        grid.innerHTML = filesData.map(f => {
            const serverInfo = `
                <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[8px] text-slate-500 font-bold uppercase border border-slate-200 dark:border-slate-700">
                    <i class="${f.server_type === 'discord' ? 'fab fa-discord' : 'fab fa-telegram'}"></i>
                    ${f.server_name || 'Hệ thống'}
                </span>
            `;
            const fileExt = f.name.split('.').pop().toLowerCase();
            let iconHtml = '<i class="fas fa-file-alt text-4xl text-slate-300"></i>';
            if (f.type?.includes('image')) iconHtml = '<i class="fa-regular fa-file-image text-4xl text-slate-300"></i>';
            else if (f.type?.includes('video')) iconHtml = '<i class="fa-regular fa-file-video text-4xl text-slate-300"></i>';
            else if (iconConfig[fileExt]) iconHtml = `<i class="${iconConfig[fileExt].icon} ${iconConfig[fileExt].color} text-4xl"></i>`;
            const canControl = (user && (user.role === 'admin' || user.username === f.owner));
            const view = `/download?id=${f.id}&hash=${f.hash}`;
            const privacyIcon = f.is_public === 1 ?
                '<span class="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded text-[8px] font-bold"><i class="fas fa-globe-asia"></i> PUBLIC</span>' :
                '<span class="text-orange-500 bg-orange-50 px-2 py-0.5 rounded text-[8px] font-bold"><i class="fas fa-lock"></i> PRIVATE</span>';
            return `
                <div onclick="handleFileClick('${view}', '${f.type}', '${f.name}')" class="group dark:bg-slate-900 dark:border-slate-800 rounded-2xl border border-slate-100 p-3 flex items-center gap-4 cursor-pointer hover:border-indigo-400 transition-all">
                    ${canControl ? `
                        <div onclick="event.stopPropagation()" class="flex-shrink-0 ml-1">
                            <input type="checkbox" value="${f.id}" class="file-checkbox w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer">
                        </div>
                    ` : '<div class="w-4 ml-1"></div>'}
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400">${iconHtml}</div>
                    <div class="flex-1 min-w-0">
                        <p class="text-[11px] font-bold truncate dark:text-slate-200 uppercase">${privacyIcon} ${f.name}</p>
                        <span class="text-[9px] text-slate-400 uppercase font-bold">${(f.size / 1024 / 1024).toFixed(2)} MB ● ${f.owner_name || 'Guest'} ● ${serverInfo}</span>
                    </div>
                    <div class="flex gap-4 px-2 transition-all" onclick="event.stopPropagation()">
                        <button onclick="event.stopPropagation(); copyShareLink('${view}', '${f.name}')" class="text-indigo-500 hover:text-indigo-600 p-1"><i class="fas fa-share-alt"></i></button>
                        <a href="${view}" download="${f.name}" class="text-emerald-500 hover:text-emerald-600 p-1"><i class="fas fa-download"></i></a>
                        ${(user && (user.role === 'admin' || user.username === f.owner)) ? `<button onclick="delFile('${f.id}')" class="text-rose-500 hover:text-rose-600 p-1"><i class="fas fa-trash-alt"></i></button>` : ''}
                    </div>
                </div>`;
        }).join('');
    } else {
        grid.className = "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6";
        grid.innerHTML = filesData.map(f => {
            const serverInfo = `
                <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[8px] text-slate-500 font-bold uppercase border border-slate-200 dark:border-slate-700">
                    <i class="${f.server_type === 'discord' ? 'fab fa-discord' : 'fab fa-telegram'}"></i>
                    ${f.server_name || 'Hệ thống'}
                </span>
            `;
            const canControl = (user && (user.role === 'admin' || user.username === f.owner));
            const view = `/download?id=${f.id}&hash=${f.hash}`;
            const isImg = f.type?.includes('image');
            const isVid = f.type?.includes('video');
            const fileExt = f.name.split('.').pop().toLowerCase();
            let media = '<i class="fas fa-file-alt text-slate-200 text-4xl"></i>';
            if (isImg) media = `<img src="${view}" class="w-full h-full object-cover">`;
            else if (isVid) media = `<div class="relative w-full h-full"><video src="${view}#t=0.1" class="w-full h-full object-cover"></video><div class="absolute inset-0 flex items-center justify-center text-white bg-black/10"><i class="fas fa-play text-xs"></i></div></div>`;
            else if (iconConfig[fileExt]) media = `<i class="${iconConfig[fileExt].icon} ${iconConfig[fileExt].color} text-4xl"></i>`;
            const privacyIcon = f.is_public === 1 ?
                '<span class="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded text-[8px] font-bold"><i class="fas fa-globe-asia"></i> PUBLIC</span>' :
                '<span class="text-orange-500 bg-orange-50 px-2 py-0.5 rounded text-[8px] font-bold"><i class="fas fa-lock"></i> PRIVATE</span>';
            return `
                <div onclick="handleFileClick('${view}', '${f.type}', '${f.name}')" class="group dark:bg-slate-900 dark:border-slate-800 rounded-[1rem] border border-slate-100 shadow-sm overflow-hidden relative cursor-pointer hover:border-indigo-400 transition-all flex flex-col h-80">
                    ${canControl ? `
                        <div class="absolute top-3 left-3 z-20" onclick="event.stopPropagation()">
                            <input type="checkbox" value="${f.id}" class="file-checkbox w-4 h-4 rounded border-slate-300 text-indigo-600 cursor-pointer shadow-sm">
                        </div>
                    ` : ''}
                    <div class="h-64 bg-slate-50 dark:bg-slate-950 flex items-center justify-center flex-shrink-0">${media}</div>
                    <div class="absolute top-3 right-3">${privacyIcon}</div>
                    <div class="relative group p-4 flex-1 min-w-0 flex flex-col justify-center overflow-hidden">
                        <p class="text-center text-[9px] font-extrabold truncate dark:text-slate-200 uppercase mb-1">${f.name}</p>
                        <span class="text-center text-[9px] text-slate-400 font-bold uppercase tracking-tighter">${(f.size / 1024 / 1024).toFixed(2)} MB ● ${f.owner_name || 'Guest'} ● ${serverInfo}</span>
                        <div class="absolute inset-0 bg-white dark:bg-slate-900 dark:border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        <div class="absolute inset-0 flex justify-center items-center gap-3 opacity-0 group-hover:opacity-100 transition-all z-10" onclick="event.stopPropagation()">
                            <button onclick="copyShareLink('${view}', '${f.name}')" class="w-7 h-7 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform shadow-sm" title="Share"><i class="fas fa-share-alt text-[10px]"></i></button>
                            <a href="${view}" download="${f.name}" class="w-7 h-7 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform shadow-sm"><i class="fas fa-download text-[10px]"></i></a>
                            ${(user && (user.role === 'admin' || user.username === f.owner)) ? `<button onclick="delFile('${f.id}')" class="w-7 h-7 bg-rose-50 dark:bg-rose-500/20 text-rose-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform shadow-sm"><i class="fas fa-trash-alt text-[10px]"></i></button>` : ''}
                        </div>
                    </div>
                </div>`;
        }).join('');
    }
}

async function copyShareLink(url, filename) {
    const fullLink = window.location.origin + url;
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(fullLink);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = fullLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        showAlert('success', `Đã sao chép link: ${filename.substring(0, 15)}...`, 2000);
    } catch (err) {
        console.error('Lỗi khi copy:', err);
        showAlert('error', 'Không thể sao chép liên kết!');
    }
}

async function handleFileClick(url, type, name) {
    const ext = name.split('.').pop().toLowerCase();
    const textExts = ['txt', 'log', 'py', 'js', 'css', 'html', 'json', 'md', 'php', 'sql', 'yaml', 'env'];
    const officeExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
    const isText = type.includes('text') || textExts.includes(ext);
    const isOffice = officeExtensions.includes(ext);
    const modal = document.getElementById('previewModal');
    const content = document.getElementById('previewContent');
    content.innerHTML = '<div class="text-white animate-pulse font-bold text-[10px] uppercase">Đang chuẩn bị dữ liệu...</div>';
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    if (type.includes('image')) {
        content.innerHTML = `<img src="${url}" class="max-h-[90vh] max-w-full rounded-2xl shadow-2xl animate-in zoom-in-95">`;
    } else if (type.includes('video')) {
        content.innerHTML = `<video src="${url}" controls autoplay class="max-h-[90vh] w-full max-w-5xl rounded-2xl shadow-2xl bg-black"></video>`;
    } else if (ext === 'pdf') {
        content.innerHTML = `<iframe src="${url}" class="w-full max-w-6xl h-[90vh] rounded-2xl border-0 shadow-2xl bg-white"></iframe>`;
    } else if (isOffice) {
        const fullUrl = window.location.origin + url;
        const previewUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fullUrl)}&wdEmbed=1`;
        content.innerHTML = `<iframe src="${previewUrl}" class="w-full max-w-6xl h-[90vh] rounded-2xl border-0 shadow-2xl bg-white"></iframe>`;
    } else if (isText) {
        const txtRes = await fetch(url);
        const text = await txtRes.text();
        content.innerHTML = `
            <div class="text-preview-container animate-in zoom-in-95">
                <div class="text-preview-header">
                    <div class="flex items-center gap-3 overflow-hidden">
                        <div class="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0"><i class="fas fa-file-code"></i></div>
                        <span class="text-slate-300 font-extrabold text-[11px] truncate uppercase tracking-widest">${name}</span>
                    </div>
                    <button id="btnCopyText" class="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all shadow-lg shadow-indigo-600/20">Sao chép</button>
                </div>
                <div class="text-preview-body">
                    <pre class="code-block whitespace-pre-wrap">${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
                </div>
            </div>`;
        const copyBtn = document.getElementById('btnCopyText');
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(text);
            copyBtn.textContent = 'ĐÃ COPY!';
            copyBtn.classList.replace('bg-indigo-600', 'bg-emerald-500');
            setTimeout(() => {
                copyBtn.textContent = 'SAO CHÉP';
                copyBtn.classList.replace('bg-emerald-500', 'bg-indigo-600');
            }, 2000);
        };
    }
}

function closePreview() {
    document.getElementById('previewModal').classList.add('hidden');
    document.getElementById('previewContent').innerHTML = '';
    document.body.style.overflow = 'auto';
}

fileInput.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!selectedServerId) return showAlert('error', 'Vui lòng chọn Server lưu trữ!', 2000);
    upNormal.classList.add('hidden');
    upLoading.classList.remove('hidden');
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`/upload?server_id=${selectedServerId}&is_public=${isPublicFile}`, {
        method: 'POST',
        headers: { 'x-user-data': JSON.stringify(user) },
        body: fd
    });
    if (res.ok) {
        showAlert('success', 'Tải lên thành công!', 2000);
        setTimeout(() => location.reload(), 1000);
    } else {
        showAlert('error', 'Tải lên thất bại!', 2000);
        upNormal.classList.remove('hidden');
        upLoading.classList.add('hidden');
    }
};

btnLoginAction.onclick = async () => {
    const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ username: u.value, password: p.value }) });
    if (res.ok) { localStorage.setItem('st_user', JSON.stringify((await res.json()).user)); location.reload(); }
    else showAlert('error', 'Lỗi: Sai tài khoản hoặc mật khẩu', 2000);
};

function updateBatchButton() {
    const selectedIds = Array.from(document.querySelectorAll('.file-checkbox:checked')).map(cb => cb.value);
    const btn = document.getElementById('btnDeleteBatch');
    const countSpan = document.getElementById('selectedCount');
    if (selectedIds.length > 0) {
        btn.classList.remove('hidden');
        countSpan.innerText = selectedIds.length;
    } else {
        btn.classList.add('hidden');
    }
}

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('file-checkbox')) {
        updateBatchButton();
    }
});

let pendingAction = null;

function showConfirmModal(message, callback) {
    const modal = document.getElementById('confirmModal');
    const msgLabel = document.getElementById('confirmMessage');
    const executeBtn = document.getElementById('confirmExecuteBtn');
    msgLabel.innerText = message;
    modal.classList.remove('hidden');
    executeBtn.onclick = async () => {
        await callback();
        closeConfirmModal();
    };
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.add('hidden');
}

function delFile(id) {
    showConfirmModal("Bạn có chắc chắn muốn xóa tệp này không?", async () => {
        await fetch('/delete?id=' + id, { method: 'DELETE', headers: { 'x-user-data': JSON.stringify(user) } })
        loadFiles(currentQ, false);
    });
}

document.getElementById('btnDeleteBatch').onclick = () => {
    const selectedIds = Array.from(document.querySelectorAll('.file-checkbox:checked')).map(cb => cb.value);
    if (selectedIds.length === 0) return;
    showConfirmModal(`Bạn có chắc chắn muốn xóa ${selectedIds.length} tệp đã chọn?`, async () => {
        try {
            const res = await fetch('/delete-batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-user-data': JSON.stringify(user) },
                body: JSON.stringify({ ids: selectedIds })
            });
            if (res.ok) {
                loadFiles(currentQ, false);
                document.getElementById('btnDeleteBatch').classList.add('hidden');
            } else {
                showAlert('error', "Có lỗi xảy ra khi xóa.", 2000);
            }
        } catch (err) {
            showAlert('error', `Lỗi kết nối: ${err}`, 2000);
        }
    });
};

loadFiles();
if (user) {
    loadServers();
}

async function openPermModal(username) {
    currentEditingUser = username;
    document.getElementById('permUserTitle').innerText = username;
    document.getElementById('permModal').classList.remove('hidden');

    // 1. Lấy tất cả server hiện có
    const allServersRes = await fetch('/api/servers', { headers: { 'x-user-data': JSON.stringify(user) } });
    const allServers = await allServersRes.json();

    // 2. Lấy quyền hiện tại của user này
    const userPermsRes = await fetch(`/api/user-permissions?username=${username}`, { headers: { 'x-user-data': JSON.stringify(user) } });
    const userPerms = await userPermsRes.json();
    const activeIds = userPerms.map(p => p.server_id);

    // 3. Render danh sách checkbox
    const container = document.getElementById('serverCheckboxes');
    container.innerHTML = allServers.map(s => `
        <label class="flex items-center gap-3 p-3 border dark:border-slate-800 rounded-xl cursor-pointer hover:bg-slate-600 transition-colors">
            <input type="checkbox" name="serverPerm" value="${s.server_id}" ${activeIds.includes(s.server_id) ? 'checked' : ''} class="w-5 h-5 accent-indigo-500">
            <div class="flex-1">
                <p class="text-sm font-bold">${s.server_name}</p>
                <p class="text-[10px] opacity-60">${s.type.toUpperCase()}</p>
            </div>
        </label>
    `).join('');
}

async function savePermissions() {
    const selected = Array.from(document.querySelectorAll('input[name="serverPerm"]:checked')).map(i => i.value);

    const res = await fetch('/api/assign-servers', {
        method: 'POST',
        headers: { 'x-user-data': JSON.stringify(user), 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUsername: currentEditingUser, serverIds: selected })
    });

    if (res.ok) {
        showAlert('success', 'Đã cập nhật quyền truy cập');
        closePermModal();
    }
}

function closePermModal() {
    document.getElementById('permModal').classList.add('hidden');
}

// Load danh sách Server
async function loadServersList() {
    const res = await fetch('/api/servers', { headers: { 'x-user-data': JSON.stringify(user) } });
    const data = await res.json();
    document.getElementById('serverTableBody').innerHTML = data.map(s => `
        <tr class="border-b dark:border-slate-800">
            <td class="p-4 text-indigo-500">${s.server_id}</td>
            <td class="p-4">${s.server_name}</td>
            <td class="p-4">${s.type}</td>
            <td class="p-4 text-slate-400 max-w-60 overflow-hidden">${s.mapping}</td>
            <td class="p-4 text-slate-400 font-normal">${s.created_at}</td>
            <td class="p-4 text-right">
                <button onclick="delServer('${s.server_id}')" class="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-all">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Thêm Server mới
async function addServer() {
    const server_id = document.getElementById('newSrvId').value;
    const server_name = document.getElementById('newSrvName').value;
    const server_type = newSrvType.value;
    const mapping = document.getElementById('newSrvMapping').value;

    const res = await fetch('/api/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-data': JSON.stringify(user) },
        body: JSON.stringify({ server_id, server_name, server_type, mapping })
    });

    if (res.ok) {
        showAlert('success', 'Đã thêm Server');
        document.getElementById('serverModal').classList.add('hidden');
        loadServersList();
    }
}

// Xóa Server (Theo trình tự dọn dẹp DB)
async function delServer(id) {
    if (!confirm(`CẢNH BÁO: Xóa Server "${id}" sẽ xóa toàn bộ FILE và QUYỀN TRUY CẬP liên quan. Bạn chắc chắn chứ?`)) return;
    try {
        const res = await fetch('/api/servers', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'x-user-data': JSON.stringify(user) },
            body: JSON.stringify({ server_id: id })
        });

        if (res.ok) {
            showAlert('success', 'Đã xóa Server và dữ liệu liên quan');
            loadServersList();
        } else {
            const err = await res.json();
            showAlert('error', err.error);
        }
    } catch (e) { showAlert('error', 'Lỗi kết nối'); }
}


/**
@param {string} type - Loại: 'success' | 'error' | 'info'
@param {string} message - Nội dung thông báo
@param {number} duration - Thời gian hiển thị (ms), mặc định 2000ms
*/

function showAlert(type, message, duration = 2000) {
    // 1. Tạo container nếu chưa có
    let container = document.getElementById('alert-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'alert-container';
        container.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none';
        document.body.appendChild(container);
    }
    const configs = {
        success: { bg: 'bg-emerald-500', icon: 'fa-check-circle' },
        error: { bg: 'bg-rose-500', icon: 'fa-exclamation-triangle' },
        info: { bg: 'bg-indigo-500', icon: 'fa-info-circle' }
    };
    const config = configs[type] || configs.info;
    const alert = document.createElement('div');
    alert.className = `
        flex items-center gap-3 px-4 py-3 rounded-2xl text-white shadow-2xl 
        transform translate-x-full opacity-0 transition-all duration-500 ease-out 
        pointer-events-auto min-w-[280px] ${config.bg}
    `;
    alert.innerHTML = `
        <i class="fas ${config.icon} text-lg"></i>
        <div class="flex-1">
            <p class="text-xs font-bold uppercase tracking-wider opacity-80">${type}</p>
            <p class="text-sm font-medium">${message}</p>
        </div>
        <button class="ml-2 hover:opacity-70 transition-opacity" onclick="this.parentElement.remove()">
            <i class="fas fa-times text-xs"></i>
        </button>
    `;
    container.appendChild(alert);
    setTimeout(() => {
        alert.classList.remove('translate-x-full', 'opacity-0');
    }, 10);

    setTimeout(() => {
        alert.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => alert.remove(), 500);
    }, duration);
}
