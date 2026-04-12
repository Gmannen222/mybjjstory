-- Sync display_name from OAuth metadata to profiles on every login.
-- Only updates if display_name is NULL or still matches the previous OAuth value
-- (i.e., user hasn't manually customized it).
CREATE OR REPLACE FUNCTION public.handle_user_updated()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  UPDATE public.profiles
  SET
    display_name = COALESCE(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    )
  WHERE id = new.id
    AND (
      display_name IS NULL
      OR display_name = COALESCE(
        old.raw_user_meta_data ->> 'full_name',
        old.raw_user_meta_data ->> 'name'
      )
    );
  RETURN new;
END;
$$;

-- Fire on every login (Supabase updates last_sign_in_at on auth.users)
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_updated();
