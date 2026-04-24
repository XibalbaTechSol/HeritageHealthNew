/**
 * PORTAL LOGIC — Heritage Connect
 * FULL PRODUCTION SUITE: Auth, Firestore Sync, Profile Editing, Messaging, Google Calendar, Notifications & Logs.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    collection, 
    addDoc, 
    updateDoc,
    query, 
    where, 
    orderBy, 
    limit,
    onSnapshot, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { generateClientPacket } from "./pdf-generator.js";

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
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');

document.addEventListener('DOMContentLoaded', () => {

    let cachedUserData = null;
    let googleEvents = [];

    // ─── AUTHENTICATION GUARD ───
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = 'index.html#portal';
            return;
        }

        // 1. Fetch & Sync Profile
        const userDocRef = doc(db, "clients", user.uid);
        onSnapshot(userDocRef, (snap) => {
            if (snap.exists()) {
                cachedUserData = snap.data();
                updateUIWithUserData(cachedUserData);
            }
        });

        // 2. Initialize Real-Time Systems
        initMessaging(user.uid);
        initNotifications(user.uid);
        initActivityLogs(user.uid);
        initVisitLog(user.uid);
    });


    function updateUIWithUserData(data) {
        const greeting = document.querySelector('.page-title');
        if (greeting && data.firstName) greeting.textContent = `Good Day, ${data.firstName}`;
        
        const sidebarName = document.querySelector('.user-name');
        if (sidebarName && data.firstName) sidebarName.textContent = `${data.firstName} ${data.lastName.charAt(0)}.`;

        const initials = (data.firstName.charAt(0) + (data.lastName ? data.lastName.charAt(0) : '')).toUpperCase();
        document.querySelectorAll('.user-avatar').forEach(av => av.textContent = initials);

        const setField = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val || "—";
        };
        setField('prof-fullName', `${data.firstName} ${data.lastName}`);
        setField('prof-uid', data.uid);
        setField('prof-dob', data.dob);
        setField('prof-phone', data.pcwPhone);
        setField('prof-address', `${data.address || ''}, ${data.city || ''}, WI ${data.zip || ''}`);
        setField('prof-medicaid', data.medicaidNumber);
        setField('prof-language', data.language);
        setField('prof-gender', data.gender);
        setField('prof-doctor', data.doctorName);
        setField('prof-docLoc', data.doctorLocation);
        setField('prof-pcw', data.pcwName);
        setField('prof-status', data.status || "Active");
    }

    // ─── NOTIFICATIONS SYSTEM ───
    function initNotifications(uid) {
        const notifDot = document.getElementById('notifDot');
        const notifList = document.getElementById('notifList');
        const q = query(collection(db, "notifications"), where("userId", "==", uid), orderBy("timestamp", "desc"), limit(10));

        onSnapshot(q, (snap) => {
            let unreadCount = 0;
            if (snap.empty) {
                notifList.innerHTML = '<div class="text-center" style="padding: 20px; color: var(--text-muted); font-size: 0.85rem;">No new notifications</div>';
                notifDot.style.display = 'none';
                return;
            }

            notifList.innerHTML = '';
            snap.forEach(doc => {
                const n = doc.data();
                if (!n.read) unreadCount++;
                const item = document.createElement('div');
                item.className = `notif-item ${n.read ? '' : 'unread'}`;
                item.innerHTML = `
                    <div class="notif-icon"><i class="fa-solid ${n.icon || 'fa-bell'}"></i></div>
                    <div class="notif-content">
                        <h5>${n.title}</h5>
                        <p>${n.body}</p>
                        <time>${n.timestamp?.toDate().toLocaleString() || 'Just now'}</time>
                    </div>
                `;
                notifList.appendChild(item);
            });

            notifDot.style.display = unreadCount > 0 ? 'block' : 'none';
        });

        // Dropdown toggle
        const bell = document.getElementById('notifBell');
        const dropdown = document.getElementById('notifDropdown');
        bell?.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        document.addEventListener('click', () => dropdown.classList.remove('active'));
    }

    // ─── ACTIVITY FEED ───
    function initActivityLogs(uid) {
        const feed = document.getElementById('realActivityFeed');
        const q = query(collection(db, "activity"), where("userId", "==", uid), orderBy("timestamp", "desc"), limit(8));

        onSnapshot(q, (snap) => {
            if (snap.empty) {
                feed.innerHTML = '<div class="text-center" style="padding: 20px; color: var(--text-muted);">No recent activity.</div>';
                return;
            }
            feed.innerHTML = '';
            snap.forEach(doc => {
                const a = doc.data();
                const item = document.createElement('div');
                item.className = 'activity-item';
                item.innerHTML = `
                    <div class="activity-dot" style="background: ${a.color || '#C9A84C'};"></div>
                    <div class="activity-content">
                        <p><strong>${a.title}</strong></p>
                        <span>${a.body}</span>
                        <time>${a.timestamp?.toDate().toLocaleString() || 'Just now'}</time>
                    </div>
                `;
                feed.appendChild(item);
            });
        });
    }

    // ─── VISIT LOG ───
    function initVisitLog(uid) {
        const table = document.getElementById('visitTableBody');
        const q = query(collection(db, "visits"), where("clientId", "==", uid), orderBy("date", "desc"));

        onSnapshot(q, (snap) => {
            if (snap.empty) {
                table.innerHTML = '<tr><td colspan="7" class="text-center">No visit records found.</td></tr>';
                return;
            }
            table.innerHTML = '';
            snap.forEach(doc => {
                const v = doc.data();
                const tr = document.createElement('tr');
                const statusClass = v.status === 'Verified' ? 'verified' : 'missed';
                tr.innerHTML = `
                    <td>${v.date}</td>
                    <td>${v.caregiver}</td>
                    <td>${v.service}</td>
                    <td>${v.checkIn}</td>
                    <td>${v.checkOut}</td>
                    <td>${v.hours}</td>
                    <td><span class="status-badge ${statusClass}">${v.status}</span></td>
                `;
                table.appendChild(tr);
            });
        });
    }

    // ─── PROFILE EDITING ───
    const editModal = document.getElementById('editProfileModal');
    const editForm = document.getElementById('editProfileForm');

    document.getElementById('openEditProfile')?.addEventListener('click', () => {
        if (!cachedUserData) return;
        Object.keys(cachedUserData).forEach(key => {
            const input = editForm.querySelector(`[name="${key}"]`);
            if (input) input.value = cachedUserData[key];
        });
        editModal.classList.add('active');
    });

    document.getElementById('closeEditProfile')?.addEventListener('click', () => editModal.classList.remove('active'));
    document.getElementById('cancelEditProfile')?.addEventListener('click', () => editModal.classList.remove('active'));

    editForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(editForm);
        const updates = Object.fromEntries(formData.entries());
        try {
            await setDoc(doc(db, "clients", auth.currentUser.uid), updates, { merge: true });
            // Add activity log for the edit
            await addDoc(collection(db, "activity"), {
                userId: auth.currentUser.uid,
                title: "Profile Updated",
                body: "You updated your personal information.",
                timestamp: serverTimestamp(),
                color: "#3B82F6"
            });
            editModal.classList.remove('active');
            alert("Profile updated.");
        } catch (err) { alert(err.message); }
    });

    // ─── SECURE MESSAGING ───
    function initMessaging(uid) {
        const msgList = document.getElementById('realMessageList');
        const msgQuery = query(collection(db, "messages"), where("clientId", "==", uid), orderBy("timestamp", "desc"));
        onSnapshot(msgQuery, (snap) => {
            if (snap.empty) {
                msgList.innerHTML = '<div class="text-center" style="padding:40px; color:var(--text-muted);">No messages yet.</div>';
                return;
            }
            msgList.innerHTML = '';
            snap.forEach(doc => {
                const msg = doc.data();
                const item = document.createElement('div');
                item.className = `message-item ${msg.read ? '' : 'unread'}`;
                item.innerHTML = `
                    <div class="msg-avatar ${msg.senderRole === 'Nurse' ? 'rn' : 'cc'}">${msg.senderInitials || 'HH'}</div>
                    <div class="msg-content">
                        <div class="msg-header">
                            <strong>${msg.senderName}</strong>
                            <time>${msg.timestamp?.toDate().toLocaleString() || 'Just now'}</time>
                        </div>
                        <h4>${msg.subject}</h4>
                        <p>${msg.body}</p>
                    </div>
                    ${msg.read ? '' : '<span class="unread-dot"></span>'}
                `;
                msgList.appendChild(item);
            });
        });
    }

    const msgModal = document.getElementById('messageModal');
    const msgForm = document.getElementById('messageForm');
    document.getElementById('openMessageComposer')?.addEventListener('click', () => msgModal.classList.add('active'));
    document.getElementById('closeMessageComposer')?.addEventListener('click', () => msgModal.classList.remove('active'));
    document.getElementById('cancelMessage')?.addEventListener('click', () => msgModal.classList.remove('active'));

    msgForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(msgForm);
        const newMsg = {
            ...Object.fromEntries(formData.entries()),
            clientId: auth.currentUser.uid,
            clientName: `${cachedUserData.firstName} ${cachedUserData.lastName}`,
            senderName: `${cachedUserData.firstName} ${cachedUserData.lastName}`,
            senderRole: "Client",
            senderInitials: (cachedUserData.firstName[0] + (cachedUserData.lastName ? cachedUserData.lastName[0] : '')).toUpperCase(),
            timestamp: serverTimestamp(),
            read: true
        };
        try {
            await addDoc(collection(db, "messages"), newMsg);
            // Add activity log
            await addDoc(collection(db, "activity"), {
                userId: auth.currentUser.uid,
                title: "Message Sent",
                body: `Secure message sent to ${newMsg.recipient}.`,
                timestamp: serverTimestamp(),
                color: "#10B981"
            });
            msgModal.classList.remove('active');
            msgForm.reset();
            alert("Message sent.");
        } catch (err) { alert(err.message); }
    });

    // ─── GOOGLE CALENDAR INTEGRATION ───
    const syncBtn = document.getElementById('syncGoogleCalendar');
    syncBtn?.addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            syncBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Syncing...';
            const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?access_token=${token}`);
            const data = await response.json();
            if (data.items) {
                googleEvents = data.items.map(item => ({
                    title: item.summary,
                    start: item.start.dateTime || item.start.date,
                    type: 'google'
                }));
                renderCalendar(3, 2026);
                alert(`Successfully synced ${googleEvents.length} events.`);
            }
        } catch (err) { alert("Failed to sync calendar."); }
        finally { syncBtn.innerHTML = '<i class="fa-brands fa-google"></i> Sync Google Calendar'; }
    });

    // ─── CALENDAR RENDERER ───
    const calGrid = document.getElementById('calendarGrid');
    function renderCalendar(month, year) {
        if (!calGrid) return;
        calGrid.innerHTML = '';
        const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        document.getElementById('calMonthYear').textContent = `${monthNames[month]} ${year}`;
        ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(day => {
            const h = document.createElement('div');
            h.className = 'cal-day-header';
            h.textContent = day;
            calGrid.appendChild(h);
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
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            googleEvents.forEach(evt => {
                if (evt.start.startsWith(dateStr)) {
                    const evtTag = document.createElement('div');
                    evtTag.className = 'cal-event google-event';
                    evtTag.style.fontSize = '0.7rem';
                    evtTag.style.background = '#E8F0FE';
                    evtTag.style.color = '#1967D2';
                    evtTag.style.padding = '2px 4px';
                    evtTag.style.borderRadius = '3px';
                    evtTag.style.marginTop = '2px';
                    evtTag.style.whiteSpace = 'nowrap';
                    evtTag.style.overflow = 'hidden';
                    evtTag.textContent = evt.title;
                    cell.appendChild(evtTag);
                }
            });
            calGrid.appendChild(cell);
        }
    }
    renderCalendar(3, 2026);

    // ─── DOCUMENT GENERATION ───
    async function downloadPacket(btn) {
        if (!cachedUserData || !cachedUserData.signature) {
            alert("Enrollment data not found.");
            return;
        }
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
        btn.disabled = true;
        try {
            const files = await generateClientPacket(cachedUserData);
            if (files && files.length > 0) {
                const file = files[0];
                const blob = new Blob([file.bytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const link = document.getElementById('pdfDownloadLink');
                if (link) {
                    link.href = url;
                    link.download = file.name;
                    link.click();
                    URL.revokeObjectURL(url);
                    // Add activity log
                    await addDoc(collection(db, "activity"), {
                        userId: auth.currentUser.uid,
                        title: "Document Downloaded",
                        body: `You downloaded: ${file.name}`,
                        timestamp: serverTimestamp(),
                        color: "#8B5CF6"
                    });
                }
            }
        } catch (err) { alert("Error generating PDF."); }
        finally {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }
    }

    document.getElementById('viewSignedPacket')?.addEventListener('click', (e) => downloadPacket(e.currentTarget));
    document.getElementById('viewSignedPacketDashboard')?.addEventListener('click', (e) => downloadPacket(e.currentTarget));

    // ─── NAVIGATION ───
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-page]');
    const pages = document.querySelectorAll('.page');
    function navigateTo(pageId) {
        pages.forEach(p => p.classList.remove('active'));
        sidebarLinks.forEach(l => l.classList.remove('active'));
        document.getElementById(`page-${pageId}`)?.classList.add('active');
        document.querySelector(`.sidebar-link[data-page="${pageId}"]`)?.classList.add('active');
        document.getElementById('sidebar').classList.remove('open');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    sidebarLinks.forEach(link => link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(link.dataset.page);
    }));
    document.querySelectorAll('[data-goto]').forEach(link => link.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo(link.dataset.goto);
    }));
    document.querySelector('.sidebar-logout')?.addEventListener('click', async (e) => {
        e.preventDefault();
        if (confirm('Sign out?')) { await signOut(auth); window.location.href = 'index.html'; }
    });
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });

});
