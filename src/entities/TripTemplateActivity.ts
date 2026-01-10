import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import type { TripTemplateDay } from "@/entities/TripTemplateDay";

@Entity({ name: "TripTemplateActivity", schema: "public" })
export class TripTemplateActivity extends BaseEntity {
    @PrimaryColumn({ type: "uuid" })
    id!: string;

    @Column({ type: "text" })
    title!: string;

    @Column({ type: "text", nullable: true })
    startTime?: string | null;

    @Column({ type: "integer", nullable: true })
    durationMin?: number | null;

    @Column({ type: "text", nullable: true })
    location?: string | null;

    @Column({ type: "text", nullable: true })
    notes?: string | null;

    @Column({ type: "boolean", default: false })
    important!: boolean;

    @Column({ type: "integer" })
    activityOrder!: number;

    @Column({ type: "uuid" })
    dayId!: string;

    @ManyToOne("TripTemplateDay", (day: TripTemplateDay) => day.activities, { onDelete: "CASCADE" })
    @JoinColumn({ name: "dayId" })
    day!: TripTemplateDay;
}
