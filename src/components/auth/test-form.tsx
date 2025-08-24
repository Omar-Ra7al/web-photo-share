"use client";

import { useEffect, useState } from "react";

import z from "zod";
import FormBuilder, { FormConfig } from "@/components/fromBuilder";
import { db } from "@/lib/firebase/config";

import { doc, DocumentData, getDoc } from "firebase/firestore";
import Image from "next/image";

export default function TestFormPage() {
  const [previousData, setPreviousData] = useState<DocumentData>();

  useEffect(() => {
    const result = async () => {
      const ref = doc(db, "test", "test");
      const res = await getDoc(ref);
      setPreviousData(res.data());
      return res.data();
    };
    result();
  }, []);

  const config: FormConfig = {
    fields: [
      {
        type: "text",
        name: "title",
        label: "Title",
        maxLength: 20,
        minLength: 3,
        required: true,
        placeholder: `${previousData?.title || ""}`,
      },
      {
        type: "textarea",
        name: "description",
        label: "Description",
        schema: z
          .string()
          .min(3, "Title must be at least 3 characters")
          .max(20, "Title must be at most 20 characters"),
        placeholder: `${previousData?.description || ""}`,
      },
      {
        type: "images",
        name: "photos",
        label: "Upload Photos",
        required: false,
        maxCount: 3,
        maxSizeMB: 3,
        accept: ["image/jpeg", "image/png"],
      },
      {
        type: "select",
        name: "category",
        label: "Category",
        required: true,
        options: [
          { value: "tech", label: "Technology" },
          { value: "health", label: "Health" },
          { value: "travel", label: "Travel" },
        ],
        placeholder: `${"Select a category"}`,
      },
    ],
    fireStorePath: { collectionName: "test", docName: "test" },
    fireStoragePath: "test",
    onSubmitForm: (data) => console.log(data),
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold my-4">Test Form</h1>
      <FormBuilder config={config} />

      {previousData && previousData.photos && (
        <div className="grid grid-cols-2 gap-2 my-10">
          {previousData.photos.map((photo: string, index: number) => (
            <Image
              key={index}
              src={photo}
              width={100}
              height={100}
              alt={`Image ${index + 1}`}
              className="w-full h-auto"
            />
          ))}
        </div>
      )}

      <pre className="text-wrap">{JSON.stringify(previousData, null, 2)}</pre>
    </div>
  );
}
