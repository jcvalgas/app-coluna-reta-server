import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { domainToASCII } from 'url';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStudentDto) {
    const data: Prisma.StudentCreateInput = {
      name: dto.name,
      birthDate: dto.birthDate,
      phoneStudent: dto.phoneStudent,
      photo: dto.photo,
      description: dto.description,
      user: {
        connect: {
          id: dto.userId,
        },
      },
      institute: {
        connect: {
          id: dto.instituteId,
        },
      },
    };
    return await this.prisma.student.create({
      data,
      select: {
        id: true,
        user: {
          select: {
            name: true,
          },
        },
        institute: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.student.findMany({
      select: {
        id: true,
        user: {
          select: {
            name: true,
          },
        },
        institute: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        institute: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateStudentDto) {
    const data: Prisma.StudentUpdateInput = {
      name: dto.name,
      birthDate: dto.birthDate,
      phoneStudent: dto.phoneStudent,
      photo: dto.photo,
      description: dto.description,
      user: {
        connect: {
          id: dto.userId,
        },
      },
      institute: {
        connect: {
          id: dto.instituteId,
        },
      },
    };
    return await this.prisma.student.update({
      where: { id },
      data,
      select: {
        user: {
          select: {
            name: true,
          },
        },
        institute: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.prisma.student.delete({ where: { id } });
    return { message: 'Student successfully deleted' };
  }
}