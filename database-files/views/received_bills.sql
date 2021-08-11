CREATE OR REPLACE VIEW vw_received_bills AS
    SELECT 
        clients.id AS id_cliente
        , CONCAT(clients.first_name, ' ', clients.last_name) AS nome_cliente
        , CONCAT('R$', ' ', location_header.installments_value) AS valor_parcela
        , CONCAT('R$', ' ', bills_to_receive.received_value) AS valor_recebido
        , bills_to_receive.location_header_id AS id_locacao
        , bills_to_receive.due_date AS data_vencimento
        , bills_to_receive.received_at AS data_recebimento
        , employees.id AS id_recebido_por
        , CONCAT(employees.first_name, ' ', employees.last_name) AS recebido_por
	FROM bills_to_receive
		JOIN
			public.clients
		ON
			clients.id = bills_to_receive.client_id
		JOIN
			public.location_header
		ON
			bills_to_receive.location_header_id = location_header.id
			AND
			location_header.deleted_at IS NULL	
		JOIN
			public.employees
			ON
			bills_to_receive.received_by = employees.id
	WHERE
		bills_to_receive.received = true
	AND
		bills_to_receive.deleted_by IS NULL
	AND 
		bills_to_receive.deleted_at IS NULL
	ORDER BY
		data_recebimento DESC;
		
