/**
 * PORTAL LOGIC — Heritage Connect
 * FULL PRODUCTION SUITE: Auth, Firestore Sync, Profile Editing, Messaging, Google Calendar, Notifications, Clinical Scheduler & Dynamic Care Plan.
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
                calculateClinicalMilestones(cachedUserData);
            }
        });

        // 2. Initialize Real-Time Systems
        initMessaging(user.uid);
        initNotifications(user.uid);
        initActivityLogs(user.uid);
        initVisitLog(user.uid);
        initCarePlan(user.uid);
        initCareTeam(user.uid);
        initTodaySchedule(user.uid);
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

    // ─── DYNAMIC CARE PLAN ───
    function initCarePlan(uid) {
        const grid = document.getElementById('dynamicCarePlanGrid');
        const subtitle = document.getElementById('careplan-subtitle');
        const q = query(collection(db, "care_plans"), where("clientId", "==", uid), orderBy("updatedAt", "desc"), limit(1));

        onSnapshot(q, (snap) => {
            if (snap.empty) {
                grid.innerHTML = '<div class="text-center" style="grid-column: 1/-1; padding: 50px; color: var(--text-muted);"><i class="fa-solid fa-file-circle-exclamation" style="font-size:2rem; margin-bottom:15px;"></i><p>No active care plan found. Please contact your RN.</p></div>';
                subtitle.textContent = "Your personalized plan of care — Pending RN Assessment";
                return;
            }
            
            const cp = snap.docs[0].data();
            subtitle.textContent = `Your personalized plan of care — Last updated ${cp.updatedAt?.toDate().toLocaleDateString() || 'Recently'}`;
            grid.innerHTML = '';

            // Routine Cards
            const routines = cp.routines || [];
            routines.forEach(r => {
                const card = document.createElement('div');
                card.className = 'card careplan-card';
                card.innerHTML = `
                    <div class="card-header">
                        <h3><i class="fa-solid ${r.icon || 'fa-sun'}" style="color: ${r.color || '#C9A84C'};"></i> ${r.name}</h3>
                        <span class="time-tag">${r.timeRange}</span>
                    </div>
                    <div class="card-body">
                        <ul class="careplan-tasks">
                            ${r.tasks.map(t => `<li><i class="fa-solid fa-check"></i> ${t}</li>`).join('')}
                        </ul>
                    </div>
                `;
                grid.appendChild(card);
            });

            // Clinical Notes
            const notesCard = document.createElement('div');
            notesCard.className = 'card careplan-card notes-card';
            notesCard.innerHTML = `
                <div class="card-header">
                    <h3><i class="fa-solid fa-clipboard-list" style="color: #10B981;"></i> Clinical Notes</h3>
                </div>
                <div class="card-body">
                    ${(cp.notes || []).map(n => `
                        <div class="clinical-note">
                            <div class="note-header">
                                <strong>${n.author}</strong>
                                <time>${n.date}</time>
                            </div>
                            <p>${n.text}</p>
                        </div>
                    `).join('')}
                </div>
            `;
            grid.appendChild(notesCard);
        });
    }

    // ─── DYNAMIC CARE TEAM ───
    function initCareTeam(uid) {
        const teamList = document.getElementById('realCareTeamList');
        const q = query(collection(db, "care_teams"), where("clientId", "==", uid));

        onSnapshot(q, (snap) => {
            if (snap.empty) {
                teamList.innerHTML = '<div class="text-center" style="padding: 20px; color: var(--text-muted);">Assigning your care team...</div>';
                return;
            }
            teamList.innerHTML = '';
            snap.forEach(doc => {
                const team = doc.data();
                (team.members || []).forEach(m => {
                    const div = document.createElement('div');
                    div.className = `team-member ${m.primary ? 'primary' : ''}`;
                    div.innerHTML = `
                        <div class="team-avatar ${m.roleCode || ''}">${m.initials}</div>
                        <div class="team-info">
                            <h4>${m.name}</h4>
                            <p>${m.role}</p>
                            <span class="team-status ${m.online ? 'online' : ''}">${m.statusText}</span>
                        </div>
                    `;
                    teamList.appendChild(div);
                });
            });
        });
    }

    // ─── TODAY'S SCHEDULE ───
    function initTodaySchedule(uid) {
        const scheduleArea = document.getElementById('realTodaySchedule');
        const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
        const q = query(collection(db, "visits"), where("clientId", "==", uid), where("date", "==", today));

        onSnapshot(q, (snap) => {
            if (snap.empty) {
                scheduleArea.innerHTML = '<div class="text-center" style="padding: 20px; color: var(--text-muted);">No visits scheduled for today.</div>';
                return;
            }
            scheduleArea.innerHTML = '';
            snap.forEach(doc => {
                const v = doc.data();
                const item = document.createElement('div');
                item.className = 'schedule-item';
                item.innerHTML = `
                    <div class="schedule-time">
                        <span class="time">${v.scheduledTime || '—'}</span>
                        <span class="duration">${v.hours || '—'} hrs</span>
                    </div>
                    <div class="schedule-bar ${v.status === 'Completed' ? 'active' : 'upcoming'}"></div>
                    <div class="schedule-details">
                        <h4>${v.service}</h4>
                        <p><i class="fa-solid fa-user-nurse"></i> ${v.caregiver} — <span class="status-badge ${v.status?.toLowerCase() || 'upcoming'}">${v.status || 'Scheduled'}</span></p>
                        ${v.checkIn ? `<p class="evv-tag"><i class="fa-solid fa-location-dot"></i> EVV Verified — ${v.checkIn} check-in</p>` : ''}
                    </div>
                `;
                scheduleArea.appendChild(item);
            });
        });
    }

    // ─── CLINICAL MILESTONES ───
    function calculateClinicalMilestones(userData) {
        if (!userData.submittedAt) return;
        const start = userData.submittedAt.toDate();
        const date60 = new Date(start); date60.setDate(date60.getDate() + 60);
        const date90 = new Date(start); date90.setDate(date90.getDate() + 90);
        const el60 = document.getElementById('date-60');
        const el90 = document.getElementById('date-90');
        if (el60) el60.textContent = date60.toLocaleDateString();
        if (el90) el90.textContent = date90.toLocaleDateString();
    }

    // ─── SECURE MESSAGING ───
    function initMessaging(uid) {
        const msgList = document.getElementById('realMessageList');
        const qMsg = query(collection(db, "messages"), where("clientId", "==", uid), orderBy("timestamp", "desc"));
        onSnapshot(qMsg, (snap) => {
            if (snap.empty) {
                msgList.innerHTML = '<div class="text-center" style="padding:40px; color:var(--text-muted);">No messages yet.</div>';
                return;
            }
            msgList.innerHTML = '';
            snap.forEach(docSnap => {
                const msg = docSnap.data();
                const item = document.createElement('div');
                item.className = `message-item ${msg.read ? '' : 'unread'}`;
                item.innerHTML = `
                    <div class="msg-avatar ${msg.senderRole === 'Nurse' ? 'rn' : 'cc'}">${msg.senderInitials || 'HH'}</div>
                    <div class="msg-content">
                        <div class="msg-header">
                            <strong>${msg.senderName}</strong>
                            <time>${msg.timestamp?.toDate().toLocaleDateString() || 'Just now'}</time>
                        </div>
                        <h4>${msg.subject}</h4>
                        <p>${msg.body}</p>
                    </div>
                `;
                item.onclick = () => showConversation(docSnap.id, msg);
                msgList.appendChild(item);
            });
        });
    }

    function showConversation(msgId, msg) {
        const viewArea = document.getElementById('messageViewArea');
        viewArea.innerHTML = `
            <div class="conversation-header">
                <h4>${msg.subject}</h4>
                <p style="margin:4px 0 0; font-size:0.8rem; color:var(--text-muted)">Conversation with Care Team</p>
            </div>
            <div class="conversation-body" id="chatBody">
                <div class="chat-bubble ${msg.senderRole === 'Client' ? 'sent' : 'received'}">
                    ${msg.body}
                    <span class="chat-time">${msg.timestamp?.toDate().toLocaleString() || 'Just now'}</span>
                </div>
            </div>
            <div class="conversation-footer">
                <form class="reply-box" id="replyForm">
                    <input type="text" class="form-input-custom" placeholder="Type a secure reply..." required>
                    <button type="submit" class="btn-primary-custom">Send</button>
                </form>
            </div>
        `;
        const replyForm = document.getElementById('replyForm');
        replyForm.onsubmit = async (e) => {
            e.preventDefault();
            const input = replyForm.querySelector('input');
            const replyText = input.value.trim();
            if (!replyText) return;
            const replyMsg = {
                clientId: auth.currentUser.uid,
                subject: `Re: ${msg.subject}`,
                body: replyText,
                senderName: `${cachedUserData.firstName} ${cachedUserData.lastName}`,
                senderRole: "Client",
                senderInitials: (cachedUserData.firstName[0] + (cachedUserData.lastName ? cachedUserData.lastName[0] : '')).toUpperCase(),
                timestamp: serverTimestamp(),
                read: true,
                parentId: msgId
            };
            try {
                await addDoc(collection(db, "messages"), replyMsg);
                input.value = '';
                const div = document.createElement('div');
                div.className = 'chat-bubble sent';
                div.innerHTML = `${replyText}<span class="chat-time">Just now</span>`;
                document.getElementById('chatBody').appendChild(div);
            } catch (err) { alert(err.message); }
        };
    }

    // ─── NOTIFICATIONS & ACTIVITY ───
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
                item.innerHTML = `<div class="notif-icon"><i class="fa-solid ${n.icon || 'fa-bell'}"></i></div><div class="notif-content"><h5>${n.title}</h5><p>${n.body}</p><time>${n.timestamp?.toDate().toLocaleString() || 'Just now'}</time></div>`;
                notifList.appendChild(item);
            });
            notifDot.style.display = unreadCount > 0 ? 'block' : 'none';
        });
        document.getElementById('notifBell')?.addEventListener('click', (e) => { e.stopPropagation(); document.getElementById('notifDropdown').classList.toggle('active'); });
        document.addEventListener('click', () => document.getElementById('notifDropdown')?.classList.remove('active'));
    }

    function initActivityLogs(uid) {
        const feed = document.getElementById('realActivityFeed');
        const q = query(collection(db, "activity"), where("userId", "==", uid), orderBy("timestamp", "desc"), limit(8));
        onSnapshot(q, (snap) => {
            if (snap.empty) { feed.innerHTML = '<div class="text-center" style="padding: 20px; color: var(--text-muted);">No recent activity.</div>'; return; }
            feed.innerHTML = '';
            snap.forEach(doc => {
                const a = doc.data();
                const item = document.createElement('div');
                item.className = 'activity-item';
                item.innerHTML = `<div class=\"activity-dot\" style=\"background: ${a.color || '#C9A84C'};\"></div><div class=\"activity-content\"><p><strong>${a.title}</strong></p><span>${a.body}</span><time>${a.timestamp?.toDate().toLocaleString() || 'Just now'}</time></div>`;
                feed.appendChild(item);
            });
        });
    }

    function initVisitLog(uid) {
        const table = document.getElementById('visitTableBody');
        const q = query(collection(db, "visits"), where("clientId", "==", uid), orderBy("date", "desc"));
        onSnapshot(q, (snap) => {
            if (snap.empty) { table.innerHTML = '<tr><td colspan="7" class="text-center">No visit records found.</td></tr>'; return; }
            table.innerHTML = '';
            snap.forEach(doc => {
                const v = doc.data();
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${v.date}</td><td>${v.caregiver}</td><td>${v.service}</td><td>${v.checkIn}</td><td>${v.checkOut}</td><td>${v.hours}</td><td><span class=\"status-badge ${v.status === 'Verified' ? 'verified' : 'missed'}\">${v.status}</span></td>`;
                table.appendChild(tr);
            });
        });
    }

    // ─── SHARED LOGIC (PROFILE, SCHEDULER, DOCS) ───
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
    editForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const updates = Object.fromEntries(new FormData(editForm).entries());
        try {
            await setDoc(doc(db, "clients", auth.currentUser.uid), updates, { merge: true });
            editModal.classList.remove('active');
        } catch (err) { alert(err.message); }
    });

    const schedulerModal = document.getElementById('nurseSchedulerModal');
    const schedulerForm = document.getElementById('nurseSchedulerForm');
    document.getElementById('openNurseScheduler')?.addEventListener('click', () => schedulerModal.classList.add('active'));
    document.getElementById('closeNurseScheduler')?.addEventListener('click', () => schedulerModal.classList.remove('active'));
    schedulerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const requestData = { ...Object.fromEntries(new FormData(schedulerForm).entries()), clientId: auth.currentUser.uid, timestamp: serverTimestamp() };
        try {
            await addDoc(collection(db, "nurse_visits"), requestData);
            schedulerModal.classList.remove('active');
            alert("Requested.");
        } catch (err) { alert(err.message); }
    });

    async function downloadPacket(btn) {
        if (!cachedUserData || !cachedUserData.signature) return alert("No enrollment data.");
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
        try {
            const files = await generateClientPacket(cachedUserData);
            if (files && files.length > 0) {
                const file = files[0];
                const blob = new Blob([file.bytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const link = document.getElementById('pdfDownloadLink');
                if (link) { link.href = url; link.download = file.name; link.click(); URL.revokeObjectURL(url); }
            }
        } catch (err) { alert("Error."); }
        finally { btn.innerHTML = originalHTML; }
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
