CREATE TABLE public.tools (
	"id" serial NOT NULL UNIQUE,
	"group_id" integer NOT NULL,
	"name" varchar(80) NOT NULL,
	"description" varchar(140),
	"quantity" integer NOT NULL CHECK (quantity > 0),
	"created_at" timestamp with time zone,
	"created_by" integer,
	"updated_at" timestamp with time zone,
	"updated_by" integer,
	"deleted_at" timestamp with time zone,
	"deleted_by" integer,
	CONSTRAINT "TOOLS_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE
    public.tools
    ADD CONSTRAINT
        "TOOLS_fk0"
        FOREIGN KEY
            ("group_id")
        REFERENCES
            public.tools_groups("id");
            
ALTER TABLE
    public.tools
    ADD CONSTRAINT
        "TOOLS_fk1"
        FOREIGN KEY
            ("created_by")
        REFERENCES
            public.employees("id");
            
ALTER TABLE
    public.tools
    ADD CONSTRAINT
        "TOOLS_fk2"
        FOREIGN KEY
            ("updated_by")
        REFERENCES
            public.employees("id");
            
ALTER TABLE
    public.tools
    ADD CONSTRAINT
        "TOOLS_fk3"
        FOREIGN KEY
            ("deleted_by")
        REFERENCES
            public.employees("id");
            