import { useEffect, useState } from "react";
import { supabase } from "../main";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Session } from "@supabase/supabase-js";

const Page4 = () => {
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [session, setSession] = useState<Session | null>(null);
  const [countries, setCountries] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function getCountries() {
    const { data } = await supabase.from("countries").select();
    if (!data) {
      setCountries([]);
      return;
    }
    setCountries(data);
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

  useEffect(() => {
    getCountries();
  }, [session]);

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
        <h1>Page 4</h1>
        <p>ログイン済みの場合のみアクセス&GET可能なページ</p>
        <button onClick={signOut}>Sign out</button>
        <ul>
          {countries.map((country) => (
            <li key={country.name}>{country.name}</li>
          ))}
        </ul>
      </div>
    );
  }
};

export default Page4;
