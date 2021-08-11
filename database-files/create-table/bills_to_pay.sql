CREATE TABLE public.bills_to_pay (
	"id" serial NOT NULL UNIQUE,
	"installment" integer NOT NULL,
	"provider_id" integer NOT NULL,
	"provider_cpf_cnpj" varchar(18) NOT NULL,
	"name" varchar(80) NOT NULL,
	"description" varchar(140),
	"payment_method_id" integer NOT NULL,
    "payment_condition_id" integer NOT NULL,
	"installments_number" integer NOT NULL DEFAULT '1',
	"installments_value" DECIMAL(6,2) NOT NULL CHECK (installments_value > 0),
	"total_price" DECIMAL(6,2) NOT NULL CHECK (total_price > 0),
    "due_date" date NOT NULL,
	"payed" BOOLEAN NOT NULL DEFAULT 'false',
	"payed_at" timestamp with time zone,
	"created_at" timestamp with time zone,
	"created_by" integer,
	"updated_at" timestamp with time zone,
	"updated_by" integer,
	"deleted_at" timestamp with time zone,
	"deleted_by" integer,
	CONSTRAINT "BILLS_TO_PAY_pk" PRIMARY KEY ("id","installment","provider_id","provider_cpf_cnpj")
) WITH (
  OIDS=FALSE
);


ALTER TABLE
    public.bills_to_pay
    ADD CONSTRAINT
        "BILLS_TO_PAY_fk0"
        FOREIGN KEY
            ("provider_id"
        REFERENCES
            public.providers("id");

ALTER TABLE
    public.bills_to_pay
    ADD CONSTRAINT
        "BILLS_TO_PAY_fk1"
        FOREIGN KEY
            ("provider_cpf_cnpj")
        REFERENCES
            public.providers("cpf_cnpj");

ALTER TABLE
    public.bills_to_pay
    ADD CONSTRAINT
        "BILLS_TO_PAY_fk2"
        FOREIGN KEY
            ("created_by")
        REFERENCES
            public.employees("id");

ALTER TABLE
    public.bills_to_pay
    ADD CONSTRAINT
        "BILLS_TO_PAY_fk3"
        FOREIGN KEY
            ("updated_by")
        REFERENCES
            public.employees("id");

ALTER TABLE
    public.bills_to_pay
    ADD CONSTRAINT
        "BILLS_TO_PAY_fk4"
        FOREIGN KEY
            ("deleted_by")
        REFERENCES
            public.employees("id");

ALTER TABLE
    public.bills_to_pay
    ADD CONSTRAINT
        "BILLS_TO_PAY_fk5"
        FOREIGN KEY
            ("payment_method_id")
        REFERENCES
            public.payment_methods("id");

ALTER TABLE
    public.bills_to_pay
    ADD CONSTRAINT
        "BILLS_TO_PAY_fk6"
        FOREIGN KEY
            ("payment_condition_id")
        REFERENCES
            public.payment_conditions("id");


ALTER TABLE
    public.bills_to_pay
    ADD CONSTRAINT
        "BILLS_TO_PAY_installments_value_check"
        CHECK
            (installments_value > 0);