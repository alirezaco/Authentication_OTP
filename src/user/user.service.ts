import * as bcrypt from 'bcrypt';
import { AuthErrorEnum } from '../auth/enums/auth-message.enum';
import { CreateUserDto } from './dto/request/create-user.dto';
import { FilterUserDto } from './dto/request/filter-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleEnum } from '../auth/enums/role.enum';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { User, UserDoc } from './schema/user.schema';
import { UserMessageEnum } from './enum/message.enum';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDoc>,
  ) {}

  async findOneByUsername(username: string) {
    return this.userModel.findOne({ username });
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findOneByCellNumber(cellNumber: string) {
    return this.userModel.findOne({ cellNumber });
  }

  async checkExistUserForLogin(username: string) {
    const user = await this.userModel.findOne({
      $or: [{ username }, { cellNumber: username }, { email: username }],
      isDeleted: false,
    });

    if (!user) {
      new BadRequestException(AuthErrorEnum.NOT_MATCH);
    }

    return user;
  }

  async checkExistUserByUsername(username: string, userId?: string) {
    const query = { username };
    if (userId) query['_id'] = { $ne: userId };

    const user = await this.userModel.findOne(query);

    if (user) new BadRequestException(UserMessageEnum.EXIST_USERNAME);

    return user;
  }

  async checkExistUserByEmail(email: string, userId?: string) {
    const query = { email };
    if (userId) query['_id'] = { $ne: userId };

    const user = await this.userModel.findOne(query);

    if (user) new BadRequestException(UserMessageEnum.EXIST_EMAIL);

    return user;
  }

  async checkExistUserByCellNumber(cellNumber: string, userId?: string) {
    const query = { cellNumber };
    if (userId) query['_id'] = { $ne: userId };

    const user = await this.userModel.findOne(query);

    if (user) new BadRequestException(UserMessageEnum.EXIST_CELL_NUMBER);

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    //check exist username
    await this.checkExistUserByUsername(createUserDto.username);

    //check exist email
    await this.checkExistUserByEmail(createUserDto.email);

    //check exist cellNumber
    await this.checkExistUserByCellNumber(createUserDto.cellNumber);

    return this.userModel.create(createUserDto);
  }

  async findAll(filterUserDto: FilterUserDto) {
    const { page, limit } = filterUserDto.pagination;

    let sortObject = {};
    filterUserDto.sort.map((item) => {
      sortObject[`${item.field}`] = item.order;
    });

    let data = this.userModel
      .find(filterUserDto.filter)
      .sort(sortObject)
      .skip((page - 1) * limit)
      .limit(limit);

    const numberOfResult = this.userModel.count(filterUserDto.filter);

    const finalResult = await Promise.all([data, numberOfResult]);

    return { data: finalResult[0], count: finalResult[1] };
  }

  async findOne(id: string, isDeleted: boolean = false) {
    const query = { _id: id };
    if (!isDeleted) query['isDeleted'] = false;

    const user = await this.userModel.findOne(query);

    if (!user) new NotFoundException(UserMessageEnum.NOT_FOUND_USER);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    //check exist username
    await this.checkExistUserByUsername(updateUserDto.username, id);

    //check exist email
    await this.checkExistUserByEmail(updateUserDto.email, id);

    //check exist cellNumber
    await this.checkExistUserByCellNumber(updateUserDto.cellNumber, id);

    return this.userModel.findOneAndUpdate({ _id: id }, updateUserDto, {
      new: true,
    });
  }

  async compareUserPassword(hashPassword: string, inputPassword: string) {
    const result = await bcrypt.compare(inputPassword, hashPassword);

    if (!result) new BadRequestException(UserMessageEnum.INVALID_PASSWORD);
  }

  async incryptPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async changePassword(id: string, newPassword: string) {
    const newPasswordHash = await this.incryptPassword(newPassword);

    return this.userModel.findOneAndUpdate(
      { _id: id },
      { password: newPasswordHash },
      {
        new: true,
      },
    );
  }

  async removeSoft(id: string) {
    return this.userModel.findOneAndUpdate(
      { _id: id },
      { isDeleted: true },
      { new: true },
    );
  }

  async removeHard(id: string) {
    return this.userModel.findOneAndDelete({ _id: id });
  }

  async banUser(id: string) {
    return this.userModel.findOneAndUpdate({ _id: id }, { isBanned: true });
  }

  async unBanUser(id: string) {
    return this.userModel.findOneAndUpdate({ _id: id }, { isBanned: false });
  }

  async createUserInCode(
    user: Omit<User, '_id' | 'id' | 'updateAt' | 'createAt'>,
  ) {
    return this.userModel.create(user);
  }

  async setAUserAsAdmin(userId: string) {
    return this.userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { role: RoleEnum.SUPER_ADMIN } },
      { new: true },
    );
  }

  async removeAUserAsAdmin(userId: string) {
    return this.userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { role: RoleEnum.USER } },
      { new: true },
    );
  }
}
