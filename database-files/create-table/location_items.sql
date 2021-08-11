CREATE TABLE public.location_items (
	"id" serial NOT NULL,
	"tool_id" integer NOT NULL,
	"location_header_id" integer NOT NULL,
	"quantity" integer NOT NULL CHECK (quantity > 0),
	"entry_date" DATE NOT NULL,
	"entry_hour" TIME NOT NULL,
	"departure_date" DATE,
	"departure_hour" TIME,
	"delivery" BOOLEAN NOT NULL DEFAULT 'false',
	"delivery_price" DECIMAL(6,2) DEFAULT '0.00' CHECK(delivery_price >= 0),
	"total_price" DECIMAL(5,2) NOT NULL CHECK (total_price > 0),
	"discount" DECIMAL(6,2) CHECK (discount < total_price),
	"discount_description" varchar(140),
    "deleted_at" timestamp with time zone,
    "deleted_by" integer,
    "updated_at" timestamp with time zone,
    "updated_by" integer,
	CONSTRAINT "LOCATION_ITEMS_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE
    public.location_items
    ADD CONSTRAINT
        "LOCATION_ITEMS_fk0"
            FOREIGN KEY
                ("tool_id")
            REFERENCES
                public.tools("id");

ALTER TABLE
    public.location_items
    ADD CONSTRAINT
        "LOCATION_ITEMS_fk1"
            FOREIGN KEY
                ("location_header_id")
            REFERENCES
                public.location_header("id");

ALTER TABLE
    public.location_items
    ADD CONSTRAINT
        "LOCATION_ITEMS_fk2"
            FOREIGN KEY
                ("deleted_by")
            REFERENCES
                public.employees("id");

ALTER TABLE
    public.location_items
    ADD CONSTRAINT
        "LOCATION_ITEMS_fk3"
            FOREIGN KEY
                ("updated_by")
            REFERENCES
                public.employees("id");

