import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Idea {
  titulo: string;
  descripcion: string;
  estado: "pendiente" | "en progreso" | "hecha";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );

    if (req.method === "GET") {
      const { data, error } = await supabaseClient
        .from("ideas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return new Response(JSON.stringify(data), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    if (req.method === "POST") {
      const idea: Idea = await req.json();

      if (!idea.titulo || !idea.descripcion || !idea.estado) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: titulo, descripcion, estado" }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (!["pendiente", "en progreso", "hecha"].includes(idea.estado)) {
        return new Response(
          JSON.stringify({ error: "Estado must be one of: pendiente, en progreso, hecha" }),
          {
            status: 400,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const { data, error } = await supabaseClient
        .from("ideas")
        .insert([idea])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return new Response(JSON.stringify(data), {
        status: 201,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
