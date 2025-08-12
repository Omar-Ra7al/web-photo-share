"use clien";
import { Button } from "../ui/button";
import { deleteUserAccount } from "@/lib/firebase/auth";
const DeleteAccButton = () => {
  return <Button onClick={deleteUserAccount}>DeleteAccButton</Button>;
};

export default DeleteAccButton;
