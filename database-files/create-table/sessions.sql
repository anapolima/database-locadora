CREATE TABLE public.sessions (
	  "id" serial NOT NULL UNIQUE
	, "session_type_id" integer NOT NULL
	, "user_id" integer NOT NULL
	, "started_at" timestamp with time zone NOT NULL
	, "ended_at" timestamp with time zone
	, CONSTRAINT "SESSIONS_pk" PRIMARY KEY (id)
	, CONSTRAINT "SESSIONS_fk0" FOREIGN KEY (session_type_id)
        REFERENCES public.session_types (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

ALTER TABLE
	public.sessions
	ADD COLUMN
		  "last_activity" timestamp with time zone NOT NULL DEFAULT 'NOW()'
		, "session_token" varchar(64);