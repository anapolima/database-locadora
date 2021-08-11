CREATE TABLE public.providers (
	"id" serial NOT NULL,
	"cpf_cnpj" varchar(18) NOT NULL UNIQUE,
	"name" varchar(100) NOT NULL,
	"email" varchar(50),
	"zip_code" varchar(9) NOT NULL,
	"city" varchar(80) NOT NULL,
	"state" varchar(2) NOT NULL,
	"address" varchar(200),
	"phone_ddd" varchar(2) NOT NULL,
	"phone_ddi" varchar(3) NOT NULL,
	"phone_number" varchar(9) NOT NULL,
	"description" varchar(140) NOT NULL,
	"created_at" timestamp with time zone,
	"created_by" integer,
	"updated_at" timestamp with time zone,
	"updated_by" integer,
	"deleted_at" timestamp with time zone,
	"deleted_by" integer,
	CONSTRAINT "PROVIDERS_pk" PRIMARY KEY ("id","cpf_cnpj")
) WITH (
  OIDS=FALSE
);

ALTER TABLE
    public.providers
    ADD CONSTRAINT
        "PROVIDERS_fk0"
        FOREIGN KEY
            ("created_by")
        REFERENCES
            public.employees("id");
            
ALTER TABLE
    public.providers
    ADD CONSTRAINT
        "PROVIDERS_fk1"
        FOREIGN KEY
            ("updated_by")
        REFERENCES
            public.employees("id");

ALTER TABLE
    public.providers
    ADD CONSTRAINT
        "PROVIDERS_fk1"
        FOREIGN KEY
            ("deleted_by")
        REFERENCES
            public.employees("id");
            

