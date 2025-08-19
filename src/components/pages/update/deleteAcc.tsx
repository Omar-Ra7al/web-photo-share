"use client";

import Section from "@/components/shared/sections/section";
import Heading from "@/components/shared/typography/heading";
import DeleteAccButton from "@/components/auth/buttons/deleteAccButton";

const DeleteAcc = () => {
  return (
    <Section type="outer" className="flex flex-col gap-y-[30px] items-center">
      <Heading size="sm" className="text-start font-bold">
        Delete Account
      </Heading>
      <DeleteAccButton />
    </Section>
  );
};

export default DeleteAcc;
