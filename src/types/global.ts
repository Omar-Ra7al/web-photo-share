import { Timestamp } from "firebase/firestore";

export interface UserProfileInfo {
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
  createdAt: Timestamp;
}
