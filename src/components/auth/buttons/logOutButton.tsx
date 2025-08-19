import { useRouter } from "next/navigation";
import { signOutUser } from "@/lib/firebase/auth";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

export default function LogOutButton() {
  const router = useRouter();
  return (
    <InteractiveHoverButton
      bg="bg-red-600"
      textColor="text-white"
      className="w-full"
      onClick={() => {
        signOutUser(true, router);
      }}
    >
      <span>Log out</span>
    </InteractiveHoverButton>
  );
}
