"use clien";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { deleteUserAccount } from "@/lib/firebase/auth";

const DeleteAccButton = () => {
  return (
    <InteractiveHoverButton
      bg="bg-red-600"
      textColor="text-white"
      onClick={deleteUserAccount}
    >
      DeleteAccButton
    </InteractiveHoverButton>
  );
};

export default DeleteAccButton;
