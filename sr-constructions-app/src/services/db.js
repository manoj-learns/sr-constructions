import {
  collection, doc, getDocs, getDoc,
  addDoc, setDoc, deleteDoc, updateDoc,
  orderBy, query, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

// ── Cloudinary URL helper ─────────────────────────────────
// For view: return URL as-is (browser displays PDF natively).
// For download: insert fl_attachment into the existing resource-type path.
// fl_inline is NOT a valid Cloudinary flag and is never used.
export const cloudinaryUrl = (url, flag) => {
  if (!url?.includes('cloudinary.com')) return url;
  if (flag === 'fl_inline') return url; // just open directly — browser handles inline display
  return url.replace(/\/upload\//, `/upload/${flag}/`);
};

// ── Projects ──────────────────────────────────────────────
export const getProjects = async () => {
  const q = query(collection(db, 'projects'), orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getProject = async (id) => {
  const snap = await getDoc(doc(db, 'projects', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const addProject = async (data) => {
  return addDoc(collection(db, 'projects'), { ...data, createdAt: serverTimestamp() });
};

export const upsertProject = async (id, data) => {
  return setDoc(doc(db, 'projects', id), { ...data, createdAt: serverTimestamp() }, { merge: true });
};

export const updateProject = async (id, data) => {
  return updateDoc(doc(db, 'projects', id), data);
};

export const deleteProject = async (id) => {
  return deleteDoc(doc(db, 'projects', id));
};

// ── Ongoing ───────────────────────────────────────────────
export const getOngoing = async () => {
  const q = query(collection(db, 'ongoing'), orderBy('createdAt', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getOngoingById = async (id) => {
  const snap = await getDoc(doc(db, 'ongoing', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const addOngoing = async (data) => {
  return addDoc(collection(db, 'ongoing'), { ...data, createdAt: serverTimestamp() });
};

export const upsertOngoing = async (id, data) => {
  return setDoc(doc(db, 'ongoing', id), { ...data, createdAt: serverTimestamp() }, { merge: true });
};

export const updateOngoing = async (id, data) => {
  return updateDoc(doc(db, 'ongoing', id), data);
};

export const deleteOngoing = async (id) => {
  return deleteDoc(doc(db, 'ongoing', id));
};

// ── Contacts ──────────────────────────────────────────────
export const getContacts = async () => {
  const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const addContact = async (data) => {
  return addDoc(collection(db, 'contacts'), { ...data, read: false, createdAt: serverTimestamp() });
};

export const markContactRead = async (id) => {
  return updateDoc(doc(db, 'contacts', id), { read: true });
};

export const deleteContact = async (id) => {
  return deleteDoc(doc(db, 'contacts', id));
};

// ── Cloudinary File Upload (PDF brochures) ────────────────
export const uploadFile = (file, folder, onProgress) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'sr_constructions');
    formData.append('folder', folder);
    formData.append('access_mode', 'public');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/dos9ucizg/raw/upload');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText).secure_url);
      } else {
        try { reject(new Error(JSON.parse(xhr.responseText).error?.message || 'Upload failed')); }
        catch { reject(new Error('Upload failed')); }
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
};

// ── Cloudinary Image Upload ───────────────────────────────
export const uploadImage = (file, folder, onProgress) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'sr_constructions');
    formData.append('folder', folder);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/dos9ucizg/image/upload');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText).secure_url);
      } else {
        try { reject(new Error(JSON.parse(xhr.responseText).error?.message || 'Upload failed')); }
        catch { reject(new Error('Upload failed — check your Cloudinary upload preset name')); }
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
};
