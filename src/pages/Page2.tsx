import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../main";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Page1 = () => {
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [session, setSession] = useState<Session | null>(null);

  async function signOut() {
    await supabase.auth.signOut();
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme={isDarkMode ? "dark" : "light"}
      />
    );
  } else {
    return (
      <div>
        <h1>Page 2</h1>
        <p>ログイン済みの場合のみアクセス可能なページ</p>
        <button onClick={signOut}>Sign out</button>
      </div>
    );
  }
};

export default Page1;
