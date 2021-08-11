-- ###  ADDRESSES ###
CREATE INDEX IF NOT EXISTS
	idx_address_id
	ON
	public.addresses (
		  id
		, deleted_at
	);

CREATE INDEX IF NOT EXISTS
	idx_address_id_client
	ON
	public.addresses (
		  client_id
		, deleted_at
	);