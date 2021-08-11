CREATE TABLE public.employees (
	"id" serial NOT NULL UNIQUE,
	"office_id" integer NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"phone_ddi" varchar(3) NOT NULL,
	"phone_ddd" varchar(2) NOT NULL,
	"phone_number" varchar(9) NOT NULL,
	"city" varchar(80) NOT NULL,
	"state" varchar(2) NOT NULL,
	"address" varchar(200) NOT NULL,
	"cpf" varchar(14) NOT NULL UNIQUE,
    "username" varchar(18) UNIQUE,
    "password" varchar(60),
	"created_at" timestamp with time zone,
	"created_by" integer,
	"updated_at" timestamp with time zone,
	"updated_by" integer,
	"deleted_at" timestamp with time zone,
	"deleted_by" integer,
	CONSTRAINT "EMPLOYEES_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE
    public.employees
    ADD CONSTRAINT
        "EMPLOYEES_fk0"
        FOREIGN KEY
            ("office_id")
        REFERENCES
            public.office("id");
            
ALTER TABLE
    public.employees
    ADD CONSTRAINT
        "EMPLOYEES_fk1"
        FOREIGN KEY
            ("created_by")
        REFERENCES
            public.employees("id");
                
ALTER TABLE
    public.employees
    ADD CONSTRAINT
        "EMPLOYEES_fk2"
        FOREIGN KEY
            ("updated_by")
        REFERENCES
            public.employees("id");
                
ALTER TABLE
    public.employees
    ADD CONSTRAINT
        "EMPLOYEES_fk3"
        FOREIGN KEY
            ("deleted_by")
        REFERENCES
            public.employees("id");
                 