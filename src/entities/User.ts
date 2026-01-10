import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import type { Trip } from "./Trip";
import type { Expense } from "./Expense";
import type { TripMember } from "./TripMember";

@Entity({ name: "User", schema: "public" })
export class User {
    @PrimaryColumn({ type: "uuid" })
    id!: string;

    @Column({ type: "varchar", unique: true })
    email!: string;

    @Column({ type: "varchar", nullable: true })
    password?: string | null;

    @Column({ type: "varchar", nullable: true })
    fullName?: string | null;

    @Column({ type: "varchar", nullable: true })
    phoneNumber?: string | null;

    @Column({ type: "varchar", nullable: true })
    profilePicture?: string | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ type: "varchar", nullable: true })
    bankId?: string | null;

    @Column({ type: "varchar", nullable: true })
    bankNumber?: string | null;

    @Column({ type: "boolean", default: true })
    notificationsEnabled!: boolean;

    @Column({ type: "timestamp", nullable: true })
    resetPasswordExpires?: Date | null;

    @Column({ type: "varchar", nullable: true })
    resetPasswordToken?: string | null;

    @OneToMany("Trip", (trip: Trip) => trip.user)
    trips!: Trip[];

    @OneToMany("TripMember", (member: TripMember) => member.user)
    tripMembers!: TripMember[];

    @OneToMany("Expense", (expense: Expense) => expense.payer)
    paidExpenses!: Expense[];
}
