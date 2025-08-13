"use client";
import DeleteAccButton from "@/components/auth/buttons/deleteAccButton";
import UpdateProfile from "@/components/auth/forms/updateProfileForm";
import Heading from "@/components/shared/style/heading";
import Section from "@/components/shared/style/section";
const page = () => {
  return (
    <>
      <UpdateProfile />
      <Section type="outer" className="flex flex-col gap-y-[30px] items-center">
        <Heading size="sm" className="text-start font-bold">
          Delete Account
        </Heading>
        <DeleteAccButton />
      </Section>
    </>
  );
};

export default page;
