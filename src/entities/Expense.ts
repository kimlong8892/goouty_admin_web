import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import type { Trip } from "./Trip";
import type { User } from "./User";

@Entity({ name: "Expense", schema: "public" })
export class Expense extends BaseEntity {
    @PrimaryColumn({ type: "uuid" })
    id!: string;

    @Column({ type: "varchar" })
    title!: string;

    @Column({ type: "decimal", precision: 20, scale: 2 })
    amount!: number;

    @Column({ type: "timestamp" })
    date!: Date;

    @Column({ type: "text", nullable: true })
    description?: string | null;

    @Column({ type: "boolean", default: false })
    isLocked!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ type: "uuid" })
    tripId!: string;

    @Column({ type: "uuid" })
    payerId!: string;

    @ManyToOne("Trip", (trip: Trip) => trip.expenses, { onDelete: "CASCADE" })
    @JoinColumn({ name: "tripId" })
    trip!: Trip;

    @ManyToOne("User", (user: User) => user.paidExpenses, { onDelete: "CASCADE" })
    @JoinColumn({ name: "payerId" })
    payer!: User;
}
