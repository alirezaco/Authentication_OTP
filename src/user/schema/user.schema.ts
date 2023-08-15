import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseWithoutCreatorSchema } from '@/src/shared/schemas/base-without-creator.schema';
import { RoleEnum } from '@/src/auth/enums/role.enum';

export type UserDoc = User & Document;

export class Cart {
  educations: Array<any> = [];
  events: Array<any> = [];
}

export class PurchasedProduct {
  product: Types.ObjectId;
  buyTime: number;
}

@Schema({
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
})
export class User extends BaseWithoutCreatorSchema {
  @Prop({
    type: String,
    maxlength: 20,
    minlength: 3,
    trim: true,
  })
  firstname?: string;

  @Prop({
    type: String,
    maxlength: 20,
    minlength: 3,
    trim: true,
  })
  lastname?: string;

  @Prop({
    type: String,
    maxlength: 20,
    minlength: 8,
    trim: true,
    unique: true,
    required: true,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    trim: true,
    unique: true,
    required: true,
  })
  cellNumber: string;

  @Prop({
    type: String,
    trim: true,
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isBanned: boolean;

  @Prop({
    type: String,
    enum: RoleEnum,
    default: RoleEnum.USER,
  })
  role: RoleEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function (this: UserDoc) {
  return this._id;
});

UserSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updateAt: Date.now() });
  next();
});

UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});
