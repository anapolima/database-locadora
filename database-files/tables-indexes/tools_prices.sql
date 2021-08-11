-- ###  TOOLS_PRICES  ###
CREATE INDEX IF NOT EXISTS
	idx_tools_prices_id
	ON
	public.tools_prices (
		  id
		, deleted_at
	);
	
CREATE INDEX IF NOT EXISTS
	idx_tools_prices_id_tool
	ON
	public.tools_prices (
		  tool_id
		, deleted_at
	);
	
CREATE INDEX IF NOT EXISTS
	idx_tools_prices_id_toolid
	ON
	public.tools_prices (
		  tool_id
		, id
		, deleted_at
	);