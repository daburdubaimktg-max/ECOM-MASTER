import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type Tone = 'neutral' | 'signal' | 'verified' | 'calculated' | 'ai' | 'estimated' | 'missing' | 'ink';

const TONES: Record<Tone, string> = {
  neutral: 'bg-paper-deep text-ink-soft',
  signal: 'bg-signal-soft text-signal-deep',
  verified: 'bg-verified-soft text-verified',
  calculated: 'bg-calculated-soft text-calculated',
  ai: 'bg-ai-soft text-ai',
  estimated: 'bg-estimated-soft text-estimated',
  missing: 'bg-missing-soft text-missing',
  ink: 'bg-ink text-paper',
};

export function Badge({ tone = 'neutral', children, title }: { tone?: Tone; children: ReactNode; title?: string }) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.06em] whitespace-nowrap ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-1.5 rounded-[4px] px-3.5 py-2 text-[13.5px] font-medium leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap';
const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-paper hover:bg-signal',
  secondary: 'border border-line-strong bg-card text-ink hover:border-ink',
  ghost: 'text-ink-soft hover:bg-paper-deep hover:text-ink',
  danger: 'border border-signal/40 bg-card text-signal-deep hover:bg-signal hover:text-white',
};

export function buttonClass(variant: ButtonVariant = 'primary', extra = ''): string {
  return `${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${extra}`;
}

export function Button({ variant = 'primary', className = '', ...props }: ComponentProps<'button'> & { variant?: ButtonVariant }) {
  return <button {...props} className={buttonClass(variant, className)} />;
}

export function LinkButton({
  variant = 'primary',
  className = '',
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link {...props} className={buttonClass(variant, className)} />;
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function CardHeader({
  title,
  description,
  action,
  index,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  index?: string;
}) {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
      <div className="min-w-0">
        <h2 className="flex items-baseline gap-2.5 text-[17px] font-medium leading-tight text-ink">
          {index ? <span className="num text-[11px] font-normal text-signal">{index}</span> : null}
          {title}
        </h2>
        {description ? <p className="mt-1 max-w-[70ch] text-[13px] text-ink-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3 px-5 py-10">
      <span aria-hidden className="font-display text-3xl leading-none text-line-strong">
        ∅
      </span>
      <div>
        <p className="font-display text-lg text-ink">{title}</p>
        {children ? <div className="mt-1 max-w-[62ch] text-[13.5px] text-ink-muted">{children}</div> : null}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="mb-7 animate-fade">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="min-w-0">
          <p className="label flex items-center gap-2">
            <span aria-hidden className="inline-block h-px w-6 bg-signal" />
            {eyebrow}
          </p>
          <h1 className="mt-2 text-[34px] font-normal leading-[1.08] text-ink">{title}</h1>
          {description ? <p className="mt-2.5 max-w-[72ch] text-[14.5px] text-ink-soft">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </header>
  );
}

export function Stat({
  label,
  value,
  hint,
  marker,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  marker?: ReactNode;
}) {
  return (
    <div className="card relative overflow-hidden px-5 py-4">
      <div className="flex items-center justify-between gap-2">
        <p className="label">{label}</p>
        {marker}
      </div>
      <p className="mt-2 font-display text-[40px] font-light leading-none tracking-tight text-ink">{value}</p>
      {hint ? <p className="mt-2 text-[12.5px] leading-snug text-ink-muted">{hint}</p> : null}
    </div>
  );
}

export function Definition({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[11rem_1fr] gap-4 border-b border-line py-2.5 last:border-b-0">
      <dt className="label pt-0.5">{term}</dt>
      <dd className="min-w-0 text-[14px] text-ink">{children}</dd>
    </div>
  );
}

export function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  const safe = /^https?:\/\//i.test(href);
  if (!safe) return <span className="text-ink-muted">{children}</span>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="underline decoration-line-strong decoration-1 underline-offset-[3px] transition-colors hover:text-signal hover:decoration-signal"
    >
      {children}
    </a>
  );
}

export function Notice({ tone = 'neutral', title, children }: { tone?: 'neutral' | 'signal' | 'estimated' | 'verified'; title?: string; children: ReactNode }) {
  const border = { neutral: 'border-line-strong', signal: 'border-signal', estimated: 'border-estimated', verified: 'border-verified' }[tone];
  return (
    <div className={`border-l-2 ${border} bg-card px-4 py-3 text-[13.5px] text-ink-soft`}>
      {title ? <p className="mb-0.5 font-medium text-ink">{title}</p> : null}
      {children}
    </div>
  );
}

export function Tabs({ items, current }: { items: { href: string; label: string; count?: number | null }[]; current: string }) {
  return (
    <nav className="mt-6 flex gap-6 overflow-x-auto border-b border-line" aria-label="Sections">
      {items.map((item) => {
        const active = item.href === current;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`-mb-px flex items-center gap-1.5 border-b-2 pb-2.5 text-[13.5px] whitespace-nowrap transition-colors ${
              active ? 'border-signal font-medium text-ink' : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            {item.label}
            {typeof item.count === 'number' ? <span className="num text-[11px] text-ink-muted">{item.count}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function formatDateTime(value: Date | string | null | undefined): string {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return String(value);
  return `${date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}, ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} UTC`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
