 CREATE TABLE public.clients (
    "id" integer NOT NULL DEFAULT nextval('"CLIENTS_id_seq"'::regclass) UNIQUE,
    "first_name" varchar(50) NOT NULL,
    "last_name" varchar(50) NOT NULL,
    "phone_ddi" varchar(3) NOT NULL DEFAULT (+ 55),
    "phone_ddd" varchar(3) NOT NULL DEFAULT 14,
    "phone_number" varchar(9) NOT NULL,
    "document" varchar(18) UNIQUE,
    "username" varchar(18) UNIQUE NOT NULL,
    "password" varchar(60) NOT NULL,
    "created_at" timestamp with time zone NOT NULL DEFAULT now(),
    "created_by" integer NOT NULL,
    "updated_at" timestamp with time zone,
    "updated_by" integer,
    "deleted_at" timestamp with time zone,
    "deleted_by" integer,
    CONSTRAINT "CLIENTS_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


ALTER TABLE
    public.clients
    ADD CONSTRAINT
        "CLIENTS_fk0"
        FOREIGN KEY
            ("created_by")
        REFERENCES
            public.employees("id");

ALTER TABLE
public.clients
    ADD CONSTRAINT
        "CLIENTS_fk1"
        FOREIGN KEY
            ("updated_by")
        REFERENCES
            public.employees("id");

ALTER TABLE
public.clients
    ADD CONSTRAINT
        "CLIENTS_fk2"
        FOREIGN KEY
            ("deleted_by")
        REFERENCES
            public.employees("id");

ALTER TABLE
	public.clients
	ADD COLUMN
		"inactivated_at" timestamp with time zone,
	ADD COLUMN
	 	"inactivated_by" integer;
	
ALTER TABLE
	public.clients
	ADD CONSTRAINT
		"CLIENTS_fk3"
		FOREIGN KEY
			("inactivated_by")
		REFERENCES
			public.employees("id");