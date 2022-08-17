import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { handleError } from 'src/utils/handle-error.util';
import { changePassDto } from './dto/change-pass.dto';

@Injectable()
export class UsersService {
  private userSelect = {
    id: true,
    name: true,
    email: true,
    password: false,
    role: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const data: User = {
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    };
    return await this.prisma.user
      .create({
        data,
        select: this.userSelect,
      })
      .catch(handleError);
  }

  async findAll() {
    return await this.prisma.user.findMany({ select: this.userSelect });
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: this.userSelect,
    });
  }

  async update(id: string, dto: UpdateUserDto,  user: User) {
    const data: Partial<User> = { ...dto };
    return await this.prisma.user
      .update({
        where: { id },
        data,
        select: this.userSelect,
      })
      .catch(handleError);
  }

  async remove(id: string,  user: User) {
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User successfully deleted' };
  }

  async changePass(changePassDto: changePassDto, user: User) {
    const userDB = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!userDB) {
      throw new UnauthorizedException('Invalid password');
    }

    const isHashValid = await bcrypt.compare(
      changePassDto.oldPassword,
      userDB.password,
    );

    if (!isHashValid) {
      throw new UnauthorizedException('Invalid password');
    }

    if (changePassDto.password != changePassDto.confirmPassword) {
      throw new BadRequestException('Passwords are not the same');
    }

    userDB.password = await  bcrypt.hash(changePassDto.password, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: userDB,
    })

    return { message: 'Password changed successfully' };
  }
}
