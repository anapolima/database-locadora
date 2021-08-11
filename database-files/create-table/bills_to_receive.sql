
CREATE TABLE public.bills_to_receive (
	"id" serial NOT NULL UNIQUE,
	"installment" integer NOT NULL,
	"client_id" integer NOT NULL,
	"location_header_id" integer NOT NULL,
	"received" BOOLEAN NOT NULL DEFAULT 'false',
	"received_at" timestamp with time zone,
	"received_by" integer,
	"received_value" DECIMAL(10,2) NOT NULL CHECK (received_value > 0),
	"created_at" timestamp with time zone NOT NULL,
	"created_by" integer,
	"updated_at" timestamp with time zone NOT NULL,
	"updated_by" integer,
	"deleted_at" timestamp with time zone,
	"deleted_by" integer,
	CONSTRAINT "BILLS_TO_RECEIVE_pk" PRIMARY KEY ("id","installment","client_id","location_header_id")
) WITH (
  OIDS=FALSE
);


ALTER TABLE
    public.bills_to_receive
    ADD CONSTRAINT
        "BILLS_TO_RECEIVE_fk0"
        FOREIGN KEY
            ("client_id")
        REFERENCES
            public.clients("id");

ALTER TABLE
    public.bills_to_receive
    ADD CONSTRAINT
        "BILLS_TO_RECEIVE_fk1"
        FOREIGN KEY
            ("location_header_id")
        REFERENCES
            public.location_header("id");

ALTER TABLE
    public.bills_to_receive
    ADD CONSTRAINT
        "BILLS_TO_RECEIVE_fk2"
        FOREIGN KEY
            ("received_by")
        REFERENCES
            public.employees("id");

ALTER TABLE
    public.bills_to_receive
    ADD CONSTRAINT
        "BILLS_TO_RECEIVE_fk3"
        FOREIGN KEY
            ("created_by")
        REFERENCES
            public.employees("id");

ALTER TABLE
    public.bills_to_receive
    ADD CONSTRAINT
        "BILLS_TO_RECEIVE_fk4"
        FOREIGN KEY
            ("updated_by")
        REFERENCES
            public.employees("id");

ALTER TABLE
    public.bills_to_receive
    ADD CONSTRAINT
        "BILLS_TO_RECEIVE_fk5"
        FOREIGN KEY
            ("deleted_by")
        REFERENCES
            public.employees("id");

ALTER TABLE
    public.bills_to_receive
    ADD CONSTRAINT
        "BILLS_TO_PAY_received_value_check"
        CHECK
            (received_value > 0);