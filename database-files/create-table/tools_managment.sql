CREATE TABLE public.tools_managment
(
    "tool_id" integer NOT NULL,
    "available" integer NOT NULL,
    "rented" integer NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "updated_by" integer NOT NULL,
    "total" integer NOT NULL,
    "deleted_at" time with time zone,
    "deleted_by" integer,
    CONSTRAINT "TOOLS_MANAGMENT_pk" PRIMARY KEY ("tool_id"),
    CONSTRAINT "TOOLS_MANAGMENT_available_quantity_check" CHECK (available >= 0),
    CONSTRAINT "TOOLS_MANAGMENT_rented_quantity_check" CHECK (rented >= 0)
)


ALTER TABLE
    public.tools_managment
    ADD CONSTRAINT
        "TOOLS_MANAGMENT_fk0"
        FOREIGN KEY
            ("updated_by")
        REFERENCES
            public.employees ("id");

ALTER TABLE
    public.tools_managment
    ADD CONSTRAINT
        "TOOLS_MANAGMENT_fk1"
        FOREIGN KEY
            ("deleted_by")
        REFERENCES
            public.employees ("id");
