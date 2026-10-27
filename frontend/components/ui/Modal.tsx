'use client';

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

let scrollLocks = 0;
let savedOverflow = '';
const lockScroll = () => {
  if (scrollLocks++ === 0) {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
};
const unlockScroll = () => {
  if (--scrollLocks === 0) document.body.style.overflow = savedOverflow;
};

interface ModalProps {
  labelledBy: string;
  describedBy?: string;
  role?: 'dialog' | 'alertdialog';
  placement?: 'center' | 'sheet';
  layer?: 'base' | 'top';
  dismissible?: boolean;
  closeOnBackdrop?: boolean;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}

export default function Modal({
  labelledBy,
  describedBy,
  role = 'dialog',
  placement = 'center',
  layer = 'base',
  dismissible = true,
  closeOnBackdrop = dismissible,
  onClose,
  className = '',
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const previous = document.activeElement as HTMLElement | null;
    lockScroll();
    if (!panel.contains(document.activeElement)) panel.focus();
    return () => {
      unlockScroll();
      if (previous && document.contains(previous)) previous.focus();
    };
  }, []);

  useEffect(() => {
    if (!dismissible) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dismissible]);

  const trapTab = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const nodes = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!nodes?.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === panelRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (typeof document === 'undefined') return null;

  const sheet = placement === 'sheet';
  return createPortal(
    <div
      className={`fixed inset-0 flex justify-center bg-ink/60 ${layer === 'top' ? 'z-50' : 'z-30'} ${
        sheet ? 'items-end sm:items-center sm:p-4' : 'items-center p-4'
      }`}
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        onKeyDown={trapTab}
        className={`card max-h-[92dvh] w-full animate-pop overflow-y-auto outline-none ${
          sheet ? 'rounded-b-none pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:rounded-b-[28px]' : ''
        } ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
