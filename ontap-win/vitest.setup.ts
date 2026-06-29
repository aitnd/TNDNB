import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase Client exports
vi.mock('./services/firebaseClient', () => {
  return {
    auth: {
      currentUser: {
        uid: 'test-admin-uid',
        email: 'admin@tndnb.com',
        getIdToken: () => Promise.resolve('mock-token'),
      },
    },
    db: {},
    rtdb: {},
    storage: {},
    app: {},
  };
});

// Mock Firestore functions
vi.mock('firebase/firestore', () => {
  return {
    getFirestore: vi.fn(),
    doc: vi.fn((_db, _collection, id) => ({ id })),
    updateDoc: vi.fn(() => Promise.resolve()),
    collection: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
    deleteDoc: vi.fn(() => Promise.resolve()),
  };
});

// Mock Firebase Auth functions
vi.mock('firebase/auth', () => {
  return {
    getAuth: vi.fn(),
    setPersistence: vi.fn(() => Promise.resolve()),
    browserLocalPersistence: {},
    EmailAuthProvider: {
      credential: vi.fn(),
    },
    reauthenticateWithCredential: vi.fn(() => Promise.resolve()),
    updatePassword: vi.fn(() => Promise.resolve()),
  };
});

// Mock userService
vi.mock('./services/userService', () => {
  return {
    getDefaultAvatar: vi.fn((role) => `mock-avatar-${role || 'guest'}`),
    uploadAvatar: vi.fn(() => Promise.resolve('mock-public-url')),
  };
});

// Mock authSessionService
vi.mock('./services/authSessionService', () => {
  return {
    getActiveSessions: vi.fn(() => Promise.resolve([])),
    logoutRemoteSession: vi.fn(() => Promise.resolve()),
  };
});
