import React, { useEffect, useState } from "react";
import { supabase } from "../main";
import { Session } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Database } from "../../database.types";

const Todo: React.FC = () => {
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [session, setSession] = useState<Session | null>(null);
  const [todos, setTodos] = useState<
    Database["public"]["Tables"]["todo"]["Row"][]
  >([]);
  const [newTodo, setNewTodo] = useState("");

  const refetchTodos = async () => {
    const { data, error } = await supabase.from("todo").select();
    if (!error) setTodos(data);
  };

  const addTodo = async () => {
    if (newTodo.trim() !== "") {
      const { data, error } = await supabase
        .from("todo")
        .insert([{ title: newTodo }])
        .select();
      if (!error) refetchTodos();
      setNewTodo("");
    }
  };

  const editTodo = async (id: number, newTitle: string) => {
    const { data, error } = await supabase
      .from("todo")
      .update({ title: newTitle })
      .eq("id", id)
      .select();
    if (!error) refetchTodos();
  };

  const deleteTodo = async (id: number) => {
    const { error } = await supabase.from("todo").delete().eq("id", id);
    if (!error) refetchTodos();
  };

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

  useEffect(() => {
    if (session) {
      refetchTodos();
    }
  }, [session]);

  return session ? (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="text"
              value={todo.title ?? ""}
              onChange={(e) => editTodo(todo.id, e.target.value)}
            />
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={signOut}>Sign out</button>
    </div>
  ) : (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      theme={isDarkMode ? "dark" : "light"}
    />
  );
};

export default Todo;
