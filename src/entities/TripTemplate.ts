import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, BaseEntity } from "typeorm";
import type { Province } from "./Province";
import type { TripTemplateDay } from "@/entities/TripTemplateDay";

@Entity({ name: "TripTemplate", schema: "public" })
export class TripTemplate extends BaseEntity {
    @PrimaryColumn({ type: "uuid" })
    id!: string;

    @Column({ type: "text" })
    title!: string;

    @Column({ type: "text", nullable: true })
    description?: string | null;

    @Column({ type: "uuid", nullable: true })
    provinceId?: string | null;

    @Column({ type: "boolean", default: false })
    isPublic!: boolean;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

    @Column({ type: "text", nullable: true })
    avatar?: string | null;

    @Column({ type: "decimal", precision: 20, scale: 2, default: 0 })
    fee!: number;

    @ManyToOne("Province", (province: Province) => province.tripTemplates, { nullable: true })
    @JoinColumn({ name: "provinceId" })
    province?: Province | null;

    @OneToMany("TripTemplateDay", (day: TripTemplateDay) => day.tripTemplate, { cascade: true })
    days!: TripTemplateDay[];
}
