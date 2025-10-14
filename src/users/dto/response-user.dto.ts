import { Exclude } from 'class-transformer';

export class ResponseUserDto {
  id: number;
  email: string;
  role: string;
  rank: string;

  @Exclude() password: string;
  @Exclude() createdAt: Date;
  @Exclude() updatedAt: Date;

  // If you have relations to other entities, you can include them as well
  // @Type(() => PostEntity)
  // @Expose()
  // posts: PostEntity[];

  constructor(partial: Partial<ResponseUserDto>) {
    Object.assign(this, partial);
  }
}
