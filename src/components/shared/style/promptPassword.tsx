"use client";

import { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function PasswordPrompt({
  message,
  defaultValue,
  onSubmit,
}: {
  message: string;
  defaultValue?: string;
  onSubmit: (password: string | null) => void;
}) {
  const [open, setOpen] = useState(true);
  const [password, setPassword] = useState(defaultValue || "");

  const handleConfirm = () => {
    setOpen(false);
    onSubmit(password || null);
  };

  const handleCancel = () => {
    setOpen(false);
    onSubmit(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{message}</DialogTitle>
        </DialogHeader>

        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoFocus
          className="mt-2"
        />

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Works like native prompt() but shows a styled modal.
 */
export function promptPassword(
  message = "Enter your current password:",
  defaultValue = ""
): Promise<string | null> {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);

    const handleSubmit = (value: string | null) => {
      root.unmount();
      container.remove();
      resolve(value);
    };

    root.render(
      <PasswordPrompt
        message={message}
        defaultValue={defaultValue}
        onSubmit={handleSubmit}
      />
    );
  });
}
