CREATE TABLE public.unit_measurement
(
    "id" integer NOT NULL DEFAULT nextval('"UNIT_MEASUREMENT_id_seq"'::regclass) UNIQUE,
    "period" varchar(9) NOT NULL,
    "created_at" timestamp with time zone DEFAULT 'now()',
    "created_by" integer NOT NULL,
    "updated_at" timestamp with time zone,
    "updated_by" integer,
    "deleted_at" timestamp with time zone,
    "deleted_by" integer,
    CONSTRAINT "UNIT_MEASUREMENT_pk" PRIMARY KEY ("id")
)

ALTER TABLE
    public.unit_measurement
    ADD CONSTRAINT
        "UNIT_MEASUREMENT_fk0"
        FOREIGN KEY
            ("created_by")
        REFERENCES
            public.employees("id");

ALTER TABLE
    public.unit_measurement
    ADD CONSTRAINT
        "UNIT_MEASUREMENT_fk1"
        FOREIGN KEY
            ("updated_by")
        REFERENCES
            public.employees("id");
ALTER TABLE
    public.unit_measurement
    ADD CONSTRAINT
        "UNIT_MEASUREMENT_fk2"
        FOREIGN KEY
            ("deleted_by")
        REFERENCES
            public.employees("id");

ALTER TABLE
	public.unit_measurement
	ADD COLUMN
		"inactivated_at" timestamp with time zone,
	ADD COLUMN
	 	"inactivated_by" integer;
	
ALTER TABLE
	public.unit_measurement
	ADD CONSTRAINT
		"UNIT_MEASUREMENT_fk3"
		FOREIGN KEY
			("inactivated_by")
		REFERENCES
			public.employees("id");