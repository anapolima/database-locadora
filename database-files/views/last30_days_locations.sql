CREATE OR REPLACE VIEW vw_last_30days_locations AS
    SELECT 
        clients.id AS id_cliente
        , CONCAT(clients.first_name, ' ', clients.last_name) AS cliente_nome
        , location_items.departure_date AS data_da_locacao
        , CONCAT('R$', ' ', location_items.total_price) AS valor_total
        , employees.id AS id_recepcionista
        , CONCAT(employees.first_name, ' ', employees.last_name) AS recepcionista_nome
        , payment_methods.method AS metodo_pagamento
        , location_header.installments_number AS numero_parcelas
        
    FROM location_items

    JOIN
        location_header
        ON
            location_header.id = location_items.location_header_id
    JOIN 
        clients
        ON
            location_header.client_id = clients.id
    JOIN
        employees
        ON
            location_header.created_by = employees.id
    JOIN
        payment_methods
        ON
            payment_methods.id = location_header.payment_method_id
    WHERE 
        location_header.deleted_at IS null
    AND
        location_header.deleted_by IS null
    AND
        location_items.departure_date
        BETWEEN
            CURRENT_DATE - INTERVAL'30 days'
        AND
            CURRENT_DATE;