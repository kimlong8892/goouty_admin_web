import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import type { Trip } from "./Trip";

@Entity({ name: "Province", schema: "public" })
export class Province {
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

    @OneToMany("Trip", (trip: Trip) => trip.province)
    trips!: Trip[];
}
