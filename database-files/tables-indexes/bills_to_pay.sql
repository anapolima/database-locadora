-- ###  BIILS_TO_PAY  ###
CREATE INDEX IF NOT EXISTS
	idx_payable_id
	ON
	public.bills_to_pay(
		  id
		, deleted_at
	);
	
CREATE INDEX IF NOT EXISTS
	idx_payable_id_provider
	ON
	public.bills_to_pay(
		  provider_id
		, deleted_at
	);

CREATE INDEX IF NOT EXISTS
	idx_payable_payed
	ON
	public.bills_to_pay(
		  payed
		, deleted_at
	);
