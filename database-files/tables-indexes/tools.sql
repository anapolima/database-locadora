-- ###  TOOLS  ###
CREATE INDEX IF NOT EXISTS
	idx_tools_id
	ON
	public.tools (
		  id
		, deleted_at
	);
	
CREATE INDEX IF NOT EXISTS
	idx_tools_id_group
	ON
	public.tools (
		  group_id
		, deleted_at
	);