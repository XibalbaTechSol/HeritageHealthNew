/**
 * PORTAL LOGIC — Heritage Connect
 * Handles authentication checks, profile fetching, and UI interactions.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { generateClientPacket } from "./pdf-generator.js";

// Global libraries loaded via CDN in HTML
const PDFLib = window.PDFLib;

// ─── CONFIGURATION ───
const firebaseConfig = {
  apiKey: "AIzaSyA3CvTjZ03mg0yjqK8WW-doRb7vcCP-cHQ",
  authDomain: "hhs-new.firebaseapp.com",
  projectId: "hhs-new",
  storageBucket: "hhs-new.firebasestorage.app",
  messagingSenderId: "996139618301",
  appId: "1:996139618301:web:6b2326edda6968f809d394",
  measurementId: "G-Q8NZ603J99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {

    let cachedUserData = null;

    // ─── AUTHENTICATION GUARD ───
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            console.log("No user detected, redirecting to login...");
            window.location.href = 'index.html#portal';
            return;
        }

        console.log("Authenticated User:", user.uid);
        
        // Fetch real profile data from Firestore
        try {
            const userDoc = await getDoc(doc(db, "clients", user.uid));
            if (userDoc.exists()) {
                cachedUserData = userDoc.data();
                updateUIWithUserData(cachedUserData);
            }
        } catch (err) {
            console.error("Error fetching profile:", err);
        }
    });

    // ─── DYNAMIC DOCUMENT VIEWING ───
    const viewSignedBtn = document.getElementById('viewSignedPacket');
    if (viewSignedBtn) {
        viewSignedBtn.addEventListener('click', async () => {
            if (!cachedUserData || !cachedUserData.signature) {
                alert("Loading your enrollment data. Please wait a moment and try again.");
                return;
            }

            const originalHTML = viewSignedBtn.innerHTML;
            viewSignedBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            viewSignedBtn.disabled = true;

            try {
                // Generate PDFs on the fly using stored Firestore data
                const files = await generateClientPacket(cachedUserData);
                
                // For this demo, we'll download the first one (Referral) 
                // or we could merge them. Let's download all 3.
                for (const file of files) {
                    const blob = new Blob([file.bytes], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);
                    const link = document.getElementById('pdfDownloadLink');
                    link.href = url;
                    link.download = file.name;
                    link.click();
                    URL.revokeObjectURL(url);
                }
            } catch (err) {
                console.error("PDF View Error:", err);
                alert("Error generating your documents. Please contact support.");
            } finally {
                viewSignedBtn.innerHTML = originalHTML;
                viewSignedBtn.disabled = false;
            }
        });
    }

    function updateUIWithUserData(data) {
        // Update Greeting
        const greeting = document.querySelector('.page-title');
        if (greeting && data.firstName) {
            greeting.textContent = `Good Day, ${data.firstName}`;
        }
        
        // Update Sidebar Info
        const sidebarName = document.querySelector('.user-name');
        if (sidebarName && data.firstName && data.lastName) {
            sidebarName.textContent = `${data.firstName} ${data.lastName.charAt(0)}.`;
        }

        // Update Avatar
        if (data.firstName && data.lastName) {
            const initials = (data.firstName.charAt(0) + data.lastName.charAt(0)).toUpperCase();
            document.querySelectorAll('.user-avatar').forEach(av => av.textContent = initials);
        }
    }

    // ─── PAGE NAVIGATION ───
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-page]');
    const pages = document.querySelectorAll('.page');
    const gotoLinks = document.querySelectorAll('[data-goto]');
    const breadcrumbPage = document.getElementById('breadcrumb-page');

    function navigateTo(pageId) {
        pages.forEach(p => p.classList.remove('active'));
        sidebarLinks.forEach(l => l.classList.remove('active'));

        const page = document.getElementById(`page-${pageId}`);
        const link = document.querySelector(`.sidebar-link[data-page="${pageId}"]`);

        if (page) page.classList.add('active');
        if (link) {
            link.classList.add('active');
            if (breadcrumbPage) {
                const pageName = link.querySelector('span').textContent;
                breadcrumbPage.textContent = pageName;
            }
        }

        document.getElementById('sidebar').classList.remove('open');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Sign Out
    const logoutBtn = document.querySelector('.sidebar-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to sign out of Heritage Connect?')) {
                await signOut(auth);
                window.location.href = 'index.html';
            }
        });
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

    // ─── MOBILE SIDEBAR ───
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });


    // ─── VISIT LOG DATA (Static for Demo) ───
    const visits = [
        { date: 'Apr 16, 2026', cg: 'Sarah M.', service: 'Morning Routine', checkIn: '7:58 AM', checkOut: '10:02 AM', hours: '2.1', status: 'Verified' },
        { date: 'Apr 15, 2026', cg: 'Sarah M.', service: 'Evening Routine', checkIn: '6:02 PM', checkOut: '8:05 PM', hours: '2.0', status: 'Verified' },
        { date: 'Apr 15, 2026', cg: 'Sarah M.', service: 'Midday Care', checkIn: '12:28 PM', checkOut: '2:01 PM', hours: '1.5', status: 'Verified' },
        { date: 'Apr 15, 2026', cg: 'Sarah M.', service: 'Morning Routine', checkIn: '8:01 AM', checkOut: '10:00 AM', hours: '2.0', status: 'Verified' },
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


    // ─── CALENDAR ───
    const calGrid = document.getElementById('calendarGrid');
    if (calGrid) {
        const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        let currentMonth = 3; 
        let currentYear = 2026;

        function renderCalendar(month, year) {
            calGrid.innerHTML = '';
            document.getElementById('calMonthYear').textContent = `${monthNames[month]} ${year}`;
            dayNames.forEach(day => {
                const header = document.createElement('div');
                header.className = 'cal-day-header';
                header.textContent = day;
                calGrid.appendChild(header);
            });
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            for (let i = 0; i < firstDay; i++) {
                const cell = document.createElement('div');
                cell.className = 'cal-day other-month';
                calGrid.appendChild(cell);
            }
            for (let d = 1; d <= daysInMonth; d++) {
                const cell = document.createElement('div');
                cell.className = 'cal-day';
                cell.innerHTML = `<div class="day-num">${d}</div>`;
                calGrid.appendChild(cell);
            }
        }
        renderCalendar(currentMonth, currentYear);
    }

});
