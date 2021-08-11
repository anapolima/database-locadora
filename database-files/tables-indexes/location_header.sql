-- ###  LOCATION_HEADER  ###
CREATE INDEX IF NOT EXISTS
	idx_lheader_id
	ON
	public.location_header (
		  id
		, deleted_at
	);
	
CREATE INDEX IF NOT EXISTS
	idx_lheader_id_client
	ON
	public.location_header (
		  client_id
		, deleted_at
	);
	
	