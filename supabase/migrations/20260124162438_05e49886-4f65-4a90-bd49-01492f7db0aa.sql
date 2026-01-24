-- Remove redundant bank settings (old format with dots)
-- The new format (bank_transfer_*) is what the code uses
DELETE FROM public.site_settings WHERE setting_key LIKE 'payment.bank.%';