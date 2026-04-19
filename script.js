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

    // AI Decision Engine text
    const decisionText = document.getElementById('ai-decision-text');
    if (decisionText) {
        if (details.percent > 80) decisionText.textContent = "Open additional entry gate";
        else if (details.percent > 60) decisionText.textContent = "Deploy staff to crowd zones";
        else decisionText.textContent = "All systems normal";
    }

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

    // 1. Search Dropdown with Mock Data Filtering
    const searchInput = document.getElementById('search-input');
    const searchDropdown = document.getElementById('search-dropdown');
    
    // Mock Data based on dashboard content
    const searchData = [
        { title: "Tech Expo 2026", type: "Event Match" },
        { title: "AI Pioneers Summit", type: "Event Match" },
        { title: "Global Developers Gala", type: "Event Match" },
        { title: "Sarah Jenkins", type: "Guest Record" },
        { title: "Michael Chang", type: "Guest Record" },
        { title: "Elaine Walker", type: "Guest Record" },
        { title: "Dashboard Settings", type: "System Config" },
        { title: "Capacity Alert Rules", type: "AI Module" }
    ];

    if (searchInput && searchDropdown) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            
            if (query.length > 0) {
                // Filter matches
                const matches = searchData.filter(item => 
                    item.title.toLowerCase().includes(query) || 
                    item.type.toLowerCase().includes(query)
                );
                
                // Build HTML
                searchDropdown.innerHTML = '';
                if (matches.length > 0) {
                    matches.forEach(match => {
                        const div = document.createElement('div');
                        div.className = 'dropdown-item';
                        div.innerHTML = `<strong>${match.title}</strong> - <span style="opacity: 0.7; font-size: 0.85rem;">${match.type}</span>`;
                        searchDropdown.appendChild(div);
                    });
                } else {
                    const div = document.createElement('div');
                    div.className = 'dropdown-item';
                    div.style.textAlign = 'center';
                    div.innerHTML = `<span style="opacity: 0.7;">No matching results found.</span>`;
                    searchDropdown.appendChild(div);
                }
                
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
                switchToView('Dashboard', '⚡ EventIQ Control Center', 'Live Operations');
            } else if (targetView === 'Events') {
                switchToView('Events', '📅 Manage Events', 'Scheduling');
            } else if (targetView === 'Attendees') {
                switchToView('Attendees', '👥 Attendees Directory', 'Guests');
            } else if (targetView === 'Analytics') {
                switchToView('Analytics', '📊 Analytics Overview', 'Metrics');
            } else if (targetView === 'Settings') {
                switchToView('Settings', '⚙️ System Settings', 'Config');
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

    // 6. Role-Based View Dropdown
    const roleSelect = document.getElementById('role-select');
    if (roleSelect) {
        // Set default class
        document.body.classList.add('role-admin');
        
        roleSelect.addEventListener('change', (e) => {
            const val = e.target.value.toLowerCase();
            
            // Apply CSS class
            document.body.classList.remove('role-admin', 'role-security', 'role-organizer');
            document.body.classList.add(`role-${val}`);
            
            // Route dynamically enforcing restrictions
            if (val === 'organizer') {
                const eventsTab = document.querySelector('.nav-item[data-target="Events"]');
                if(eventsTab) eventsTab.click();
            } else if (val === 'security' || val === 'admin') {
                const dashTab = document.querySelector('.nav-item[data-target="Dashboard"]');
                if(dashTab) dashTab.click();
            }
            
            // Display alert feedback
            if (val === 'admin') alert("Admin Role: Full dashboard and system access enabled.");
            else if (val === 'security') alert("Security Role: Access restricted to alerts and emergency operations.");
            else if (val === 'organizer') alert("Organizer Role: Access restricted to active events and guest directories.");
        });
    }

    // 7. Emergency Mode Button
    const emergencyBtn = document.getElementById('emergency-btn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', () => {
            document.body.classList.toggle('emergency-mode');
            const isEmg = document.body.classList.contains('emergency-mode');
            
            if (isEmg) {
                document.getElementById('global-status-text').textContent = "Emergency Mode Activated";
                emergencyBtn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Deactivate Emergency';
                emergencyBtn.style.background = 'white';
                emergencyBtn.style.color = 'var(--status-red)';
                
                const decisionText = document.getElementById('ai-decision-text');
                if (decisionText) {
                    decisionText.innerHTML = '<span style="color:var(--status-red);">Evacuate Zone A immediately</span>';
                }
                
                alert("Emergency protocol activated! Evacuate safely.");
            } else {
                emergencyBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> 🚨 Emergency';
                emergencyBtn.style.background = 'var(--status-red)';
                emergencyBtn.style.color = 'white';
                
                // Restore normal text by recalling setStatus with active btn
                const activeBtn = document.querySelector('.status-btn.active');
                if(activeBtn) {
                    const activeLevel = activeBtn.getAttribute('data-status');
                    setStatus(activeLevel);
                }
            }
        });
    }
    // 8. Export and Share Buttons
    const exportBtn = document.getElementById('export-csv-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const table = document.querySelector('#view-Attendees .data-table');
            let csvContent = "";
            
            if (table) {
                // Extract headers
                const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText.replace(/,/g, ''));
                csvContent += headers.join(',') + "\n";
                
                // Extract rows
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const cols = Array.from(row.querySelectorAll('td')).map(td => td.innerText.replace(/,/g, ''));
                    csvContent += cols.join(',') + "\n";
                });
            } else {
                csvContent = "Name,Ticket Number,Access Level,Status\nError finding data";
            }

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "eventiq_report.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    const shareBtn = document.getElementById('share-report-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: 'EventIQ AI Report',
                text: 'Check out the live attendance metrics on EventIQ Control Center.',
                url: window.location.href
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    console.error('Error sharing:', err);
                }
            } else {
                // Fallback to clipboard
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    alert("Link copied successfully");
                } catch (err) {
                    // Older browser fallback
                    const el = document.createElement('textarea');
                    el.value = window.location.href;
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand('copy');
                    document.body.removeChild(el);
                    alert("Link copied successfully");
                }
            }
        });
    }

    // 9. Chart.js Analytics Initialization
    const ctxLine = document.getElementById('attendanceChart');
    const ctxBar = document.getElementById('eventsChart');

    if (ctxLine && typeof Chart !== 'undefined') {
        new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: ['10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM'],
                datasets: [{
                    label: 'Live Guests',
                    data: [1500, 2200, 3100, 3150, 4800, 5240, 4900, 3800, 2500],
                    borderColor: '#ff4da6', // Pink
                    backgroundColor: 'rgba(255, 77, 166, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#4da6ff', // Blue
                    pointBorderColor: '#fff',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' }, beginAtZero: true },
                    x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
                }
            }
        });
    }

    if (ctxBar && typeof Chart !== 'undefined') {
        new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['Tech Expo', 'AI Summit', 'Dev Gala'],
                datasets: [{
                    label: 'Registrants',
                    data: [5240, 1200, 450],
                    backgroundColor: [
                        'rgba(255, 77, 166, 0.8)',
                        'rgba(77, 166, 255, 0.8)',
                        'rgba(255, 102, 204, 0.8)'
                    ],
                    borderColor: [
                        '#ff4da6',
                        '#4da6ff',
                        '#ff66cc'
                    ],
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' }, beginAtZero: true },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                }
            }
        });
    }

});
