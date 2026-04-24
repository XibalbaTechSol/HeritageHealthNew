/**
 * PORTAL LOGIC — Heritage Connect
 * FULL PRODUCTION SUITE: Auth, Firestore Sync, Profile Editing, Messaging, & dynamic ROI.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc, 
    setDoc, 
    collection, 
    addDoc, 
    query, 
    where, 
    orderBy, 
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

document.addEventListener('DOMContentLoaded', () => {

    let cachedUserData = null;

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

        // 2. Initialize Messaging Listener
        initMessaging(user.uid);
    });


    function updateUIWithUserData(data) {
        // Dashboard
        const greeting = document.querySelector('.page-title');
        if (greeting && data.firstName) greeting.textContent = `Good Day, ${data.firstName}`;
        
        const sidebarName = document.querySelector('.user-name');
        if (sidebarName && data.firstName) sidebarName.textContent = `${data.firstName} ${data.lastName.charAt(0)}.`;

        const initials = (data.firstName.charAt(0) + data.lastName.charAt(0)).toUpperCase();
        document.querySelectorAll('.user-avatar').forEach(av => av.textContent = initials);

        // Profile Details
        const setField = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val || "—";
        };
        setField('prof-fullName', `${data.firstName} ${data.lastName}`);
        setField('prof-uid', data.uid);
        setField('prof-dob', data.dob);
        setField('prof-phone', data.pcwPhone);
        setField('prof-address', `${data.address}, ${data.city}, WI ${data.zip}`);
        setField('prof-medicaid', data.medicaidNumber);
        setField('prof-language', data.language);
        setField('prof-gender', data.gender);
        setField('prof-doctor', data.doctorName);
        setField('prof-docLoc', data.doctorLocation);
        setField('prof-pcw', data.pcwName);
        setField('prof-status', data.status || "Active");
    }

    // ─── PROFILE EDITING ───
    const editModal = document.getElementById('editProfileModal');
    const editForm = document.getElementById('editProfileForm');

    document.getElementById('openEditProfile')?.addEventListener('click', () => {
        if (!cachedUserData) return;
        // Pre-fill form
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
            editModal.classList.remove('active');
            alert("Profile updated successfully.");
        } catch (err) {
            alert("Error updating profile: " + err.message);
        }
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
            senderName: `${cachedUserData.firstName} ${cachedUserData.lastName}`, // Client is sender
            senderRole: "Client",
            senderInitials: (cachedUserData.firstName[0] + cachedUserData.lastName.charAt(0)).toUpperCase(),
            timestamp: serverTimestamp(),
            read: true // Already seen by sender
        };

        try {
            await addDoc(collection(db, "messages"), newMsg);
            msgModal.classList.remove('active');
            msgForm.reset();
            alert("Secure message sent to clinical team.");
        } catch (err) {
            alert("Error sending message: " + err.message);
        }
    });

    // ─── DOCUMENT GENERATION ───
    async function downloadPacket(btn) {
        if (!cachedUserData || !cachedUserData.signature) {
            alert("Enrollment data not found. Please complete the registration wizard.");
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
                }
            }
        } catch (err) {
            console.error("PDF View Error:", err);
            alert("Error generating clinical packet.");
        } finally {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }
    }

    document.getElementById('viewSignedPacket')?.addEventListener('click', (e) => downloadPacket(e.currentTarget));
    document.getElementById('viewSignedPacketDashboard')?.addEventListener('click', (e) => downloadPacket(e.currentTarget));

    // ─── NAVIGATION & UI ───
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
        if (confirm('Sign out of Heritage Connect?')) {
            await signOut(auth);
            window.location.href = 'index.html';
        }
    });

    document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });

});
