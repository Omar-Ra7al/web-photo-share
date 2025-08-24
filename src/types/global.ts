import { Timestamp } from "firebase/firestore";

export interface UserProfileInfo {
  firstName: string;
  lastName: string;
  email: string;
  emailProvider: string[] | null;
  photoURL: string | null | File;
  role: "user" | "admin";
  createdAt: Timestamp;
}
