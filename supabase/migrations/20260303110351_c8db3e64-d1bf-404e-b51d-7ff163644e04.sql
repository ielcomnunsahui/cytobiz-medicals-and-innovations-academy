
-- 1. Allow users to update their own certificate payments (receipt upload + status)
CREATE POLICY "Users can update their own certificate payments"
ON public.certificate_payments
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Add unique constraint on certificates(user_id, course_id) so upsert works
ALTER TABLE public.certificates
ADD CONSTRAINT certificates_user_course_unique UNIQUE (user_id, course_id);
