
CREATE TABLE public.tools_groups (
	"id" serial NOT NULL UNIQUE,
	"name" varchar(20) NOT NULL,
	"description" varchar(140),
	"created_at" timestamp with time zone,
	"created_by" integer,
	"updated_at" timestamp with time zone,
	"updated_by" integer,
	"deleted_at" timestamp with time zone,
	"deleted_by" integer,
	CONSTRAINT "TOOLS_GROUPS_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE
    public.tools_groups
    ADD CONSTRAINT
        "TOOLS_GROUPS_fk0"
        FOREIGN KEY
            ("created_by")
        REFERENCES
            public.employees("id"); 

ALTER TABLE
    public.tools_groups
    ADD CONSTRAINT
        "TOOLS_GROUPS_fk1"
        FOREIGN KEY
            ("updated_by")
        REFERENCES
            public.employees("id"); 

ALTER TABLE
    public.tools_groups
    ADD CONSTRAINT
        "TOOLS_GROUPS_fk2"
        FOREIGN KEY
            ("deleted_by")
        REFERENCES
            public.employees("id"); 

ALTER TABLE
	public.tools_groups
	ADD COLUMN
		"inactivated_at" timestamp with time zone,
	ADD COLUMN
	 	"inactivated_by" integer;
	
ALTER TABLE
	public.tools_groups
	ADD CONSTRAINT
		"TOOLS_GROUPS_fk3"
		FOREIGN KEY
			("inactivated_by")
		REFERENCES
			public.employees("id");