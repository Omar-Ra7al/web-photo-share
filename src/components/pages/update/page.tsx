import UpdateProfile from "./updateProfileForm";
import { useAuthStore } from "@/lib/store/authStore";
import DeleteAcc from "./deleteAcc";
import Loader from "@/components/shared/layout/loader";
const Page = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Loader />;
  } else {
    return (
      <>
        <UpdateProfile />
        <DeleteAcc />
      </>
    );
  }
};

export default Page;
