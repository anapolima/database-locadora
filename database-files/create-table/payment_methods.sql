CREATE TABLE public.payment_methods
(
    "id" integer NOT NULL DEFAULT nextval('payment_methods_id_seq1'::regclass) UNIQUE,
    "method" VARCHAR(22),
    "created_at" timestamp with time zone NOT NULL DEFAULT 'now()',
    "created_by" integer NOT NULL,
    "updated_at" timestamp with time zone,
    "updated_by" integer,
    "deleted_at" timestamp with time zone,
    "deleted_by" integer,
    CONSTRAINT "PAYMENT_METHODS_pk" PRIMARY KEY (id)
) WITH (
    OIDS=FALSE
);

ALTER TABLE
    public.payment_methods
    ADD CONSTRAINT
        "PAYMENT_METHODS_fk0"
        FOREIGN KEY
            ("created_by")
        REFERENCES
            public.employees("id");

ALTER TABLE
    public.payment_methods
    ADD CONSTRAINT
        "PAYMENT_METHODS_fk1"
        FOREIGN KEY
            ("updated_by")
        REFERENCES
            public.employees("id");

ALTER TABLE
    public.payment_methods
    ADD CONSTRAINT
        "PAYMENT_METHODS_fk2"
        FOREIGN KEY
            ("deleted_by")
        REFERENCES
            public.employees("id");