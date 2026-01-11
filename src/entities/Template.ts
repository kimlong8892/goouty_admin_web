import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";

@Entity({ name: "Template", schema: "public" })
export class Template extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "text", unique: true })
    code!: string;

    @Column({ type: "text", nullable: true })
    title?: string | null;

    @Column({ type: "text", nullable: true })
    message?: string | null;

    @Column({ type: "text", nullable: true })
    emailSubject?: string | null;

    @Column({ type: "text", nullable: true })
    emailBody?: string | null;

    @Column({ type: "text", nullable: true })
    icon?: string | null;

    @Column({ type: "text", nullable: true })
    color?: string | null;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;
}
