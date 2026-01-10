import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import type { Trip } from "./Trip";
import type { User } from "./User";

@Entity({ name: "TripMember", schema: "public" })
@Index(["invitedEmail", "tripId"])
@Index(["userId", "tripId"], { unique: true })
export class TripMember {
    @PrimaryColumn({ type: "uuid" })
    id!: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    joinedAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ type: "uuid", nullable: true })
    userId?: string | null;

    @Column({ type: "uuid" })
    tripId!: string;

    @Column({ type: "varchar", unique: true, nullable: true })
    inviteToken?: string | null;

    @Column({ type: "timestamp", nullable: true })
    invitedAt?: Date | null;

    @Column({ type: "uuid", nullable: true })
    invitedById?: string | null;

    @Column({ type: "varchar", default: "accepted" })
    status!: string;

    @Column({ type: "varchar", nullable: true })
    invitedEmail?: string | null;

    @ManyToOne("Trip", (trip: Trip) => trip.members, { onDelete: "CASCADE" })
    @JoinColumn({ name: "tripId" })
    trip!: Trip;

    @ManyToOne("User", (user: User) => user.tripMembers, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user?: User | null;
}
