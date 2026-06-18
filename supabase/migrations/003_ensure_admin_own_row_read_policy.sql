create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
      and au.approved = true
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists "Approved admins can read own admin row" on public.admin_users;

create policy "Approved admins can read own admin row"
on public.admin_users for select
to authenticated
using (user_id = auth.uid() and approved = true);
