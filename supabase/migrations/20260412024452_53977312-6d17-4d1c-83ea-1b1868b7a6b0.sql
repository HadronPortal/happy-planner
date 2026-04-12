CREATE TABLE public.support_online_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa TEXT NOT NULL,
  rustdesk_id TEXT NOT NULL,
  hostname TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'online',
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  app_version TEXT NOT NULL DEFAULT '1.0.0',
  tecnico_responsavel TEXT
);

ALTER TABLE public.support_online_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Client app can register online"
  ON public.support_online_clients
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Technicians can view all clients"
  ON public.support_online_clients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Technicians can update clients"
  ON public.support_online_clients
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Technicians can delete clients"
  ON public.support_online_clients
  FOR DELETE
  TO authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_support_online_clients_updated_at
  BEFORE UPDATE ON public.support_online_clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.support_online_clients;

CREATE INDEX idx_support_clients_status ON public.support_online_clients(status);
CREATE INDEX idx_support_clients_empresa ON public.support_online_clients(empresa);
CREATE INDEX idx_support_clients_rustdesk_id ON public.support_online_clients(rustdesk_id);