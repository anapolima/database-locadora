CREATE TABLE public.session_types(
	  "id" serial NOT NULL UNIQUE
	, "type" varchar(10) NOT NULL UNIQUE
	, "description" varchar(140)
	, "created_at" timestamp with time zone
	, "created_by" integer NOT NULL
	, "updated_at" timestamp with time zone
	, "updated_by" integer NOT NULL
	, "deleted_at" timestamp with time zone
	, "deleted_by" integer NOT NULL
	, "inactivated_at" timestamp with time zone
	, "inactivated_by" integer NOT NULL
    , CONSTRAINT "SESSION_TYPES_pk" PRIMARY KEY (id)
	, CONSTRAINT "SESSION_TYPES_fk0" FOREIGN KEY (created_by)
        REFERENCES public.employees (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
    , CONSTRAINT "SESSION_TYPES_fk1" FOREIGN KEY (updated_by)
        REFERENCES public.employees (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
    , CONSTRAINT "SESSION_TYPES_fk2" FOREIGN KEY (deleted_by)
        REFERENCES public.employees (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
    , CONSTRAINT "SESSION_TYPES_fk3" FOREIGN KEY (inactivated_by)
        REFERENCES public.employees (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);