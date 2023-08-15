export class BaseResponseWithoutCreator {
  public id: string;

  public createAt: number;

  public updateAt: number;

  public isDeleted: boolean;

  constructor(initial?: Partial<BaseResponseWithoutCreator & { _id: string }>) {
    this.id = initial.id || initial._id;
    this.createAt = initial.createAt;
    this.isDeleted = initial.isDeleted;
    this.updateAt = initial.updateAt;
  }
}
