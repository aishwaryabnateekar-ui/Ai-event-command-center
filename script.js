// =======================
// TIME
// =======================
setInterval(() => {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
}, 1000);

// =======================
// STATUS SYSTEM
// =======================
const statusMap = {
    green: {
        text: 'Smooth',
        desc: 'All operations running optimally.',
        percent: 70,
        attendees: 3668,
        globalText: 'Live: Operations Smooth'
    },
    yellow: {
        text: 'Moderate',
        desc: 'Crowd increasing.',
        percent: 85,
        attendees: 4454,
        globalText: 'Live: Capacity Warning'
    },
    red: {
        text: 'Critical',
        desc: 'Over capacity detected.',
        percent: 98,
        attendees: 5135,
        globalText: 'Live: Critical Level'
    }
};

function setStatus(level) {
    const s = statusMap[level];

    document.querySelectorAll('.status-btn')
        .forEach(b => b.classList.remove('active'));

    const btn = document.querySelector(`.status-btn[data-status="${level}"]`);
    if (btn) btn.classList.add('active');

    document.getElementById('main-status-badge').textContent = s.text;
    document.getElementById('main-status-desc').textContent = s.desc;
    document.getElementById('capacity-percent').textContent = s.percent + '%';

    document.getElementById('capacity-bar').style.width = s.percent + '%';
    document.getElementById('global-status-text').textContent = s.globalText;

    const total = 5240;
    const absent = total - s.attendees;

    updateNumber('attendees-val', s.attendees);
    updateNumber('absent-val', absent);
}

function updateNumber(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value.toLocaleString();
}

// =======================
// VIEW SWITCHER
// =======================
function showView(name, title, showStatus = false) {
    document.querySelectorAll('.view-section')
        .forEach(v => v.style.display = 'none');

    const view = document.getElementById(`view-${name}`);
    if (view) view.style.display = 'block';

    document.getElementById('top-title').textContent = title;

    const status = document.getElementById('top-status-container');
    if (status) status.style.display = showStatus ? 'flex' : 'none';
}

// =======================
// SEARCH (FIXED + STABLE)
// =======================
document.addEventListener('DOMContentLoaded', () => {

    const searchInput = document.getElementById('search-input');
    const dropdown = document.getElementById('search-dropdown');

    const data = [
        "Tech Expo 2026",
        "AI Summit",
        "Global Gala",
        "Sarah Jenkins",
        "Michael Chang",
        "System Settings"
    ];

    let timeout;

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {

            clearTimeout(timeout);

            timeout = setTimeout(() => {
                const q = e.target.value.toLowerCase();

                if (!q) {
                    dropdown.style.display = 'none';
                    return;
                }

                const res = data.filter(d => d.toLowerCase().includes(q));

                dropdown.innerHTML = res.length
                    ? res.map(r => `<div class="dropdown-item">${r}</div>`).join('')
                    : `<div class="dropdown-item">No results</div>`;

                dropdown.style.display = 'block';
            }, 200);
        });
    }

    // =======================
    // EMERGENCY FIXED
    // =======================
    const emergencyBtn = document.getElementById('emergency-btn');

    if (emergencyBtn) {
        emergencyBtn.onclick = () => {
            document.body.classList.toggle('emergency-mode');

            const active = document.body.classList.contains('emergency-mode');

            document.getElementById('global-status-text')
                .textContent = active ? "EMERGENCY ACTIVE" : "Live: Operations Smooth";

            emergencyBtn.textContent = active ? "Deactivate Emergency" : "🚨 Emergency";
        };
    }

    // =======================
    // EXPORT FIXED
    // =======================
    const exportBtn = document.getElementById('export-csv-btn');

    if (exportBtn) {
        exportBtn.onclick = () => {

            const rows = [...document.querySelectorAll('table tr')];

            const csv = rows.map(r =>
                [...r.children].map(c => c.innerText).join(',')
            ).join('\n');

            const blob = new Blob([csv], { type: 'text/csv' });

            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = "eventiq.csv";
            a.click();
        };
    }

    // =======================
    // SHARE FIXED
    // =======================
    const shareBtn = document.getElementById('share-report-btn');

    if (shareBtn) {
        shareBtn.onclick = async () => {
            const url = window.location.href;

            if (navigator.clipboard) {
                await navigator.clipboard.writeText(url);
                alert("Link copied!");
            } else {
                prompt("Copy link:", url);
            }
        };
    }

    // =======================
    // NAVIGATION FIXED
    // =======================
    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = (e) => {
            e.preventDefault();

            document.querySelectorAll('.nav-item')
                .forEach(n => n.classList.remove('active'));

            item.classList.add('active');

            const target = item.dataset.target;

            const map = {
                Dashboard: ["Dashboard", "⚡ EventIQ Control Center", true],
                Events: ["Events", "📅 Events"],
                Attendees: ["Attendees", "👥 Attendees"],
                Analytics: ["Analytics", "📊 Analytics"],
                Settings: ["Settings", "⚙️ Settings"]
            };

            showView(...map[target]);
        };
    });

});
