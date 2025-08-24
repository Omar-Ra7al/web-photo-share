import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./config";

export const uploadImageToStorage = async (file: File, path: string) => {
  // Create refeence to the image
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};

export const deleteImageFromStorage = async (path: string) => {
  // Reference to the profile picture
  const storageRef = ref(storage, path);

  // Delete the file from Storage
  await deleteObject(storageRef);
};
