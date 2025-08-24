"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase/config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { showError, showSuccess } from "@/utils/notifications";

// Config types
// -------------------------

interface BaseField {
  name: string;
  label: string;
  schema?: z.ZodTypeAny;
  required?: boolean;
  className?: string;
}

interface TextField extends BaseField {
  type: "text" | "textarea";
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
}

interface ImageField extends BaseField {
  type: "images";
  accept?: string[];
  maxCount?: number;
  maxSizeMB?: number;
  storageBucket?: string;
  previewContainerClassName?: string;
  imageClassName?: string;
}

interface SelectField extends BaseField {
  type: "select";
  options: { label: string; value: string }[];
  placeholder?: string;
}

type FormField = TextField | ImageField | SelectField;

// Export form config >> to be used in other components
export interface FormConfig {
  fields: FormField[];
  fireStorePath?: { collectionName: string; docName: string };
  fireStoragePath?: string;
  onSubmitForm?: (data: unknown) => void;
  beforeSubmitForm?: (data: unknown) => void;
  afterSubmitForm?: (data: unknown) => void;
  feildsClassName?: string;
  submitBtnClassName?: string;
}

interface FormProps {
  config: FormConfig;
}

export default function FormBuilder({ config }: FormProps) {
  // 1. Build schema from config
  // -------------------------

  function buildSchema() {
    const shape: Record<string, z.ZodTypeAny> = {};

    config.fields.forEach((field) => {
      // Schema for text and textarea
      if (field.type === "text" || field.type === "textarea") {
        let schema = z.string();

        if (field.schema) {
          shape[field.name] = field.schema;
        } else {
          if (field.required) {
            schema = schema.nonempty(`${field.label} is required`);

            if (field.minLength) {
              schema = schema.min(
                field.minLength,
                `${field.label} must be at least ${field.minLength} characters`
              );
            }

            if (field.maxLength) {
              schema = schema.max(
                field.maxLength,
                `${field.label} must be at most ${field.maxLength} characters`
              );
            }

            shape[field.name] = schema;
          } else {
            shape[field.name] = schema.optional();
          }
        }
      }

      // Schema for images
      if (field.type === "images") {
        let schema = z.array(z.instanceof(File)).optional().default([]);

        if (field.schema) {
          shape[field.name] = field.schema;
        } else {
          if (field.required) {
            schema = schema.refine(
              (files) => files.length > 0,
              `${field.label} is required`
            );
          }

          if (field.maxCount) {
            schema = schema.refine(
              (files) => files.length <= field.maxCount!,
              `${field.label} can have at most ${field.maxCount} file(s)`
            );
          }

          if (field.maxSizeMB) {
            schema = schema.refine(
              (files) =>
                files.every((f) => f.size / (1024 * 1024) <= field.maxSizeMB!),
              `${field.label} must be ≤ ${field.maxSizeMB}MB per file`
            );
          }

          if (field.accept?.length) {
            schema = schema.refine(
              (files) => files.every((f) => field.accept!.includes(f.type)),
              `${field.label} must be of type: ${field.accept.join(", ")}`
            );
          }

          shape[field.name] = schema;
        }
      }

      // Schema for select
      if (field.type === "select") {
        const values = field.options.map((o) => o.value) as [
          string,
          ...string[]
        ];

        if (field.schema) {
          shape[field.name] = field.schema;
        } else {
          if (field.required) {
            shape[field.name] = z
              .enum([...(values as [string, ...string[]])])
              .refine((val) => !!val, {
                message: `${field.label} is required`,
              });
          } else {
            // allow empty string from <option value="">
            shape[field.name] = z
              .union([
                z.enum([...(values as [string, ...string[]])]),
                z.literal(""),
              ])
              .optional();
          }
        }
      }
    });

    return z.object(shape);
  }

  const schema = buildSchema();

  // 2. Hook form
  // -------------------------

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // 3. Submit
  // -------------------------

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (config.beforeSubmitForm) {
      config.beforeSubmitForm(data);
    }

    if (config.onSubmitForm) {
      config.onSubmitForm(data);
    }

    try {
      // Urls for uploaded images
      const photoURLs: string[] = [];

      // Check if there are any images
      if (
        data.photos &&
        Array.isArray(data.photos) &&
        data.photos.length > 0 &&
        config.fireStoragePath
      ) {
        for (const file of data.photos) {
          const storageRef = ref(
            storage,
            `${config.fireStoragePath}/${file.name}-${Date.now()}`
          );

          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          photoURLs.push(url);
        }
      }

      // Remove empty fields
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => {
          if (
            value === "" ||
            value === null ||
            value === undefined ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === "object" &&
              !Array.isArray(value) &&
              Object.keys(value).length === 0)
          ) {
            return false;
          }
          return true;
        })
      );

      // Replace photos array with URLs if uploaded
      if (photoURLs.length > 0) {
        filteredData.photos = photoURLs;
      } else {
        delete filteredData.photos; // Remove empty photos array
      }

      // Save to Firestore
      if (config.fireStorePath) {
        const fireStoreRef = doc(
          db,
          config.fireStorePath.collectionName,
          config.fireStorePath.docName
        );

        await setDoc(
          fireStoreRef,
          {
            ...filteredData,
            createdAt: new Date(),
          },
          { merge: true }
        );
      }

      showSuccess("Form submitted successfully!");
      setPreviews({});
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      showError("Failed to submit form. Please try again.");
    }

    if (config.afterSubmitForm) {
      config.afterSubmitForm(data);
    }
  };

  // Images preview
  const [previews, setPreviews] = useState<Record<string, string[]>>({});
  const handleFilesChange = (field: ImageField, files: FileList | null) => {
    const arr = files ? Array.from(files) : [];
    setValue(field.name, arr, { shouldValidate: true });

    const urls = arr.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => ({ ...prev, [field.name]: urls }));
  };

  useEffect(() => {
    return () => {
      Object.values(previews)
        .flat()
        .forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);
  // -------------------------

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Render fields */}
      {config.fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label htmlFor={field.name}>{field.label}</label>

          {field.type === "text" && (
            <input
              id={field.name}
              type="text"
              {...register(field.name)}
              className={`border px-2 py-1 w-full rounded ${
                config.feildsClassName
              } ${field.className} ${
                errors[field.name] ? "border-destructive" : ""
              }`}
              placeholder={field.placeholder}
            />
          )}

          {field.type === "textarea" && (
            <textarea
              id={field.name}
              {...register(field.name)}
              className={`border px-2 py-1 w-full rounded ${
                config.feildsClassName
              } ${field.className} ${
                errors[field.name] ? "border-destructive" : ""
              }`}
              rows={4}
              placeholder={field.placeholder}
            />
          )}

          {field.type === "images" && (
            <>
              <input
                id={field.name}
                type="file"
                accept={field.accept?.join(",") ?? "image/*"}
                multiple={field.maxCount !== 1}
                onChange={(e) => handleFilesChange(field, e.target.files)}
                className={`cursor-pointer border px-2 py-1 w-full rounded
                  ${config.feildsClassName} ${field.className}
                  ${errors[field.name] ? "border-destructive" : ""}`}
              />

              <div
                className={`flex flex-wrap gap-2 ${field.previewContainerClassName}`}
              >
                {previews[field.name]?.map((src, i) => (
                  <Image
                    alt="preview"
                    key={i}
                    width={200}
                    height={200}
                    src={src}
                    className={`w-20 h-20 object-cover rounded border border-white ${field.imageClassName}`}
                  />
                ))}
              </div>
            </>
          )}

          {field.type === "select" && (
            <select
              id={field.name}
              {...register(field.name)}
              className={`border px-2 py-1 w-full rounded ${
                config.feildsClassName
              } ${field.className} ${
                errors[field.name] ? "border-destructive" : ""
              }`}
              defaultValue=""
            >
              <option value="" className="bg-primary opacity-50">
                {field.placeholder}
              </option>

              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {errors[field.name] && (
            <p className="text-red-500 text-sm">
              {errors[field.name]?.message as string}
            </p>
          )}
        </div>
      ))}
      {/*   */}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-primary border border-secondary text-secondary py-2 rounded cursor-pointer ${config.submitBtnClassName}`}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
