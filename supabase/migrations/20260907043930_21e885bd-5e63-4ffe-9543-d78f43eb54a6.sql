revoke all on function public.handle_new_user() from authenticated, anon, public;
revoke all on function public.block_message_mutation() from authenticated, anon, public;
revoke all on function public.touch_conversation() from authenticated, anon, public;
revoke all on function public.update_updated_at_column() from authenticated, anon, public;