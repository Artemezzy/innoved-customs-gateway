-- Миграция для доработки формы заявок на сертификацию
-- Выполнить вручную на MySQL хостинге перед выкладкой backend/frontend.

ALTER TABLE lk_cert_requests
  ADD COLUMN applicant_org VARCHAR(255) NOT NULL DEFAULT '' AFTER updated_by_role,
  ADD COLUMN applicant_address VARCHAR(255) NOT NULL DEFAULT '' AFTER applicant_org,
  ADD COLUMN applicant_head VARCHAR(255) NOT NULL DEFAULT '' AFTER applicant_address,
  ADD COLUMN applicant_position VARCHAR(255) NOT NULL DEFAULT '' AFTER applicant_head,
  ADD COLUMN applicant_email VARCHAR(255) NOT NULL DEFAULT '' AFTER applicant_position,
  ADD COLUMN manufacturer_org VARCHAR(255) NOT NULL DEFAULT '' AFTER applicant_email,
  ADD COLUMN manufacturer_address VARCHAR(255) NOT NULL DEFAULT '' AFTER manufacturer_org,
  ADD COLUMN manufacturer_country VARCHAR(255) NOT NULL DEFAULT '' AFTER manufacturer_address;

ALTER TABLE lk_cert_request_items
  ADD COLUMN is_checked TINYINT(1) NOT NULL DEFAULT 0 AFTER position_no,
  ADD COLUMN model_article VARCHAR(255) NOT NULL DEFAULT '' AFTER tech_description,
  ADD COLUMN trademark VARCHAR(255) NOT NULL DEFAULT '' AFTER model_article,
  ADD COLUMN contract_invoice VARCHAR(255) NOT NULL DEFAULT '' AFTER tn_ved,
  ADD COLUMN quantity VARCHAR(255) NOT NULL DEFAULT '' AFTER contract_invoice,
  ADD COLUMN production_deadline VARCHAR(255) NOT NULL DEFAULT '' AFTER cost,
  ADD COLUMN samples_required VARCHAR(255) NOT NULL DEFAULT '' AFTER production_deadline,
  ADD COLUMN samples_city VARCHAR(255) NOT NULL DEFAULT '' AFTER samples_required;
