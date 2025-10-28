-- Grant pm0 table and sequence privileges to the authenticated role so RLS-protected tables remain usable.
grant select, insert, update, delete on all tables in schema pm0 to authenticated;
grant usage, select on all sequences in schema pm0 to authenticated;
