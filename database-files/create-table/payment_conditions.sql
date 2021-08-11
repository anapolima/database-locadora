CREATE TABLE public.payment_conditions
(
    "id" integer NOT NULL DEFAULT nextval('payment_methods_id_seq'::regclass) UNIQUE,
    "condition" varchar(9),
    "created_at" timestamp with time zone NOT NULL DEFAULT 'now()',
    "created_by" integer NOT NULL,
    "updated_at" timestamp with time zone,
    "updated_by" integer,
    "deleted_at" timestamp with time zone,
    "deleted_by" integer,
    CONSTRAINT "PAYMENT_CONDITIONS_pk" PRIMARY KEY (id)
) WITH (
  OIDS=FALSE
);

ALTER TABLE
    public.payment_conditions
    ADD CONSTRAINT
        "PAYMENT_CONDITIONS_fk0"
        FOREIGN KEY
            ("created_by")
        REFERENCES
            public.employees("id");

ALTER TABLE
    public.payment_conditions
    ADD CONSTRAINT
        "PAYMENT_CONDITIONS_fk1"
        FOREIGN KEY
            ("updated_by")
        REFERENCES
            public.employees("id");

ALTER TABLE
    public.payment_conditions
    ADD CONSTRAINT
        "PAYMENT_CONDITIONS_fk2"
        FOREIGN KEY
            ("deleted_by")
        REFERENCES
            public.employees("id");