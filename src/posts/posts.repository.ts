import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma/prisma.service';



@Injectable()

export class PostsRepository {

  constructor(private readonly prisma: PrismaService) {}



  create(body: CreatePostDto) {

    return this.prisma.post.create({

      data: body

    })

  }



  findAll() {

    return this.prisma.post.findMany()

  }




  findOne(id: number) {

    return this.prisma.post.findUnique({

      where: { id }

    })

  }



  findOneWithPublications(id: number) {

    return this.prisma.post.findUnique({

      where: { id },
      include: {
        publications: true

      }

    })

  }



  update(id: number, body: UpdatePostDto) {

    return this.prisma.post.update({

      where: { id },
      data: body
      
    })

  }



  remove(id: number) {

    return this.prisma.post.delete({

      where: { id }

    })

  }
}