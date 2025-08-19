import { useRouter } from "next/navigation";
import { deleteUserAccount } from "@/lib/firebase/auth";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

const DeleteAccButton = () => {
  const router = useRouter();
  return (
    <InteractiveHoverButton
      bg="bg-red-600"
      textColor="text-white"
      onClick={() => {
        deleteUserAccount(router);
      }}
    >
      DeleteAccButton
    </InteractiveHoverButton>
  );
};

export default DeleteAccButton;
