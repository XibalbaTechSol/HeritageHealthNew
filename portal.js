/**
 * PORTAL LOGIC — Heritage Connect
 * PRODUCTION READY: Full navigation, dynamic modals, real-time sync, and validated actions.
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
            if (el.closest('#page-dashboard')) el.textContent = `Good Day, ${data.firstName}`;
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

    // ─── REAL-TIME DATA LISTENERS ───
    function initCarePlan(uid) {
        const grid = document.getElementById('dynamicCarePlanGrid');
        const q = query(collection(db, "care_plans"), where("clientId", "==", uid), orderBy("updatedAt", "desc"), limit(1));
        onSnapshot(q, (snap) => {
            if (snap.empty) { grid.innerHTML = '<p class="text-center">No care plan found.</p>'; return; }
            const cp = snap.docs[0].data();
            grid.innerHTML = '';
            (cp.routines || []).forEach(r => {
                const card = document.createElement('div');
                card.className = 'card careplan-card';
                card.innerHTML = `<div class=\"card-header\"><h3><i class=\"fa-solid ${r.icon}\"></i> ${r.name}</h3></div><div class=\"card-body\"><ul class=\"careplan-tasks\">${r.tasks.map(t => `<li><i class=\"fa-solid fa-check\"></i> ${t}</li>`).join('')}</ul></div>`;
                grid.appendChild(card);
            });
        });
    }

    function initCareTeam(uid) {
        const teamList = document.getElementById('realCareTeamList');
        onSnapshot(query(collection(db, "care_teams"), where("clientId", "==", uid)), (snap) => {
            if (snap.empty) { teamList.innerHTML = '<p>Assigning team...</p>'; return; }
            teamList.innerHTML = '';
            snap.forEach(doc => {
                doc.data().members.forEach(m => {
                    const div = document.createElement('div');
                    div.className = 'team-member';
                    div.innerHTML = `<div class=\"team-avatar\">${m.initials}</div><div class=\"team-info\"><h4>${m.name}</h4><p>${m.role}</p></div>`;
                    teamList.appendChild(div);
                });
            });
        });
    }

    function initTodaySchedule(uid) {
        const area = document.getElementById('realTodaySchedule');
        onSnapshot(query(collection(db, "visits"), where("clientId", "==", uid), where("date", "==", new Date().toLocaleDateString('en-CA'))), (snap) => {
            if (snap.empty) { area.innerHTML = '<p>No visits today.</p>'; return; }
            area.innerHTML = '';
            snap.forEach(doc => {
                const v = doc.data();
                const item = document.createElement('div');
                item.className = 'schedule-item';
                item.innerHTML = `<div class=\"schedule-details\"><h4>${v.service}</h4><p>${v.caregiver} — ${v.status}</p></div>`;
                area.appendChild(item);
            });
        });
    }

    function calculateClinicalMilestones(data) {
        if (!data.submittedAt) return;
        const start = data.submittedAt.toDate();
        const d60 = new Date(start); d60.setDate(d60.getDate() + 60);
        const d90 = new Date(start); d90.setDate(d90.getDate() + 90);
        const el60 = document.getElementById('date-60');
        const el90 = document.getElementById('date-90');
        if (el60) el60.textContent = d60.toLocaleDateString();
        if (el90) el90.textContent = d90.toLocaleDateString();
    }

    function initVisitLog(uid) {
        const table = document.getElementById('visitTableBody');
        const q = query(collection(db, "visits"), where("clientId", "==", uid), orderBy("date", "desc"));
        onSnapshot(q, (snap) => {
            if (snap.empty) { table.innerHTML = '<tr><td colspan="7" class="text-center">No visit records found.</td></tr>'; return; }
            table.innerHTML = '';
            snap.forEach(docSnap => {
                const v = docSnap.data();
                const tr = document.createElement('tr');
                const statusClass = v.status === 'Verified' ? 'verified' : 'missed';
                tr.innerHTML = `
                    <td>${v.date}</td>
                    <td>${v.caregiver}</td>
                    <td>${v.service}</td>
                    <td>${v.checkIn || '--'}</td>
                    <td>${v.checkOut || '--'}</td>
                    <td>${v.hours || '0'}</td>
                    <td><span class="status-badge ${statusClass}">${v.status}</span></td>
                `;
                table.appendChild(tr);
            });
        });
    }

    function initActivityLogs(uid) {
        const feed = document.getElementById('realActivityFeed');
        const q = query(collection(db, "activity"), where("userId", "==", uid), orderBy("timestamp", "desc"), limit(8));
        onSnapshot(q, (snap) => {
            if (snap.empty) { feed.innerHTML = '<p>No activity yet.</p>'; return; }
            feed.innerHTML = '';
            snap.forEach(docSnap => {
                const a = docSnap.data();
                const div = document.createElement('div');
                div.className = 'activity-item';
                div.innerHTML = `
                    <div class="activity-dot" style="background: ${a.color || '#C9A84C'}"></div>
                    <div class="activity-content">
                        <p><strong>${a.title}</strong></p>
                        <span>${a.body}</span>
                        <time>${a.timestamp?.toDate().toLocaleString() || 'Just now'}</time>
                    </div>
                `;
                feed.appendChild(div);
            });
        });
    }

    function initNotifications(uid) {
        const list = document.getElementById('notifList');
        const dot = document.getElementById('notifDot');
        const q = query(collection(db, "notifications"), where("userId", "==", uid), orderBy("timestamp", "desc"), limit(10));
        onSnapshot(q, (snap) => {
            let unread = 0;
            if (snap.empty) { list.innerHTML = '<p>No notifications.</p>'; dot.style.display = 'none'; return; }
            list.innerHTML = '';
            snap.forEach(docSnap => {
                const n = docSnap.data();
                if (!n.read) unread++;
                const div = document.createElement('div');
                div.className = `notif-item ${n.read ? '' : 'unread'}`;
                div.innerHTML = `<h5>${n.title}</h5><p>${n.body}</p>`;
                list.appendChild(div);
            });
            dot.style.display = unread > 0 ? 'block' : 'none';
        });
        document.getElementById('notifBell')?.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('notifDropdown').classList.toggle('active');
        });
    }

    function initMessaging(uid) {
        const msgList = document.getElementById('realMessageList');
        const q = query(collection(db, "messages"), where("clientId", "==", uid), orderBy("timestamp", "desc"));
        onSnapshot(q, (snap) => {
            if (snap.empty) { msgList.innerHTML = '<p>No messages.</p>'; return; }
            msgList.innerHTML = '';
            snap.forEach(docSnap => {
                const m = docSnap.data();
                const div = document.createElement('div');
                div.className = `message-item ${m.read ? '' : 'unread'}`;
                div.innerHTML = `
                    <div class="msg-avatar">${m.senderInitials || 'HH'}</div>
                    <div class="msg-content">
                        <div class="msg-header"><strong>${m.senderName}</strong></div>
                        <h4>${m.subject}</h4>
                        <p>${m.body}</p>
                    </div>
                `;
                div.onclick = () => showConversation(docSnap.id, m);
                msgList.appendChild(div);
            });
        });
    }

    function showConversation(id, m) {
        const area = document.getElementById('messageViewArea');
        selectedMessageId = id;
        area.innerHTML = `
            <div class="conversation-header"><h4>${m.subject}</h4></div>
            <div class="conversation-body" id="chatBody">
                <div class="chat-bubble received">${m.body}</div>
            </div>
            <div class="conversation-footer">
                <form id="replyForm" class="reply-box">
                    <input type="text" class="form-input-custom" placeholder="Type reply..." required>
                    <button type="submit" class="btn-primary-custom">Send</button>
                </form>
            </div>
        `;
        document.getElementById('replyForm').onsubmit = async (e) => {
            e.preventDefault();
            const text = e.target.querySelector('input').value;
            await addDoc(collection(db, "messages"), {
                clientId: auth.currentUser.uid,
                subject: `Re: ${m.subject}`,
                body: text,
                senderName: `${cachedUserData.firstName} ${cachedUserData.lastName}`,
                senderRole: "Client",
                timestamp: serverTimestamp(),
                read: true
            });
            e.target.reset();
        };
    }

    // ─── ACTION HANDLERS ───
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
        } catch (e) { alert(e.message); }
    });

    document.getElementById('openMessageComposer')?.addEventListener('click', () => toggleModal('messageModal', true));
    document.getElementById('closeMessageComposer')?.addEventListener('click', () => toggleModal('messageModal', false));
    document.getElementById('cancelMessage')?.addEventListener('click', () => toggleModal('messageModal', false));
    
    document.getElementById('messageForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        await addDoc(collection(db, "messages"), {
            ...data,
            clientId: auth.currentUser.uid,
            senderName: `${cachedUserData.firstName} ${cachedUserData.lastName}`,
            senderRole: "Client",
            timestamp: serverTimestamp(),
            read: true
        });
        toggleModal('messageModal', false);
        e.target.reset();
    });

    document.getElementById('openNurseScheduler')?.addEventListener('click', () => toggleModal('nurseSchedulerModal', true));
    document.getElementById('closeNurseScheduler')?.addEventListener('click', () => toggleModal('nurseSchedulerModal', false));
    document.getElementById('cancelNurseScheduler')?.addEventListener('click', () => toggleModal('nurseSchedulerModal', false));
    
    document.getElementById('nurseSchedulerForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        await addDoc(collection(db, "nurse_visits"), {
            ...data,
            clientId: auth.currentUser.uid,
            timestamp: serverTimestamp(),
            status: "Pending"
        });
        toggleModal('nurseSchedulerModal', false);
        alert("Visit requested.");
    });

    async function downloadPacket(btn) {
        if (!cachedUserData || !cachedUserData.signature) return alert("No enrollment data found.");
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
        try {
            const files = await generateClientPacket(cachedUserData);
            if (files && files.length > 0) {
                const file = files[0];
                const blob = new Blob([file.bytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const link = document.getElementById('pdfDownloadLink');
                link.href = url; link.download = file.name; link.click();
                URL.revokeObjectURL(url);
            }
        } catch (e) { alert("Error generating PDF."); }
        finally { btn.innerHTML = original; }
    }

    document.getElementById('viewSignedPacket')?.addEventListener('click', (e) => downloadPacket(e.currentTarget));
    document.getElementById('viewSignedPacketDashboard')?.addEventListener('click', (e) => downloadPacket(e.currentTarget));

    // Dashboard Quick Actions
    document.getElementById('quick-action-message')?.addEventListener('click', () => {
        navigateTo('messages');
        toggleModal('messageModal', true);
    });
    document.getElementById('quick-action-download')?.addEventListener('click', () => navigateTo('documents'));
    document.getElementById('quick-action-schedule')?.addEventListener('click', () => {
        navigateTo('schedule');
        toggleModal('nurseSchedulerModal', true);
    });

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
    sidebarLinks.forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); navigateTo(link.dataset.page); }));
    document.querySelectorAll('[data-goto]').forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); navigateTo(link.dataset.goto); }));
    document.querySelector('.sidebar-logout')?.addEventListener('click', async (e) => {
        e.preventDefault();
        await signOut(auth);
        window.location.href = 'index.html';
    });
    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));

});
