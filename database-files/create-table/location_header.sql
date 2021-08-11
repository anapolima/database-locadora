CREATE TABLE public.location_header (
	"id" serial NOT NULL,
	"client_id" integer NOT NULL,
	"address_id" integer NOT NULL,
	"address_client_id" integer NOT NULL,
	"payment_method_id" integer,
	"payment_condition_id" integer,
	"installments_number" integer NOT NULL DEFAULT '1',
	"installments_value" DECIMAL(6,2) NOT NULL CHECK (installments_value > 0),
    "payment_method_id" integer,
    "payment_condition_id" integer,
	"created_at" time with time zone NOT NULL,
	"created_by" integer NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"updated_by" integer NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" integer,
	CONSTRAINT "LOCATION_HEADER_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE
    public.location_header
    ADD CONSTRAINT
        "LOCATION_HEADER_fk0"
        FOREIGN KEY
            ("client_id")
        REFERENCES
            "CLIENTS"("id");

ALTER TABLE
    public.location_header
    ADD CONSTRAINT
        "LOCATION_HEADER_fk1"
        FOREIGN KEY
            ("address_id")
        REFERENCES
            "ADDRESSES"("id");

ALTER TABLE
    public.location_header
    ADD CONSTRAINT
        "LOCATION_HEADER_fk2"
        FOREIGN KEY
            ("address_client_id")
        REFERENCES
            "ADDRESSES"("client_id");

ALTER TABLE
    public.location_header
    ADD CONSTRAINT
        "LOCATION_HEADER_fk3"
        FOREIGN KEY
            ("created_by")
        REFERENCES
            "EMPLOYEES"("id");

ALTER TABLE
    public.location_header
    ADD CONSTRAINT
        "LOCATION_HEADER_fk4"
        FOREIGN KEY
            ("updated_by")
        REFERENCES
            "EMPLOYEES"("id");

ALTER TABLE
    public.location_header
    ADD CONSTRAINT
        "LOCATION_HEADER_fk5"
        FOREIGN KEY
            ("deleted_by")
        REFERENCES
            "EMPLOYEES"("id");

ALTER TABLE
    public.location_header
    ADD CONSTRAINT
        "LOCATION_HEADER_fk6"
        FOREIGN KEY
            ("payment_condition_id")
        REFERENCES
            "PAYMENT_CONDITIONS"("id");

ALTER TABLE
    public.location_header
    ADD CONSTRAINT
        "LOCATION_HEADER_fk7"
        FOREIGN KEY
            ("payment_method_id")
        REFERENCES
            "PAYMENT_METHODS"("id");
