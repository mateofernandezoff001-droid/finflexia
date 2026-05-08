import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/src/lib/firebase";

import { supabase } from "@/src/lib/supabase";

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'user' | 'admin';
  createdAt: number;
}

export class AuthService {
  private static instance: AuthService;

  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  subscribeToAuth(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  async ensureUserProfile(firebaseUser: FirebaseUser): Promise<UserProfile> {
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }

    const newUser: UserProfile = {
      userId: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || "FinFlex User",
      photoURL: firebaseUser.photoURL || "",
      role: 'user',
      createdAt: Date.now(),
    };

    await setDoc(userDocRef, newUser);
    return newUser;
  }

  async updatePassword(newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("No user authenticated");

    // Push security alert to Supabase activity_logs directly from client
    await supabase.from('activity_logs').insert({
      user_id: user.uid,
      action: "PASSWORD_CHANGE",
      metadata: JSON.stringify({ email: user.email }),
      created_at: new Date().toISOString()
    });
  }

  subscribeToProfile(userId: string, callback: (profile: UserProfile) => void) {
    return onSnapshot(doc(db, "users", userId), (snap) => {
      if (snap.exists()) {
        callback(snap.data() as UserProfile);
      }
    });
  }
}

export const authService = AuthService.getInstance();
