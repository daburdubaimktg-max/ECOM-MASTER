'use client';

import { createContext, startTransition, useActionState, useContext, useEffect, useRef } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import type { ActionState } from '@/app/actions/_helpers';
import { buttonClass } from './primitives';

type FormAction = (state: ActionState, formData: FormData) => Promise<ActionState>;

/** Lets the submit button know its form is busy. */
const PendingContext = createContext(false);

/**
 * Sends a form to its server action WITHOUT letting the browser clear the fields afterwards.
 * (By default a form is emptied when its action finishes — even when the answer is "please fix this
 * field" — which would throw away everything the person typed.)
 */
export function submitKeepingValues(event: React.FormEvent<HTMLFormElement>, dispatch: (formData: FormData) => void): void {
  event.preventDefault();
  const submitter = (event.nativeEvent as SubmitEvent).submitter;
  const formData = new FormData(event.currentTarget, submitter instanceof HTMLElement ? submitter : undefined);
  startTransition(() => dispatch(formData));
}

/**
 * A form wired to a server action. Shows the returned message, marks invalid fields
 * (children read errors through `data-field-error`) and can reset itself after success.
 */
export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess = false,
  successMessage = true,
}: {
  action: FormAction;
  children: ReactNode | ((state: ActionState, pending: boolean) => ReactNode);
  className?: string;
  resetOnSuccess?: boolean;
  successMessage?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);
  return (
    <form ref={ref} action={formAction} onSubmit={(event) => submitKeepingValues(event, formAction)} className={className} noValidate>
      <PendingContext value={pending}>{typeof children === 'function' ? children(state, pending) : children}</PendingContext>
      {state && !state.ok && state.error ? (
        <p role="alert" className="mt-3 border-l-2 border-signal bg-signal-soft px-3 py-2 text-[13px] text-signal-deep">
          {state.error}
        </p>
      ) : null}
      {state?.ok && state.message && successMessage ? (
        <p role="status" className="mt-3 border-l-2 border-verified bg-verified-soft px-3 py-2 text-[13px] text-verified">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

export function SubmitButton({
  children,
  pendingLabel = 'Saving…',
  variant = 'primary',
  className = '',
  ...props
}: Omit<ComponentProps<'button'>, 'type'> & { pendingLabel?: string; variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  const status = useFormStatus();
  const pending = useContext(PendingContext) || status.pending;
  return (
    <button {...props} type="submit" disabled={pending || props.disabled} className={buttonClass(variant, className)}>
      {pending ? pendingLabel : children}
    </button>
  );
}

export function Field({
  label,
  name,
  hint,
  error,
  children,
  optional = false,
}: {
  label: string;
  name: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 flex items-baseline justify-between gap-2 text-[13px] font-medium text-ink">
        <span>{label}</span>
        {optional ? <span className="label !text-[9.5px]">Optional</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-[12.5px] text-signal-deep" id={`${name}-error`}>
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-[12.5px] leading-snug text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({ name, error, ...props }: ComponentProps<'input'> & { name: string; error?: string }) {
  return <input id={name} name={name} aria-invalid={error ? 'true' : undefined} aria-describedby={error ? `${name}-error` : undefined} {...props} className={`field-input ${props.className ?? ''}`} />;
}

export function TextArea({ name, error, ...props }: ComponentProps<'textarea'> & { name: string; error?: string }) {
  return <textarea id={name} name={name} aria-invalid={error ? 'true' : undefined} rows={4} {...props} className={`field-input resize-y ${props.className ?? ''}`} />;
}

export function SelectInput({ name, error, children, ...props }: ComponentProps<'select'> & { name: string; error?: string }) {
  return (
    <select id={name} name={name} aria-invalid={error ? 'true' : undefined} {...props} className={`field-input ${props.className ?? ''}`}>
      {children}
    </select>
  );
}

/** A small inline form with one button — used for approve / delete / status changes in tables. */
export function InlineAction({
  action,
  fields,
  children,
  variant = 'ghost',
  confirm,
  pendingLabel = '…',
  title,
}: {
  action: FormAction;
  fields: Record<string, string>;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  confirm?: string;
  pendingLabel?: string;
  title?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form
      action={formAction}
      className="inline-flex flex-col items-end"
      onSubmit={(event) => {
        if (confirm && !window.confirm(confirm)) {
          event.preventDefault();
          return;
        }
        submitKeepingValues(event, formAction);
      }}
    >
      {Object.entries(fields).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <PendingContext value={pending}>
        <SubmitButton variant={variant} pendingLabel={pendingLabel} className="!px-2.5 !py-1.5 !text-[12.5px]" title={title}>
          {children}
        </SubmitButton>
      </PendingContext>
      {state && !state.ok && state.error ? (
        <span role="alert" className="mt-1 max-w-[16rem] text-right text-[12px] text-signal-deep">
          {state.error}
        </span>
      ) : null}
    </form>
  );
}
