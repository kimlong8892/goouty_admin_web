import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn, BaseEntity, CreateDateColumn } from "typeorm";
import type { TripTemplate } from "@/entities/TripTemplate";
import type { TripTemplateActivity } from "@/entities/TripTemplateActivity";

@Entity({ name: "TripTemplateDay", schema: "public" })
export class TripTemplateDay extends BaseEntity {
    @PrimaryColumn({ type: "uuid" })
    id!: string;

    @Column({ type: "text" })
    title!: string;

    @Column({ type: "text", nullable: true })
    description?: string | null;

    @Column({ type: "integer" })
    dayOrder!: number;

    @Column({ type: "uuid" })
    tripTemplateId!: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;


    @ManyToOne("TripTemplate", (template: TripTemplate) => template.days, { onDelete: "CASCADE" })
    @JoinColumn({ name: "tripTemplateId" })
    tripTemplate!: TripTemplate;

    @OneToMany("TripTemplateActivity", (activity: TripTemplateActivity) => activity.day, { cascade: true })
    activities!: TripTemplateActivity[];
}
