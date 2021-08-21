CREATE INDEX IF NOT EXISTS
	idx_session_token_ended
	ON
	public.sessions (
		  session_token
		, ended_at
	);