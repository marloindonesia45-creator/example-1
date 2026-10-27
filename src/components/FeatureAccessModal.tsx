import React, { useEffect, useState } from 'react';
import { LockKeyhole, X } from 'lucide-react';

interface FeatureAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void | Promise<void>;
}

export const FeatureAccessModal: React.FC<FeatureAccessModalProps> = ({
  isOpen,
  onClose,
  onUnlock,
}) => {
  const [enteredPassword, setEnteredPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setEnteredPassword('');
      setErrorMessage('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/access', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: enteredPassword }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        const message = result && typeof result === 'object' &&
          typeof (result as { error?: unknown }).error === 'string'
          ? (result as { error: string }).error
          : 'Tidak dapat memverifikasi password.';
        throw new Error(message);
      }

      await onUnlock();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Tidak dapat membuka fitur.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feature-access-title"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-white/10 bg-[#161a1d] p-6 text-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div>
              <h2 id="feature-access-title" className="font-serif text-xl">Masukkan Password</h2>
              <p className="mt-1 text-xs text-white/55">Fitur ini dilindungi password.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="block space-y-2 text-sm text-white/80">
          <span>Password</span>
          <input
            autoFocus
            type="password"
            autoComplete="current-password"
            value={enteredPassword}
            disabled={isSubmitting}
            onChange={(event) => {
              setEnteredPassword(event.target.value);
              setErrorMessage('');
            }}
            className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-amber-400/60 disabled:opacity-60"
            placeholder="Masukkan password"
          />
        </label>
        {errorMessage && (
          <p role="alert" className="text-sm text-red-300">{errorMessage}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !enteredPassword}
          className="w-full rounded-xl bg-amber-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Memverifikasi...' : 'Buka Fitur'}
        </button>
      </form>
    </div>
  );
};
