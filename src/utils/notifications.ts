import { toast } from "sonner";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const showError = (
  message: string,
  router?: AppRouterInstance | null,
  path?: string
) => {
  toast.error(message, { className: "!bg-red-500 text-white" });
  if (router) {
    setTimeout(() => {
      router.push(path || "/");
    }, 1500);
  }
};

export const showSuccess = (
  message: string,
  router?: AppRouterInstance,
  path?: string
) => {
  toast.success(message);
  if (router) {
    setTimeout(() => {
      router.push(path || "/");
    }, 1500);
  }
};
