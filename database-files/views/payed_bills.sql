CREATE OR REPLACE VIEW vw_payed_bills AS
    SELECT 
        bills_to_pay.provider_id AS id_fornecedor
        , bills_to_pay.provider_cpf_cnpj AS documento_fornecedor  
        , providers.name AS nome_fornecedor
        , bills_to_pay.installments_number AS total_de_parcelas
        , bills_to_pay.installment AS numero_parcela
        , CONCAT('R$', ' ', bills_to_pay.installments_value) AS valor_parcela
        , CONCAT('R$', ' ', bills_to_pay.total_price) AS valor_total
        , bills_to_pay.due_date AS data_vencimento
        , bills_to_pay.payed_at AS data_pagamento
	FROM bills_to_pay
		JOIN
			providers
		ON
			providers.id = bills_to_pay.provider_id
		
	WHERE
		bills_to_pay.payed = true
	AND
		bills_to_pay.deleted_by IS NULL
	AND 
		bills_to_pay.deleted_at IS NULL
	ORDER BY
		data_vencimento DESC;

