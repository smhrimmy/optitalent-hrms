CREATE SEQUENCE IF NOT EXISTS helpdesk_ticket_seq START 1000;
ALTER TABLE helpdesk_tickets ADD COLUMN IF NOT EXISTS ticket_number INTEGER DEFAULT nextval('helpdesk_ticket_seq');
