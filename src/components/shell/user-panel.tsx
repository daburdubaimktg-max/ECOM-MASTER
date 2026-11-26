import { LogOut } from 'lucide-react';
import { signOutAction } from '@/app/actions/auth';
import { ROLES } from '@/lib/auth/permissions';
import { getContext } from '@/lib/auth/server';

export function UserPanelSkeleton() {
  return (
    <div className="hidden border-t border-rail-line px-5 py-4 lg:block">
      <div className="h-3 w-28 rounded bg-rail-soft" />
      <div className="mt-2 h-2.5 w-20 rounded bg-rail-soft" />
    </div>
  );
}

export async function UserPanel() {
  const ctx = await getContext();
  if (!ctx) return <UserPanelSkeleton />;
  return (
    <div className="hidden items-center gap-3 border-t border-rail-line px-5 py-4 lg:flex">
      <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rail-soft font-display text-[15px] text-rail-ink">
        {ctx.user.name.slice(0, 1).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-white" title={ctx.user.email}>
          {ctx.user.name}
        </p>
        <p className="truncate font-mono text-[10px] uppercase tracking-[0.08em] text-rail-muted" title={ctx.organisation.name}>
          {ROLES[ctx.membership.role].name}
        </p>
      </div>
      <form action={signOutAction}>
        <button type="submit" title="Sign out" aria-label="Sign out" className="rounded p-1.5 text-rail-muted transition-colors hover:bg-rail-soft hover:text-white">
          <LogOut size={15} strokeWidth={1.6} />
        </button>
      </form>
    </div>
  );
}

export async function OrganisationName() {
  const ctx = await getContext();
  return <>{ctx?.organisation.name ?? ''}</>;
}
