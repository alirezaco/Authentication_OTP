import { Prop, Schema } from '@nestjs/mongoose';
import { BaseWithoutCreatorSchema } from './base-without-creator.schema';
import { User } from '@/src/user/schema/user.schema';
import { Types } from 'mongoose';

@Schema()
export class BaseSchema extends BaseWithoutCreatorSchema {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    autopopulate: { maxDepth: 1, select: 'username' },
  })
  creator: User;
}
