CREATE OR REPLACE VIEW vw_overdue_bills_to_receive AS
    SELECT 
        clients.id AS id_cliente
        , CONCAT(clients.first_name, ' ', clients.last_name) AS nome_cliente
        , CONCAT('R$', ' ', location_header.installments_value) AS valor_parcela
        , bills_to_receive.due_date AS data_vencimento
        , CASE
            WHEN 
            bills_to_receive.due_date 
                BETWEEN
                        CURRENT_DATE
                    AND
                        CURRENT_DATE - INTERVAL'30 days'
                THEN 'VENCIDO'
            WHEN
                bills_to_receive.due_date 
                    BETWEEN 
                        CURRENT_DATE - INTERVAL'30 days'
                    AND
                        CURRENT_DATE - INTERVAL'60 days'
                THEN 'VENCIDO HÁ MAIS DE 30 DIAS'
            WHEN
                bills_to_receive.due_date 
                    BETWEEN 
                        CURRENT_DATE - INTERVAL'60 days'
                    AND
                        CURRENT_DATE - INTERVAL'90 days'
                THEN 'VENCIDO HÁ MAIS DE 60 DIAS'
            WHEN
                bills_to_receive.due_date 
                    BETWEEN 
                        CURRENT_DATE - INTERVAL'90 days'
                    AND
                        CURRENT_DATE - INTERVAL'120 days'
                THEN 'VENCIDO HÁ MAIS DE 90 DIAS'
            WHEN
                bills_to_receive.due_date 
                    <= CURRENT_DATE - INTERVAL'120 days'
                THEN 'VENCIDO HÁ MAIS DE 120 DIAS'
        END
        AS STATUS
	FROM bills_to_receive
		JOIN
			clients
			ON
			    clients.id = bills_to_receive.client_id 
			AND
				clients.deleted_at IS NULL
			AND
				clients.deleted_by IS NULL
		JOIN 
			location_header
			ON
			    location_header.id = bills_to_receive.location_header_id
			AND
				location_header.deleted_at IS NULL
			AND
				location_header.deleted_by IS NULL
		
	WHERE
		bills_to_receive.received = false
	AND
		bills_to_receive.due_date < CURRENT_DATE
	AND
		bills_to_receive.deleted_by IS NULL
	AND 
		bills_to_receive.deleted_at IS NULL;