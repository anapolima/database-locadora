CREATE OR REPLACE VIEW vw_overdue_bills_to_pay AS
    SELECT 
        bills_to_pay.provider_id AS id_fornecedor
        , bills_to_pay.provider_cpf_cnpj AS documento_fornecedor  
        , providers.name AS nome_fornecedor
        , bills_to_pay.installments_number AS total_de_parcelas
        , bills_to_pay.installment AS numero_parcela
        , CONCAT('R$', ' ', bills_to_pay.installments_value) AS valor_parcela
        , CONCAT('R$', ' ', bills_to_pay.total_price) AS valor_total
        , bills_to_pay.due_date AS data_vencimento
        , CASE
            WHEN 
            bills_to_pay.due_date 
                BETWEEN
                        CURRENT_DATE - INTERVAL'30 days'
                    AND
                        CURRENT_DATE
                THEN 'VENCIDO'
            WHEN
                bills_to_pay.due_date 
                    BETWEEN 
                        CURRENT_DATE - INTERVAL'60 days'
                    AND
                        CURRENT_DATE - INTERVAL'30 days'
                THEN 'VENCIDO HÁ MAIS DE 30 DIAS'
            WHEN
                bills_to_pay.due_date 
                    BETWEEN 
                        CURRENT_DATE - INTERVAL'90 days'
                    AND
                        CURRENT_DATE - INTERVAL'60 days'
                THEN 'VENCIDO HÁ MAIS DE 60 DIAS'
            WHEN
                bills_to_pay.due_date 
                    BETWEEN 
                        CURRENT_DATE - INTERVAL'120 days'
                    AND
                        CURRENT_DATE - INTERVAL'90 days'
                THEN 'VENCIDO HÁ MAIS DE 90 DIAS'
            WHEN
                bills_to_pay.due_date 
                    <= CURRENT_DATE - INTERVAL'120 days'
                THEN 'VENCIDO HÁ MAIS DE 120 DIAS'
        END
        AS STATUS
	FROM bills_to_pay
		JOIN
			providers
			ON
			providers.id = bills_to_pay.provider_id 
			AND
				providers.deleted_at IS NULL
			AND
				providers.deleted_by IS NULL
		
	WHERE
		bills_to_pay.payed = false
	AND
		bills_to_pay.due_date < CURRENT_DATE
	AND
		bills_to_pay.deleted_by IS NULL
	AND 
		bills_to_pay.deleted_at IS NULL;
