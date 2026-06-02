import { 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  onSnapshot, 
  collection, 
  getDocFromServer 
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, OperationType, handleFirestoreError } from './googleAuth';

// Test connection on boot as mandated in the instructions
export async function testFirestoreConnection() {
  const dummyDoc = doc(db, 'test', 'connection');
  try {
    await getDocFromServer(dummyDoc);
    console.log("Firebase Connection verified successfully.");
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or network status.", error);
    }
  }
}

// 1. User details record synchronization (Registration / User Profile)
export async function syncUserRecord(user: User) {
  const userPath = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    const payload = {
      userId: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Sovereign Agent',
      updatedAt: new Date().toISOString()
    };

    if (!docSnap.exists()) {
      // First-time signup / creation
      await setDoc(userRef, {
        ...payload,
        createdAt: new Date().toISOString()
      });
    } else {
      // Update metadata on subsequent logins
      await setDoc(userRef, payload, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }
}

// 2. Real-time syncing for Kylrix Notes (Subcollection)
export function subscribeNotes(userId: string, callback: (notes: any[]) => void, onError: (errInfo: any) => void) {
  const notesPath = `users/${userId}/notes`;
  const notesRef = collection(db, 'users', userId, 'notes');
  
  return onSnapshot(notesRef, (snapshot) => {
    const notesList: any[] = [];
    snapshot.forEach((doc) => {
      notesList.push({ id: doc.id, ...doc.data() });
    });
    // Sort chronologically or use safe updatedAt sorting if present
    notesList.sort((a, b) => b.updatedAt?.localeCompare(a.updatedAt) || 0);
    callback(notesList);
  }, (error) => {
    try {
      handleFirestoreError(error, OperationType.LIST, notesPath);
    } catch (err: any) {
      onError(err);
    }
  });
}

export async function addNoteCloud(userId: string, noteId: string, title: string, content: string = '') {
  const path = `users/${userId}/notes/${noteId}`;
  try {
    const docRef = doc(db, 'users', userId, 'notes', noteId);
    await setDoc(docRef, {
      userId,
      title: title || 'Untitled Note',
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateNoteCloud(userId: string, noteId: string, title: string, content: string) {
  const path = `users/${userId}/notes/${noteId}`;
  try {
    const docRef = doc(db, 'users', userId, 'notes', noteId);
    await setDoc(docRef, {
      userId,
      title,
      content,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteNoteCloud(userId: string, noteId: string) {
  const path = `users/${userId}/notes/${noteId}`;
  try {
    const docRef = doc(db, 'users', userId, 'notes', noteId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 3. Real-time syncing for Kylrix Flow Tasks (Subcollection)
export function subscribeTasks(userId: string, callback: (tasks: any[]) => void, onError: (errInfo: any) => void) {
  const tasksPath = `users/${userId}/tasks`;
  const tasksRef = collection(db, 'users', userId, 'tasks');

  return onSnapshot(tasksRef, (snapshot) => {
    const tasksList: any[] = [];
    snapshot.forEach((doc) => {
      tasksList.push({ id: doc.id, ...doc.data() });
    });
    // Keep consistent sorting order or sort by timestamp
    tasksList.sort((a, b) => b.createdAt?.localeCompare(a.createdAt) || 0);
    callback(tasksList);
  }, (error) => {
    try {
      handleFirestoreError(error, OperationType.LIST, tasksPath);
    } catch (err: any) {
      onError(err);
    }
  });
}

export async function addTaskCloud(userId: string, taskId: string, task: string, priority: string, status: string) {
  const path = `users/${userId}/tasks/${taskId}`;
  try {
    const docRef = doc(db, 'users', userId, 'tasks', taskId);
    await setDoc(docRef, {
      userId,
      task,
      priority,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateTaskCloud(userId: string, taskId: string, task: string, priority: string, status: string) {
  const path = `users/${userId}/tasks/${taskId}`;
  try {
    const docRef = doc(db, 'users', userId, 'tasks', taskId);
    await setDoc(docRef, {
      userId,
      task,
      priority,
      status,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteTaskCloud(userId: string, taskId: string) {
  const path = `users/${userId}/tasks/${taskId}`;
  try {
    const docRef = doc(db, 'users', userId, 'tasks', taskId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
