import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity } from "typeorm";
import { Trip } from "./Trip";
import type { TripTemplate } from "@/entities/TripTemplate";

@Entity({ name: "Province", schema: "public" })
export class Province extends BaseEntity {
    @PrimaryColumn({ type: "uuid" })
    id!: string;

    @Column({ type: "varchar" })
    name!: string;

    @Column({ type: "integer", unique: true })
    code!: number;

    @Column({ type: "varchar" })
    divisionType!: string;

    @Column({ type: "varchar", unique: true })
    codename!: string;

    @Column({ type: "integer" })
    phoneCode!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Trip, (trip) => trip.province)
    trips!: Trip[];

    @OneToMany("TripTemplate", (template: TripTemplate) => template.province)
    tripTemplates!: TripTemplate[];
}
