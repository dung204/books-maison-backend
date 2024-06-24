import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { Book } from '@/modules/book/entities/book.entity';
import { User } from '@/modules/user/entities/user.entity';

@Entity({ schema: 'public', name: 'favourite_books' })
export class FavouriteBook {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  bookId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Book)
  @JoinColumn({ name: 'book_id' })
  book: Book;
}
