import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => User, user => user.posts)
  author: User;

  @Column({
    type: 'numeric',
    precision: 8,
    scale: 3,
  })
  aspectRatio: number;

  @Column({
    type: 'character varying',
    length: 1024,
    nullable: true,
  })
  content: string;

  @Column({
    type: 'character varying',
    length: 1024,
  })
  image: string;

  @Column({
    type: 'character varying',
    length: 1024,
    nullable: true,
  })
  imageSmall: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
