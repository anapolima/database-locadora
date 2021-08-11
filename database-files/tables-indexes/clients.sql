-- ###  CLIENTS  ###
CREATE INDEX IF NOT EXISTS
	idx_clients_id
	ON
	public.clients (
		  id
		, deleted_at
	);
