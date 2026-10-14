import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase';

export interface AuthUserState {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export async function registerWithEmail(
  email: string,
  pass: string,
  displayName?: string
): Promise<FirebaseUser> {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  if (displayName && credential.user) {
    await updateProfile(credential.user, {
      displayName: displayName.trim(),
    });
  }
  return credential.user;
}

export async function loginWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return credential.user;
}

export async function loginWithGooglePopup(): Promise<FirebaseUser> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentAuthUser(): FirebaseUser | null {
  return auth.currentUser;
}
