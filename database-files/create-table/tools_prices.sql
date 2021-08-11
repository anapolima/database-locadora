CREATE TABLE public.tools_prices (
	"id" serial NOT NULL,
	"tool_id" integer NOT NULL,
	"unit" DECIMAL(5,2) NOT NULL,
	"unit_measurement_id" integer NOT NULL,
	"price" DECIMAL(5,2) CHECK (price > 0),
	"created_at" timestamp with time zone,
	"created_by" integer,
	"updated_at" timestamp with time zone,
	"updated_by" integer,
	"deleted_at" timestamp with time zone,
	"deleted_by" integer,
	CONSTRAINT "TOOLS_PRICES_pk" PRIMARY KEY ("id","tool_id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE
    public.tools_prices
    ADD CONSTRAINT
        "TOOLS_PRICES_fk0"
        FOREIGN KEY
            ("tool_id")
        REFERENCES
            public.tools("id");

ALTER TABLE
    public.tools_prices
    ADD CONSTRAINT
        "TOOLS_PRICES_fk1"
        FOREIGN KEY
            ("unit_measurement_id")
        REFERENCES
            public.unit_measurement_id("id");

ALTER TABLE
    public.tools_prices
    ADD CONSTRAINT
        "TOOLS_PRICES_fk2"
        FOREIGN KEY
            ("created_by")
        REFERENCES
            public.employees("id");

ALTER TABLE
    public.tools_prices
    ADD CONSTRAINT
        "TOOLS_PRICES_fk3"
        FOREIGN KEY
            ("updated_by")
        REFERENCES
            public.employees("id");

ALTER TABLE
    public.tools_prices
    ADD CONSTRAINT
        "TOOLS_PRICES_fk4"
        FOREIGN KEY
            ("deleted_by")
        REFERENCES
            public.employees("id");
