"use client";

import Button from "./Button";

type ConfirmationModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
};

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDanger = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-md transform overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0dc0] p-8 text-left shadow-2xl backdrop-blur-2xl transition-all animate-in fade-in zoom-in-95 duration-200"
        style={{
          boxShadow: isDanger
            ? "0 20px 50px rgba(239, 68, 68, 0.15)"
            : "0 20px 50px rgba(16, 185, 129, 0.15)",
        }}
      >
        <h3 className="text-2xl font-bold leading-6 text-white heading-font">
          {title}
        </h3>
        
        <div className="mt-4">
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            {message}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 hover:bg-zinc-700 hover:text-white transition duration-200"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-2xl font-semibold transition duration-200 ${
              isDanger
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-green-600 hover:bg-green-500 text-white"
            }`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
