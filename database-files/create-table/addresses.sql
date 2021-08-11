CREATE TABLE public.addresses (
	"id" serial NOT NULL UNIQUE,
	"client_id" serial NOT NULL,
	"zip_code" varchar(9) NOT NULL,
	"city" varchar(80) NOT NULL,
	"state" varchar(2) NOT NULL,
	"address" varchar(80) NOT NULL,
    "description" varchar(140)
	"created_at" timestamp with time zone,
	"created_by" integer,
	"updated_at" timestamp with time zone,
	"updated_by" integer,
	"deleted_at" timestamp with time zone,
	"deleted_by" integer,
	CONSTRAINT "ADDRESSES_pk" PRIMARY KEY ("id","client_id")
) WITH (
  OIDS=FALSE
);


ALTER TABLE
    public.addresses
    ADD CONSTRAINT
    "ADDRESSES_fk0"
        FOREIGN KEY
            ("client_id")
        REFERENCES
            public.clients("id");

ALTER TABLE
    public.addresses
    ADD CONSTRAINT
    "ADDRESSES_fk1"
        FOREIGN KEY
            ("created_by"
         REFERENCES
            public.employees("id");

ALTER TABLE
    public.addresses
    ADD CONSTRAINT
    "ADDRESSES_fk2"
        FOREIGN KEY
            ("updated_by"
         REFERENCES
            public.employees("id");

ALTER TABLE
    public.addresses
    ADD CONSTRAINT
    "ADDRESSES_fk3"
        FOREIGN KEY
            ("deleted_by"
         REFERENCES
            public.employees("id");
