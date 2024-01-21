import { useEffect, useState } from "react";
import { supabase } from "./main";

function App() {
  const [countries, setCountries] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);

  useEffect(() => {
    getCountries();
  }, []);

  async function getCountries() {
    const { data } = await supabase.from("countries").select();
    if (!data) return;
    setCountries(data);
  }

  return (
    <ul>
      {countries.map((country) => (
        <li key={country.name}>{country.name}</li>
      ))}
    </ul>
  );
}

export default App;
