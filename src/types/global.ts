import { Timestamp } from "firebase/firestore";

export interface UserProfileInfo {
  firstName: string;
  lastName: string;
  email: string;
  emailProvider: string[] | null;
  role: "user" | "admin";
  createdAt: Timestamp;
}
