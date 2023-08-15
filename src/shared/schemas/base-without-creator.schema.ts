import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class BaseWithoutCreatorSchema {
  _id: string;

  id: string;

  @Prop({ type: Number, default: Date.now })
  createAt: number;

  @Prop({ type: Number, default: Date.now })
  updateAt: number;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

