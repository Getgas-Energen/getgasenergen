CREATE POLICY "Staff can read submission files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'submissions' AND public.is_staff(auth.uid()));

CREATE POLICY "Staff can read post media"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'post-media' AND public.is_staff(auth.uid()));

CREATE POLICY "Admins can upload post media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'post-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update post media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'post-media' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'post-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete post media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'post-media' AND public.has_role(auth.uid(), 'admin'));