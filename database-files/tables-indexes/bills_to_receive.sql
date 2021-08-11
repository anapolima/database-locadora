-- ###  BIILS_TO_RECEIVE  ###
CREATE INDEX IF NOT EXISTS
	idx_receive_id
	ON
	public.bills_to_receive(
		  id
		, deleted_at
	);
	
CREATE INDEX IF NOT EXISTS
	idx_receive_client_id
	ON
	public.bills_to_receive(
		  client_id
		, deleted_at
	);

CREATE INDEX IF NOT EXISTS
	idx_receive_location_id
	ON
	public.bills_to_receive(
		  location_header_id
		, client_id
		, deleted_at
	);
	