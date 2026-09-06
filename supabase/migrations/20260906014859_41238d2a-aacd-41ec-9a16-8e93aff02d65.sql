REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.block_message_mutation() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.touch_conversation() FROM PUBLIC, anon, authenticated;