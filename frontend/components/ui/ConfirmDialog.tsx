'use client';

import { useId } from 'react';
import Modal from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const messageId = useId();

  if (!open) return null;

  return (
    <Modal
      role="alertdialog"
      layer="top"
      labelledBy={titleId}
      describedBy={messageId}
      dismissible={!busy}
      onClose={onCancel}
      className="max-w-sm p-6 sm:p-7"
    >
      <h2 id={titleId} className="text-lg font-bold">
        {title}
      </h2>
      <p id={messageId} className="mt-2 text-sm leading-relaxed text-ink-soft">
        {message}
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={busy} autoFocus>
          {cancelLabel}
        </button>
        <button type="button" className="btn-danger" onClick={onConfirm} disabled={busy}>
          {busy ? 'Working…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
