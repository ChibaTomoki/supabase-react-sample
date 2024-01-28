import { useEffect, useState } from "react";
import { supabase } from "../main";
import { Session } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Page3 = () => {
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

  return (
    <div>
      <h1>Page 3</h1>
      <p>ログイン済みの場合のみGET可能なページ</p>
      <ul>
        {countries.map((country) => (
          <li key={country.name}>{country.name}</li>
        ))}
      </ul>
      {session ? (
        <button onClick={signOut}>Sign out</button>
      ) : (
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme={isDarkMode ? "dark" : "light"}
        />
      )}
    </div>
  );
};

export default Page3;
