CREATE POLICY "Only authenticated users can listen to realtime"
  ON realtime.messages
  FOR SELECT
  TO authenticated
  USING (true);