CREATE TABLE public.office (
	"id" serial NOT NULL,
	"name" varchar(20) NOT NULL,
	"description" varchar(140),
	"salary" DECIMAL(6,2) NOT NULL CHECK (salary > 0),
	"created_at" time with time zone NOT NULL,
	"created_by" integer NOT NULL,
	"updated_at" time with time zone NOT NULL,
	"updated_by" integer NOT NULL,
	"deleted_at" time with time zone,
	"deleted_by" integer,
	CONSTRAINT "OFFICE_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


ALTER TABLE
    public.office
    ADD CONSTRAINT
        "OFFICE_fk0"
        FOREIGN KEY
            ("created_by")
        REFERENCES
            public.employees("id");
            
ALTER TABLE
    public.office
    ADD CONSTRAINT
        "OFFICE_fk1"
        FOREIGN KEY
            ("updated_by")
        REFERENCES
            public.employees("id");
            
ALTER TABLE
    public.office
    ADD CONSTRAINT
        "OFFICE_fk2"
        FOREIGN KEY
            ("deleted_by")
        REFERENCES
            public.employees("id");     

ALTER TABLE
	public.office
	ADD COLUMN
		"inactivated_at" timestamp with time zone,
	ADD COLUMN
	 	"inactivated_by" integer;
	
ALTER TABLE
	public.office
	ADD CONSTRAINT
		"OFFICE_fk3"
		FOREIGN KEY
			("inactivated_by")
		REFERENCES
			public.employees("id");