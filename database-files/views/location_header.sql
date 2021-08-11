CREATE OR REPLACE VIEW public.vw_location_header AS
    SELECT
          clients.id AS id_cliente
        , clients.first_name AS cliente_nome
        , clients.last_name AS cliente_sobrenome
        , location_items.departure_date AS data_da_locacao
        , CONCAT('R$', ' ', location_items.total_price) AS valor_total
        , employees.id AS id_recepcionista
        , employees.first_name AS recepcionista_nome
        , employees.last_name AS recepcionista_sobrenome
        , payment_methods.method AS metodo_pagamento
        , location_header.installments_number AS numero_parcelas
   FROM
        location_items
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
        location_header.deleted_at IS NULL
    AND
        location_header.deleted_by IS NULL;