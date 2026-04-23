document.addEventListener('DOMContentLoaded', () => {

    // ═══════════ PAGE NAVIGATION ═══════════

    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-page]');
    const pages = document.querySelectorAll('.page');
    const gotoLinks = document.querySelectorAll('[data-goto]');

    function navigateTo(pageId) {
        pages.forEach(p => p.classList.remove('active'));
        sidebarLinks.forEach(l => l.classList.remove('active'));

        const page = document.getElementById(`page-${pageId}`);
        const link = document.querySelector(`.sidebar-link[data-page="${pageId}"]`);

        if (page) page.classList.add('active');
        if (link) link.classList.add('active');

        // Close mobile sidebar
        document.getElementById('sidebar').classList.remove('open');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });

    gotoLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.goto);
        });
    });

    // ═══════════ MOBILE SIDEBAR ═══════════

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Close sidebar on outside click
    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });


    // ═══════════ VISIT LOG DATA ═══════════

    const visits = [
        { date: 'Apr 16, 2026', cg: 'Sarah M.', service: 'Morning Routine', checkIn: '7:58 AM', checkOut: '10:02 AM', hours: '2.1', status: 'Verified' },
        { date: 'Apr 15, 2026', cg: 'Sarah M.', service: 'Evening Routine', checkIn: '6:02 PM', checkOut: '8:05 PM', hours: '2.0', status: 'Verified' },
        { date: 'Apr 15, 2026', cg: 'Sarah M.', service: 'Midday Care', checkIn: '12:28 PM', checkOut: '2:01 PM', hours: '1.5', status: 'Verified' },
        { date: 'Apr 15, 2026', cg: 'Sarah M.', service: 'Morning Routine', checkIn: '8:01 AM', checkOut: '10:00 AM', hours: '2.0', status: 'Verified' },
        { date: 'Apr 14, 2026', cg: 'Sarah M.', service: 'Evening Routine', checkIn: '5:58 PM', checkOut: '7:55 PM', hours: '2.0', status: 'Verified' },
        { date: 'Apr 14, 2026', cg: 'Sarah M.', service: 'Midday Care', checkIn: '12:32 PM', checkOut: '2:05 PM', hours: '1.5', status: 'Verified' },
        { date: 'Apr 14, 2026', cg: 'Sarah M.', service: 'Morning Routine', checkIn: '7:55 AM', checkOut: '9:58 AM', hours: '2.0', status: 'Verified' },
        { date: 'Apr 13, 2026', cg: 'Sarah M.', service: 'Evening Routine', checkIn: '6:05 PM', checkOut: '8:08 PM', hours: '2.0', status: 'Verified' },
        { date: 'Apr 13, 2026', cg: 'Sarah M.', service: 'Midday Care', checkIn: '12:30 PM', checkOut: '1:58 PM', hours: '1.5', status: 'Verified' },
        { date: 'Apr 13, 2026', cg: 'Sarah M.', service: 'Morning Routine', checkIn: '8:00 AM', checkOut: '10:05 AM', hours: '2.1', status: 'Verified' },
        { date: 'Apr 12, 2026', cg: 'Sarah M.', service: 'Evening Routine', checkIn: '5:00 PM', checkOut: '7:02 PM', hours: '2.0', status: 'Verified' },
        { date: 'Apr 12, 2026', cg: 'Sarah M.', service: 'Morning Routine', checkIn: '9:01 AM', checkOut: '11:00 AM', hours: '2.0', status: 'Verified' },
        { date: 'Apr 11, 2026', cg: 'Sarah M.', service: 'Evening Routine', checkIn: '5:02 PM', checkOut: '6:58 PM', hours: '1.9', status: 'Verified' },
        { date: 'Apr 11, 2026', cg: 'Sarah M.', service: 'Morning Routine', checkIn: '8:58 AM', checkOut: '10:55 AM', hours: '2.0', status: 'Verified' },
        { date: 'Apr 10, 2026', cg: 'Sarah M.', service: 'Evening Routine', checkIn: '6:00 PM', checkOut: '8:02 PM', hours: '2.0', status: 'Verified' },
        { date: 'Apr 10, 2026', cg: 'Sarah M.', service: 'Midday Care', checkIn: '12:35 PM', checkOut: '2:03 PM', hours: '1.5', status: 'Verified' },
        { date: 'Apr 10, 2026', cg: 'Sarah M.', service: 'Morning Routine', checkIn: '7:59 AM', checkOut: '10:01 AM', hours: '2.0', status: 'Verified' },
        { date: 'Apr 9, 2026', cg: 'Sarah M.', service: 'Morning Routine', checkIn: '—', checkOut: '—', hours: '—', status: 'Missed' },
    ];

    const visitTable = document.getElementById('visitTableBody');
    if (visitTable) {
        visits.forEach(v => {
            const tr = document.createElement('tr');
            const statusClass = v.status === 'Verified' ? 'verified' : 'missed';
            tr.innerHTML = `
                <td>${v.date}</td>
                <td>${v.cg}</td>
                <td>${v.service}</td>
                <td>${v.checkIn}</td>
                <td>${v.checkOut}</td>
                <td>${v.hours}</td>
                <td><span class="status-badge ${statusClass}">${v.status}</span></td>
            `;
            visitTable.appendChild(tr);
        });
    }


    // ═══════════ CALENDAR ═══════════

    const calGrid = document.getElementById('calendarGrid');
    const calMonthYear = document.getElementById('calMonthYear');
    const calPrev = document.getElementById('calPrev');
    const calNext = document.getElementById('calNext');

    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    let currentMonth = 3; // April (0-indexed)
    let currentYear = 2026;

    // Days with scheduled visits
    const scheduledDays = new Set();
    // Weekdays (Mon-Fri) always have visits
    // Weekends have visits too (fewer)

    function renderCalendar(month, year) {
        calGrid.innerHTML = '';
        calMonthYear.textContent = `${monthNames[month]} ${year}`;

        // Day headers
        dayNames.forEach(day => {
            const header = document.createElement('div');
            header.className = 'cal-day-header';
            header.textContent = day;
            calGrid.appendChild(header);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const today = new Date();
        const isCurrentMonth = (today.getMonth() === month && today.getFullYear() === year);

        // Previous month padding
        for (let i = firstDay - 1; i >= 0; i--) {
            const cell = document.createElement('div');
            cell.className = 'cal-day other-month';
            cell.innerHTML = `<div class="day-num">${daysInPrevMonth - i}</div>`;
            calGrid.appendChild(cell);
        }

        // Current month days
        for (let d = 1; d <= daysInMonth; d++) {
            const cell = document.createElement('div');
            const date = new Date(year, month, d);
            const dayOfWeek = date.getDay();
            const isPast = date <= today;

            let classes = 'cal-day';
            if (isCurrentMonth && d === today.getDate()) classes += ' today';

            cell.className = classes;

            let dotsHtml = '';
            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                // Weekdays: 3 visits (morning, midday, evening)
                dotsHtml = `
                    <div class="cal-dots">
                        <span class="cal-dot ${isPast ? 'green' : ''}"></span>
                        <span class="cal-dot ${isPast ? 'green' : ''}"></span>
                        <span class="cal-dot ${isPast ? 'green' : ''}"></span>
                    </div>`;
            } else {
                // Weekends: 2 visits
                dotsHtml = `
                    <div class="cal-dots">
                        <span class="cal-dot ${isPast ? 'green' : ''}"></span>
                        <span class="cal-dot ${isPast ? 'green' : ''}"></span>
                    </div>`;
            }

            cell.innerHTML = `<div class="day-num">${d}</div>${dotsHtml}`;
            calGrid.appendChild(cell);
        }

        // Next month padding
        const totalCells = calGrid.children.length - 7; // subtract headers
        const remaining = (7 - (totalCells % 7)) % 7;
        for (let i = 1; i <= remaining; i++) {
            const cell = document.createElement('div');
            cell.className = 'cal-day other-month';
            cell.innerHTML = `<div class="day-num">${i}</div>`;
            calGrid.appendChild(cell);
        }
    }

    if (calGrid) {
        renderCalendar(currentMonth, currentYear);

        calPrev.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            renderCalendar(currentMonth, currentYear);
        });

        calNext.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            renderCalendar(currentMonth, currentYear);
        });
    }


    // ═══════════ DOCUMENT ACTIONS ═══════════

    document.querySelectorAll('.doc-action').forEach(btn => {
        btn.addEventListener('click', () => {
            const docName = btn.closest('.doc-card').querySelector('h4').textContent;
            alert(`Downloading: ${docName}`);
        });
    });


    // ═══════════ MESSAGE CLICKS ═══════════

    document.querySelectorAll('.message-item').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.remove('unread');
            const subject = item.querySelector('h4').textContent;
            const body = item.querySelector('p').textContent;
            alert(`${subject}\n\n${body}`);

            // Update badge count
            const unreadCount = document.querySelectorAll('.message-item.unread').length;
            const badge = document.querySelector('.sidebar-link[data-page="messages"] .badge');
            if (badge) {
                badge.textContent = unreadCount;
                if (unreadCount === 0) badge.style.display = 'none';
            }
        });
    });

});
