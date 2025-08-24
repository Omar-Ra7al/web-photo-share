"use client";
import { useAuthStore } from "@/lib/store/authStore";
import { auth } from "@/lib/firebase/config";
import { deleteProfilePicture } from "@/lib/firebase/services/userService";
import { TrashIcon } from "lucide-react";
const DeleteProfile = () => {
  const setUserProfile = useAuthStore((state) => state.setUserProfile);
  return (
    <button
      type="button" // ✅ important
      className="flex items-center gap-2 cursor-pointer transition-all duration-300 hover:text-red-500"
      onClick={() =>
        deleteProfilePicture().then(() =>
          setUserProfile({
            photoURL: auth.currentUser?.photoURL || "",
          })
        )
      }
    >
      <TrashIcon />
      DeleteProfile
    </button>
  );
};

export default DeleteProfile;
