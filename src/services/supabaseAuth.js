import supabase from "../app/supabaseClient";

export const UserRegister = async ({ email, password, full_name }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
    },
  });
  if (error) throw error;
  return data;
};

export const UserLogin = async ({ email, password }) => {
  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", authData.user.id)
    .single();

  return {
    id: authData.user.id,
    email: authData.user.email,
    role: profile?.role || "user",
    full_name: profile?.full_name || authData.user.user_metadata?.full_name,
  };
};

export const UserAuthenticate = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email,
    role: profile?.role || "user",
    full_name: profile?.full_name || user.user_metadata?.full_name,
  };
};

export const UserLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};