CREATE TABLE "public.sessions" (
	"id" serial NOT NULL,
	"userId" integer NOT NULL,
	"token" TEXT NOT NULL,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.users" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"password" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public.statement" (
	"id" serial NOT NULL,
	"userId" integer NOT NULL,
	"value" integer NOT NULL,
	"description" TEXT NOT NULL,
	"date" DATE NOT NULL,
	CONSTRAINT "statement_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");


ALTER TABLE "statement" ADD CONSTRAINT "statement_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");

