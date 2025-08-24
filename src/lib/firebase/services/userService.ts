import { auth } from "../config";
import { updateUserDocProfile } from "../fireStore";
import { deleteImageFromStorage, uploadImageToStorage } from "../storage";

export const uploadProfilePicture = async (file: File) => {
  if (!auth.currentUser) throw new Error("User not logged in");

  const uid = auth.currentUser.uid;

  const url = await uploadImageToStorage(file, `users/${uid}/profile.jpg`);

  await updateUserDocProfile({ photoURL: url });

  // Return the url to set it immeditley to store
  return url;
};

export async function deleteProfilePicture() {
  if (!auth.currentUser) throw new Error("User not logged in");

  const uid = auth.currentUser.uid;

  await deleteImageFromStorage(`users/${uid}/profile.jpg`);

  updateUserDocProfile({
    photoURL: auth.currentUser.photoURL || "",
  });
}
