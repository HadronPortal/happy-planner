import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type DbClient = Database["public"]["Tables"]["support_online_clients"]["Row"];

export function useSupportClients() {
  const [clients, setClients] = useState<DbClient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from("support_online_clients")
      .select("*")
      .order("opened_at", { ascending: false });

    if (!error && data) setClients(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();

    const channel = supabase
      .channel("support_online_clients_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_online_clients" },
        () => { fetchClients(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateClientStatus = async (id: string, status: string, tecnico?: string) => {
    // Store previous state for rollback
    const previousClients = [...clients];
    
    // Rule 5: Update interface immediately (Optimistic Update)
    setClients((prev) =>
      prev.map((c) =>
        c.id === id 
          ? { 
              ...c, 
              status, 
              // Rule 3: Maintain current value if tecnico is undefined
              tecnico_responsavel: tecnico !== undefined ? tecnico : c.tecnico_responsavel, 
              // Rule 2: Update timestamp
              updated_at: new Date().toISOString() 
            } 
          : c
      )
    );

    try {
      // Rule 1: Update support_online_clients table
      // Rule 2: Set status and updated_at
      const updateData: any = { 
        status, 
        updated_at: new Date().toISOString()
      };
      
      // Rule 3: Only update tecnico_responsavel if explicitly provided (maintains current value otherwise)
      if (tecnico !== undefined) {
        updateData.tecnico_responsavel = tecnico;
      }

      const { error } = await supabase
        .from("support_online_clients")
        .update(updateData)
        .eq("id", id);

      if (error) {
        setClients(previousClients);
        console.error("Error updating client status:", error);
        throw error;
      }
    } catch (err) {
      setClients(previousClients);
      throw err;
    }
  };

  return { clients, loading, updateClientStatus };
}
