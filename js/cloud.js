let user = JSON.parse(localStorage.getItem('st_user'));
let selectedPlatform = 'discord';
let isPublicFile = false;
let viewMode = localStorage.getItem('viewMode') || 'grid';
let filesData = [];
let currentPage = 1;
let isLoading = false;
let hasMore = true;
let currentQ = "";

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

function updateAuthUI() {
    const navRight = document.getElementById('navRight');
    const tabSwitcher = document.getElementById('tabSwitcher');
    if (user) {
        navRight.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="text-right hidden sm:block">
                    <p class="text-[10px] font-extrabold dark:text-slate-200 uppercase">${user.fullname}</p>
                    <p class="text-[9px] text-indigo-500 font-bold">${user.role.toUpperCase()}</p>
                </div>
                <button onclick="logout()" class="w-11 h-11 dark:bg-slate-900 bg-slate-100 text-slate-500 border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"><i class="fas fa-power-off text-xs"></i></button>
            </div>`;
        document.getElementById('adminPanel').classList.remove('hidden');
        if (user.role === 'admin') tabSwitcher.classList.remove('hidden');
    } else {
        navRight.innerHTML = `<button onclick="document.getElementById('loginModal').classList.remove('hidden')" class="bg-indigo-600 text-white px-7 py-3 rounded-xl text-[10px] font-bold uppercase shadow-lg shadow-indigo-600/20 transition-all hover:scale-105">Đăng nhập</button>`;
    }
}

function switchTab(tab) {
    const isFiles = tab === 'files';
    document.getElementById('sectionFiles').classList.toggle('hidden', !isFiles);
    document.getElementById('sectionUsers').classList.toggle('hidden', isFiles);
    document.getElementById('tabFiles').className = isFiles ? 'tab-active py-5 text-[11px] font-bold uppercase tracking-widest' : 'py-5 text-slate-400 text-[11px] font-bold uppercase tracking-widest';
    document.getElementById('tabUsers').className = !isFiles ? 'tab-active py-5 text-[11px] font-bold uppercase tracking-widest' : 'py-5 text-slate-400 text-[11px] font-bold uppercase tracking-widest';
    if (!isFiles) loadUsers();
}

async function loadUsers() {
    const res = await fetch('/api/users', { headers: { 'x-user-data': JSON.stringify(user) } });
    const users = await res.json();
    userTableBody.innerHTML = users.map(u => `
        <tr class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
            <td class="py-5">${u.fullname}</td>
            <td class="py-5">${u.username}</td>
            <td class="py-5"><span class="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-extrabold">${u.role.toUpperCase()}</span></td>
            <td class="py-5 text-right"><button onclick="delUser('${u.username}')" class="text-rose-400 hover:text-rose-600 px-3 transition-colors"><i class="fas fa-trash-alt"></i></button></td>
        </tr>
    `).join('');
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
    document.getElementById('vPrivate').className = !v ? 'px-6 rounded-lg text-[10px] font-bold btn-toggle-active transition-all' : 'px-6 rounded-lg text-[10px] font-bold text-slate-400 transition-all';
    document.getElementById('vPublic').className = v ? 'px-6 rounded-lg text-[10px] font-bold btn-toggle-active transition-all' : 'px-6 rounded-lg text-[10px] font-bold text-slate-400 transition-all';
}

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
                        <span class="text-[9px] text-slate-400 uppercase font-bold">${(f.size / 1024 / 1024).toFixed(2)} MB ● ${f.owner_name || 'Guest'}</span>
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
                        <span class="text-center text-[9px] text-slate-400 font-bold uppercase tracking-tighter">${(f.size / 1024 / 1024).toFixed(2)} MB ● ${f.owner_name || 'Guest'}</span>
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

function closePreview() { document.getElementById('previewModal').classList.add('hidden'); document.getElementById('previewContent').innerHTML = ''; document.body.style.overflow = 'auto'; }

fileInput.onchange = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    upNormal.classList.add('hidden'); upLoading.classList.remove('hidden');
    const fd = new FormData(); fd.append('file', file);
    await fetch(`/upload?platform=${selectedPlatform}&is_public=${isPublicFile}`, { method: 'POST', headers: { 'x-user-data': JSON.stringify(user) }, body: fd });
    location.reload();
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

updateViewButtons();
updateAuthUI();
loadFiles();

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
