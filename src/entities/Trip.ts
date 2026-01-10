import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, BaseEntity } from "typeorm";
import type { User } from "./User";
import type { Province } from "./Province";
import type { Expense } from "./Expense";
import type { TripMember } from "./TripMember";

@Entity({ name: "Trip", schema: "public" })
export class Trip extends BaseEntity {
    @PrimaryColumn({ type: "uuid" })
    id!: string;

    @Column({ type: "varchar" })
    title!: string;

    @Column({ type: "timestamp", nullable: true })
    startDate?: Date | null;

    @Column({ type: "text", nullable: true })
    description?: string | null;

    @Column({ type: "varchar", unique: true, nullable: true })
    shareToken?: string | null;

    @Column({ type: "boolean", default: false })
    isPublic!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn({ nullable: true })
    updatedAt?: Date | null;

    @Column({ type: "uuid" })
    userId!: string;

    @Column({ type: "uuid", nullable: true })
    provinceId?: string | null;

    @Column({ type: "varchar", nullable: true })
    avatar?: string | null;

    @ManyToOne("User", (user: User) => user.trips, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user!: User;

    @ManyToOne("Province", (province: Province) => province.trips)
    @JoinColumn({ name: "provinceId" })
    province?: Province | null;

    @OneToMany("Expense", (expense: Expense) => expense.trip)
    expenses!: Expense[];

    @OneToMany("TripMember", (member: TripMember) => member.trip)
    members!: TripMember[];
}
