import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';


@Injectable()

export class PostsService {

constructor(private readonly PRepository: PostsRepository) {}



  async create(body: CreatePostDto) {

    return this.PRepository.create(body)

  }



  async findAll() {

    return this.PRepository.findAll()

  }



  async findOne(id: number) {

    const ePost = await this.PRepository.findOne(id)
    if (!ePost) throw new HttpException(`Post não encontrado`, HttpStatus.NOT_FOUND)

    return ePost

  }



  async update(id: number, body: UpdatePostDto) {

    await this.findOne(id)

    return this.PRepository.update(id, body)

  }



  async remove(id: number) {

    const ePost = await this.PRepository.findOneWithPublications(id)

    if (!ePost) throw new HttpException(`Post not found`, HttpStatus.NOT_FOUND)

    if (ePost.publications.length > 0) throw new HttpException(`Post em uso`, HttpStatus.FORBIDDEN)

    return this.PRepository.remove(id)

  }

}
