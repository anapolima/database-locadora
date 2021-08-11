-- ###  LOCATION_ITEMS  ###
CREATE INDEX IF NOT EXISTS
	idx_litems_id
	ON
	public.location_items (
		  id
		, deleted_at
	);
	
CREATE INDEX IF NOT EXISTS
	idx_litems_id_tool
	ON
	public.location_items (
		  tool_id
		, deleted_at
	);

CREATE INDEX IF NOT EXISTS
	idx_litems_id_header
	ON
	public.location_items (
		  location_header_id
		, deleted_at
	);
	
CREATE INDEX IF NOT EXISTS
	idx_litems_id_cli_tool_header
	ON
	public.location_items (
		  tool_id
		, location_header_id
		, deleted_at
	);