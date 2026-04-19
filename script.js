// Time
setInterval(() => {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
}, 1000);

// Status Logic
const statusMap = {
    green: {
        text: 'Smooth',
        desc: 'All operations are running optimally.',
        badgeClass: 'green',
        barGradient: 'green-gradient',
        percent: 70,
        attendees: 3668,
        insight: 'Attendance is 70% - good engagement',
        globalText: 'Live: Operations Smooth'
    },
    yellow: {
        text: 'Moderate',
        desc: 'Crowd density is increasing. Monitoring required.',
        badgeClass: 'yellow',
        barGradient: 'yellow-gradient',
        percent: 85,
        attendees: 4454,
        insight: 'Attendance is 85% - prepare for overflow',
        globalText: 'Live: Capacity Warning'
    },
    red: {
        text: 'Overcrowded',
        desc: 'Max capacity reached. Routing guests to overflow.',
        badgeClass: 'red',
        barGradient: 'red-gradient',
        percent: 98,
        attendees: 5135,
        insight: 'Attendance is 98% - critical mass',
        globalText: 'Live: Critical Level'
    }
};

function setStatus(level) {
    const details = statusMap[level];

    // Buttons
    document.querySelectorAll('.status-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.status-btn[data-status="${level}"]`).classList.add('active');

    // Main Display
    const badge = document.getElementById('main-status-badge');
    badge.className = `status-badge-lg ${details.badgeClass}`;
    badge.textContent = details.text;
    document.getElementById('main-status-desc').textContent = details.desc;

    // Capacity Bar
    document.getElementById('capacity-percent').textContent = details.percent + '%';
    const bar = document.getElementById('capacity-bar');
    bar.style.width = details.percent + '%';
    bar.className = `progress-bar-fill ${details.barGradient}`;

    // Header status
    const topDot = document.querySelector('.status-dot');
    topDot.className = `status-dot ${details.badgeClass}`;
    document.getElementById('global-status-text').textContent = details.globalText;

    // Insight text
    document.getElementById('insight-attendance-text').textContent = details.insight;

    // Stats Update
    const totalGuests = 5240;
    const absent = totalGuests - details.attendees;

    animateValue(document.getElementById('attendees-val'), details.attendees);
    animateValue(document.getElementById('absent-val'), absent);
}

function animateValue(obj, end) {
    if (!obj) return;
    const current = parseInt(obj.textContent.replace(/,/g, ''));
    if (isNaN(current)) return;

    const duration = 500;
    const startTimestamp = performance.now();

    const step = (timestamp) => {
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - current) + current).toLocaleString();
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

// ------------------------------------
// UI Logic: SPA routing & dropdowns
// ------------------------------------

document.addEventListener('DOMContentLoaded', () => {

    // 1. Search Dropdown
    const searchInput = document.getElementById('search-input');
    const searchDropdown = document.getElementById('search-dropdown');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            if (e.target.value.trim().length > 0) {
                searchDropdown.style.display = 'block';
            } else {
                searchDropdown.style.display = 'none';
            }
        });
    }

    // 2. Notification Dropdown
    const notifBtn = document.getElementById('notification-btn');
    const notifDropdown = document.getElementById('notification-dropdown');

    if (notifBtn) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.style.display = notifDropdown.style.display === 'none' ? 'block' : 'none';
            if (searchDropdown) searchDropdown.style.display = 'none';
        });
    }

    // 3. Close Dropdowns on outside click
    document.addEventListener('click', () => {
        if (searchDropdown) searchDropdown.style.display = 'none';
        if (notifDropdown) notifDropdown.style.display = 'none';
    });

    // 4. Custom View Router
    function switchToView(viewName, title, subtitle) {
        // Hide all views
        document.querySelectorAll('.view-section').forEach(view => {
            view.style.display = 'none';
        });

        // Show target view
        const target = document.getElementById(`view-${viewName}`);
        if (target) {
            target.style.display = 'block';

            // Adjust title
            document.getElementById('top-title').textContent = title;
            const topStatus = document.getElementById('top-status-container');
            if (viewName === 'Dashboard') {
                topStatus.style.display = 'flex';
            } else {
                topStatus.style.display = 'none';
            }
        }
    }

    // Sidebar navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            e.currentTarget.classList.add('active');

            const targetView = e.currentTarget.getAttribute('data-target');
            if (targetView === 'Dashboard') {
                switchToView('Dashboard', 'EventIQ Control Center', 'Live Operations');
            } else {
                switchToView(targetView, targetView, 'Management View');
            }
        });
    });

    // Admin Profile routing
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            switchToView('Profile', 'System Admin', 'Security Node');
        });
    }

    // 5. Button Ripple Effects
    document.querySelectorAll('.action-btn, .icon-btn, .status-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const circle = document.createElement('span');
            const diameter = Math.max(btn.clientWidth, btn.clientHeight);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - btn.getBoundingClientRect().left - radius}px`;
            circle.style.top = `${e.clientY - btn.getBoundingClientRect().top - radius}px`;
            circle.classList.add('ripple');

            const ripple = btn.querySelector('.ripple');
            if (ripple) {
                ripple.remove();
            }

            btn.appendChild(circle);
        });
    });

});
