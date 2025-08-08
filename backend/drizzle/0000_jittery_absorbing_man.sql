CREATE TABLE "bills" (
	"id" text PRIMARY KEY NOT NULL,
	"tenantId" text,
	"amount" real,
	"month" integer,
	"year" integer,
	"isPaid" boolean,
	"dueDate" timestamp,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" text PRIMARY KEY NOT NULL,
	"address" jsonb,
	"ownerId" text,
	"nickname" text,
	"propertyType" text,
	"imageUrl" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" text PRIMARY KEY NOT NULL,
	"firstName" text,
	"lastName" text,
	"phoneNumber" text,
	"email" text,
	"monthlyRent" real,
	"monthlyCharge" real,
	"unitId" text,
	"entryDate" timestamp,
	"isActive" boolean,
	"leaseStartDate" timestamp,
	"leaseEndDate" timestamp,
	"securityDeposit" real,
	"notes" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "units" (
	"id" text PRIMARY KEY NOT NULL,
	"unitNumber" text,
	"isOccupied" boolean,
	"bedrooms" integer,
	"bathrooms" integer,
	"squareFootage" integer,
	"tenantIds" jsonb,
	"propertyId" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"firstName" text,
	"lastName" text,
	"email" text,
	"token" text,
	"phone" text,
	"address" jsonb,
	"avatarUrl" text,
	"propertyIds" jsonb,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	"password" text,
	"resetPasswordToken" text,
	"resetPasswordExpires" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bills" ADD CONSTRAINT "bills_tenantId_tenants_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_ownerId_users_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_unitId_units_id_fk" FOREIGN KEY ("unitId") REFERENCES "public"."units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "units" ADD CONSTRAINT "units_propertyId_properties_id_fk" FOREIGN KEY ("propertyId") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;