-- Trip Templates Migration
-- This file contains the SQL schema for Trip Templates feature
-- Run this if the tables don't exist yet

-- TripTemplate table
CREATE TABLE IF NOT EXISTS public."TripTemplate"
(
    id           uuid                                     NOT NULL PRIMARY KEY,
    title        text                                     NOT NULL,
    description  text,
    "provinceId" uuid REFERENCES public."Province"(id)
                      ON UPDATE CASCADE ON DELETE SET NULL,
    "isPublic"   boolean        DEFAULT false             NOT NULL,
    "createdAt"  timestamp(3)   DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt"  timestamp(3)                             NOT NULL,
    avatar       text,
    fee          numeric(20, 2) DEFAULT 0                 NOT NULL
);

-- TripTemplateDay table
CREATE TABLE IF NOT EXISTS public."TripTemplateDay"
(
    id               uuid    NOT NULL PRIMARY KEY,
    title            text    NOT NULL,
    description      text,
    "dayOrder"       integer NOT NULL,
    "tripTemplateId" uuid    NOT NULL REFERENCES public."TripTemplate"(id)
                             ON UPDATE CASCADE ON DELETE CASCADE
);

-- TripTemplateActivity table
CREATE TABLE IF NOT EXISTS public."TripTemplateActivity"
(
    id              uuid                  NOT NULL PRIMARY KEY,
    title           text                  NOT NULL,
    "startTime"     text,
    "durationMin"   integer,
    location        text,
    notes           text,
    important       boolean DEFAULT false NOT NULL,
    "activityOrder" integer               NOT NULL,
    "dayId"         uuid                  NOT NULL REFERENCES public."TripTemplateDay"(id)
                                          ON UPDATE CASCADE ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS "TripTemplate_provinceId_idx" 
    ON public."TripTemplate" ("provinceId");

CREATE INDEX IF NOT EXISTS "TripTemplateDay_tripTemplateId_idx" 
    ON public."TripTemplateDay" ("tripTemplateId");

CREATE INDEX IF NOT EXISTS "TripTemplateActivity_dayId_idx" 
    ON public."TripTemplateActivity" ("dayId");

-- Set owner (adjust as needed)
ALTER TABLE public."TripTemplate" OWNER TO postgres;
ALTER TABLE public."TripTemplateDay" OWNER TO postgres;
ALTER TABLE public."TripTemplateActivity" OWNER TO postgres;

-- Comments
COMMENT ON TABLE public."TripTemplate" IS 'Trip template master table';
COMMENT ON TABLE public."TripTemplateDay" IS 'Days in a trip template';
COMMENT ON TABLE public."TripTemplateActivity" IS 'Activities for each day';
