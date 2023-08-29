import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class MediasRepository {
  


  constructor(private readonly prisma: PrismaService){ }

  findOneWP(id: number) {
    return this.prisma.media.findUnique({
      where: {id},
      include:{
        publications: true
      }
    })
  }

  create(body: CreateMediaDto) {

    return  this.prisma.media.create({ data: body })

  }



  findAll() {

    return  this.prisma.media.findMany()

  }


  async findByTU(title: string, username: string) {
    return this.prisma.media.findFirst({
      where: {
        title: title,
        username: username,
      },
    });
  }
  


   findUnique(id: number) {

    return  this.prisma.media.findUnique({ where: { id } })

  }



   update(id: number, body: UpdateMediaDto) {

    return  this.prisma.media.update({ where: { id },
      data: body })

  }



  remove(id: number) {

    return  this.prisma.media.delete({ where: { id } })

  }


  
}
