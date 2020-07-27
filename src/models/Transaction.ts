import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  AfterLoad,
} from 'typeorm';
import Category from './Category';

@Entity('transactions')
class Transaction {
  @AfterLoad()
  public parseValue(): void {
    if (typeof this.value !== 'number') {
      this.value = parseFloat(this.value);
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column()
  value: number;

  // @Column()
  // category_id: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
