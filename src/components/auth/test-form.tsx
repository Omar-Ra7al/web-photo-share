"use client";

import { useEffect, useState } from "react";

import z from "zod";
import FormBuilder, { FormConfig } from "@/components/fromBuilder";
import { db } from "@/lib/firebase/config";

import { doc, DocumentData, getDoc } from "firebase/firestore";

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
        schema: z
          .string()
          .min(3, "Title must be at least 3 characters")
          .max(20, "Title must be at most 20 characters"),
        minLength: 1,
        placeholder: `${previousData?.title || ""}`,
      },
      {
        type: "textarea",
        name: "description",
        label: "Description",
        placeholder: `${previousData?.description || ""}`,
      },
      {
        type: "images",
        name: "photos",
        label: "Upload Photos",
        required: false,
        maxCount: 3,
        maxSizeMB: 2,
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
    onSubmitForm: (data) => console.log(data),
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Test Form</h1>
      <FormBuilder config={config} />
    </div>
  );
}
