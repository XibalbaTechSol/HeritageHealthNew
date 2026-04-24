/**
 * PORTAL LOGIC — Heritage Connect
 * PRODUCTION READY: Full navigation, dynamic modals, real-time sync, and PDF form filling.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, orderBy, limit, onSnapshot, serverTimestamp 
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
    let selectedMessageId = null;

    // ─── AUTHENTICATION GUARD ───
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = 'index.html#portal';
            return;
        }

        const userDocRef = doc(db, "clients", user.uid);
        onSnapshot(userDocRef, (snap) => {
            if (snap.exists()) {
                cachedUserData = snap.data();
                updateUIWithUserData(cachedUserData);
                calculateClinicalMilestones(cachedUserData);
            }
        });

        initMessaging(user.uid);
        initNotifications(user.uid);
        initActivityLogs(user.uid);
        initVisitLog(user.uid);
        initCarePlan(user.uid);
        initCareTeam(user.uid);
        initTodaySchedule(user.uid);
        initHealthLog(user.uid);
    });

    // ─── UI CONTROLLER ───
    function toggleModal(modalId, show = true) {
        const modal = document.getElementById(modalId);
        if (modal) {
            if (show) modal.classList.add('active');
            else modal.classList.remove('active');
        }
    }

    function updateUIWithUserData(data) {
        document.querySelectorAll('.page-title').forEach(el => {
            if (el.closest('#page-dashboard')) el.textContent = `Good Day, ${data.firstName || 'Client'}`;
        });
        document.querySelectorAll('.user-name').forEach(el => el.textContent = `${data.firstName} ${data.lastName ? data.lastName.charAt(0) : ''}.`);
        const initials = (data.firstName.charAt(0) + (data.lastName ? data.lastName.charAt(0) : '')).toUpperCase();
        document.querySelectorAll('.user-avatar').forEach(av => av.textContent = initials);

        const setField = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val || "—";
        };
        setField('prof-fullName', `${data.firstName} ${data.lastName || ''}`);
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

    // ─── ACTION HANDLERS (FIXED WITH DB) ───
    document.getElementById('openEditProfile')?.addEventListener('click', () => {
        if (!cachedUserData) return;
        const form = document.getElementById('editProfileForm');
        Object.keys(cachedUserData).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) input.value = cachedUserData[key];
        });
        toggleModal('editProfileModal', true);
    });
    
    document.getElementById('closeEditProfile')?.addEventListener('click', () => toggleModal('editProfileModal', false));
    document.getElementById('cancelEditProfile')?.addEventListener('click', () => toggleModal('editProfileModal', false));
    
    document.getElementById('editProfileForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const updates = Object.fromEntries(new FormData(e.target).entries());
        try {
            await setDoc(doc(db, "clients", auth.currentUser.uid), updates, { merge: true });
            toggleModal('editProfileModal', false);
            alert("Profile updated.");
        } catch (e) { alert("Error: " + e.message); }
    });

    document.getElementById('openMessageComposer')?.addEventListener('click', () => toggleModal('messageModal', true));
    document.getElementById('closeMessageComposer')?.addEventListener('click', () => toggleModal('messageModal', false));
    document.getElementById('cancelMessage')?.addEventListener('click', () => toggleModal('messageModal', false));
    
    document.getElementById('messageForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        try {
            // FIX: Added 'db' parameter to addDoc
            await addDoc(collection(db, "messages"), {
                ...data,
                clientId: auth.currentUser.uid,
                senderName: `${cachedUserData.firstName} ${cachedUserData.lastName}`,
                senderRole: "Client",
                senderInitials: (cachedUserData.firstName[0] + (cachedUserData.lastName ? cachedUserData.lastName[0] : '')).toUpperCase(),
                timestamp: serverTimestamp(),
                read: true
            });
            toggleModal('messageModal', false);
            e.target.reset();
            alert("Secure message sent.");
        } catch (e) { alert("Error sending message: " + e.message); }
    });

    document.getElementById('openNurseScheduler')?.addEventListener('click', () => toggleModal('nurseSchedulerModal', true));
    document.getElementById('closeNurseScheduler')?.addEventListener('click', () => toggleModal('nurseSchedulerModal', false));
    document.getElementById('cancelNurseScheduler')?.addEventListener('click', () => toggleModal('nurseSchedulerModal', false));
    
    document.getElementById('nurseSchedulerForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        try {
            // FIX: Added 'db' parameter to addDoc
            await addDoc(collection(db, "nurse_visits"), {
                ...data,
                clientId: auth.currentUser.uid,
                timestamp: serverTimestamp(),
                status: "Pending"
            });
            toggleModal('nurseSchedulerModal', false);
            e.target.reset();
            alert("Nurse visit requested.");
        } catch (e) { alert("Error: " + e.message); }
    });

    // ─── HEALTH LOG (VITALS) ───
    function initHealthLog(uid) {
        const table = document.getElementById('vitalsTableBody');
        const q = query(collection(db, "vitals"), where("userId", "==", uid), orderBy("timestamp", "desc"), limit(20));
        onSnapshot(q, (snap) => {
            if (snap.empty) { table.innerHTML = '<tr><td colspan="6" class="text-center">No vitals logged.</td></tr>'; return; }
            table.innerHTML = '';
            snap.forEach((doc, index) => {
                const v = doc.data();
                if (index === 0) {
                    const elBp = document.getElementById('latest-bp');
                    const elHr = document.getElementById('latest-hr');
                    if (elBp) elBp.textContent = v.bp || '--/--';
                    if (elHr) elHr.textContent = v.hr ? `${v.hr} bpm` : '--';
                }
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${v.timestamp?.toDate().toLocaleDateString() || 'Just now'}</td><td>${v.bp || '--'}</td><td>${v.hr || '--'}</td><td>${v.temp || '--'}°F</td><td>${v.weight || '--'} lbs</td><td>${v.notes || ''}</td>`;
                table.appendChild(tr);
            });
        });
    }

    document.getElementById('openVitalsModal')?.addEventListener('click', () => toggleModal('vitalsModal', true));
    document.getElementById('closeVitalsModal')?.addEventListener('click', () => toggleModal('vitalsModal', false));
    document.getElementById('vitalsForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        try {
            await addDoc(collection(db, "vitals"), { ...data, userId: auth.currentUser.uid, timestamp: serverTimestamp() });
            toggleModal('vitalsModal', false);
            e.target.reset();
        } catch (err) { alert(err.message); }
    });

    // ─── NAVIGATION & OTHERS ───
    function initCarePlan(uid) {
        onSnapshot(query(collection(db, "care_plans"), where("clientId", "==", uid), orderBy("updatedAt", "desc"), limit(1)), (snap) => {
            const grid = document.getElementById('dynamicCarePlanGrid');
            if (snap.empty) { grid.innerHTML = '<p class="text-center">No active care plan found.</p>'; return; }
            const cp = snap.docs[0].data();
            grid.innerHTML = '';
            (cp.routines || []).forEach(r => {
                const card = document.createElement('div'); card.className = 'card careplan-card';
                card.innerHTML = `<div class=\"card-header\"><h3><i class=\"fa-solid ${r.icon}\"></i> ${r.name}</h3></div><div class=\"card-body\"><ul class=\"careplan-tasks\">${r.tasks.map(t => `<li><i class=\"fa-solid fa-check\"></i> ${t}</li>`).join('')}</ul></div>`;
                grid.appendChild(card);
            });
        });
    }

    function initCareTeam(uid) {
        onSnapshot(query(collection(db, "care_teams"), where("clientId", "==", uid)), (snap) => {
            const list = document.getElementById('realCareTeamList');
            if (snap.empty) { list.innerHTML = '<p>Assigning team...</p>'; return; }
            list.innerHTML = '';
            snap.forEach(docSnap => {
                docSnap.data().members.forEach(m => {
                    const div = document.createElement('div'); div.className = 'team-member';
                    div.innerHTML = `<div class=\"team-avatar\">${m.initials}</div><div class=\"team-info\"><h4>${m.name}</h4><p>${m.role}</p></div>`;
                    list.appendChild(div);
                });
            });
        });
    }

    function initMessaging(uid) {
        onSnapshot(query(collection(db, "messages"), where("clientId", "==", uid), orderBy("timestamp", "desc")), (snap) => {
            const msgList = document.getElementById('realMessageList');
            if (snap.empty) { msgList.innerHTML = '<p>No messages.</p>'; return; }
            msgList.innerHTML = '';
            snap.forEach(docSnap => {
                const m = docSnap.data();
                const div = document.createElement('div'); div.className = `message-item ${m.read ? '' : 'unread'}`;
                div.innerHTML = `<div class=\"msg-avatar\">${m.senderInitials || 'HH'}</div><div class=\"msg-content\"><div class=\"msg-header\"><strong>${m.senderName}</strong></div><h4>${m.subject}</h4><p>${m.body}</p></div>`;
                div.onclick = () => showConversation(docSnap.id, m); msgList.appendChild(div);
            });
        });
    }

    function showConversation(id, m) {
        const area = document.getElementById('messageViewArea');
        area.innerHTML = `<div class=\"conversation-header\"><h4>${m.subject}</h4></div><div class=\"conversation-body\" id=\"chatBody\"><div class=\"chat-bubble received\">${m.body}</div></div><div class=\"conversation-footer\"><form id=\"replyForm\" class=\"reply-box\"><input type=\"text\" class=\"form-input-custom\" placeholder=\"Type reply...\" required><button type=\"submit\" class=\"btn-primary-custom\">Send</button></form></div>`;
        document.getElementById('replyForm').onsubmit = async (e) => {
            e.preventDefault();
            const text = e.target.querySelector('input').value;
            try {
                await addDoc(collection(db, "messages"), { clientId: auth.currentUser.uid, subject: `Re: ${m.subject}`, body: text, senderName: `${cachedUserData.firstName} ${cachedUserData.lastName}`, senderRole: "Client", timestamp: serverTimestamp(), read: true });
                e.target.reset();
            } catch (err) { alert(err.message); }
        };
    }

    function initNotifications(uid) {
        onSnapshot(query(collection(db, "notifications"), where("userId", "==", uid), orderBy("timestamp", "desc"), limit(10)), (snap) => {
            const list = document.getElementById('notifList');
            if (snap.empty) { list.innerHTML = '<p>No notifications.</p>'; return; }
            list.innerHTML = ''; snap.forEach(ds => {
                const n = ds.data(); const div = document.createElement('div'); div.className = 'notif-item';
                div.innerHTML = `<h5>${n.title}</h5><p>${n.body}</p>`; list.appendChild(div);
            });
        });
        document.getElementById('notifBell')?.addEventListener('click', (e) => { e.stopPropagation(); document.getElementById('notifDropdown').classList.toggle('active'); });
    }

    function initActivityLogs(uid) {
        onSnapshot(query(collection(db, "activity"), where("userId", "==", uid), orderBy("timestamp", "desc"), limit(8)), (snap) => {
            const feed = document.getElementById('realActivityFeed');
            if (snap.empty) { feed.innerHTML = '<p>No activity.</p>'; return; }
            feed.innerHTML = ''; snap.forEach(ds => {
                const a = ds.data(); const div = document.createElement('div'); div.className = 'activity-item';
                div.innerHTML = `<div class=\"activity-dot\" style=\"background: ${a.color || '#C9A84C'}\"></div><div class=\"activity-content\"><p><strong>${a.title}</strong></p><span>${a.body}</span></div>`;
                feed.appendChild(div);
            });
        });
    }

    function initVisitLog(uid) {
        onSnapshot(query(collection(db, "visits"), where("clientId", "==", uid), orderBy("date", "desc")), (snap) => {
            const table = document.getElementById('visitTableBody');
            if (snap.empty) { table.innerHTML = '<tr><td colspan="7">No records</td></tr>'; return; }
            table.innerHTML = ''; snap.forEach(ds => {
                const v = ds.data(); const tr = document.createElement('tr');
                tr.innerHTML = `<td>${v.date}</td><td>${v.caregiver}</td><td>${v.service}</td><td>${v.checkIn || '--'}</td><td>${v.checkOut || '--'}</td><td>${v.hours || '0'}</td><td><span class=\"status-badge\">${v.status}</span></td>`;
                table.appendChild(tr);
            });
        });
    }

    function initTodaySchedule(uid) {
        onSnapshot(query(collection(db, "visits"), where("clientId", "==", uid), where("date", "==", new Date().toLocaleDateString('en-CA'))), (snap) => {
            const area = document.getElementById('realTodaySchedule');
            if (snap.empty) { area.innerHTML = '<p>No visits today.</p>'; return; }
            area.innerHTML = ''; snap.forEach(ds => {
                const v = ds.data(); const d = document.createElement('div'); d.className = 'schedule-item';
                d.innerHTML = `<h4>${v.service}</h4><p>${v.caregiver} — ${v.status}</p>`;
                area.appendChild(d);
            });
        });
    }

    function calculateClinicalMilestones(data) {
        if (!data.submittedAt) return;
        const start = data.submittedAt.toDate();
        const d60 = new Date(start); d60.setDate(d60.getDate() + 60);
        const d90 = new Date(start); d90.setDate(d90.getDate() + 90);
        const e60 = document.getElementById('date-60');
        const e90 = document.getElementById('date-90');
        if (e60) e60.textContent = d60.toLocaleDateString();
        if (e90) e90.textContent = d90.toLocaleDateString();
    }

    async function downloadPacket(btn) {
        if (!cachedUserData || !cachedUserData.signature) return alert("Enrollment data not found.");
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        try {
            const files = await generateClientPacket(cachedUserData);
            const index = parseInt(btn.dataset.fileIndex) || 0;
            const file = files[index];
            if (file) {
                const blob = new Blob([file.bytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const link = document.getElementById('pdfDownloadLink');
                link.href = url; link.download = file.name; link.click(); URL.revokeObjectURL(url);
            }
        } catch (e) { alert("Error generating PDF."); }
        finally { btn.innerHTML = original; }
    }

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.download-trigger') || e.target.closest('#viewSignedPacketDashboard');
        if (btn) downloadPacket(btn);
    });

    // ─── NAVIGATION ───
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-page]');
    const pages = document.querySelectorAll('.page');
    function navigateTo(pageId) {
        pages.forEach(p => p.classList.remove('active')); sidebarLinks.forEach(l => l.classList.remove('active'));
        document.getElementById(`page-${pageId}`)?.classList.add('active');
        document.querySelector(`.sidebar-link[data-page="${pageId}"]`)?.classList.add('active');
        document.getElementById('sidebar').classList.remove('open');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    sidebarLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); navigateTo(link.dataset.page); }));
    document.querySelectorAll('[data-goto]').forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); navigateTo(link.dataset.goto); }));
    document.querySelector('.sidebar-logout')?.addEventListener('click', async (e) => {
        e.preventDefault(); await signOut(auth); window.location.href = 'index.html';
    });
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));

    // Dashboard Quick Actions
    document.getElementById('quick-action-message')?.addEventListener('click', () => { navigateTo('messages'); toggleModal('messageModal', true); });
    document.getElementById('quick-action-download')?.addEventListener('click', () => navigateTo('documents'));
    document.getElementById('quick-action-schedule')?.addEventListener('click', () => { navigateTo('schedule'); toggleModal('nurseSchedulerModal', true); });
});
