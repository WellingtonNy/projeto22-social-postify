import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { PostsService } from '../posts/posts.service';
import { MediasService } from '../medias/medias.service';



@Injectable()


export class PublicationsService {

  constructor(

    private readonly puRepository: PublicationsRepository,
    private readonly postService: PostsService,
    private readonly mediaService: MediasService

  ){}


  async create(createPublicationDto: CreatePublicationDto) {

    await this.vPublic(createPublicationDto)
    return this.puRepository.create(createPublicationDto)

  }



  private async vPublic(dto: CreatePublicationDto | UpdatePublicationDto) {
    const { mediaId, postId, date } = dto

    if (mediaId) await this.mediaService.findOne(mediaId)
    if (postId) await this.postService.findOne(postId)
    if (date) this.isPastDate(new Date(date))

  }



  private isPastDate(date: Date) {

    const current = new Date()

    if (date < current) throw new HttpException("Requires time machine :)", HttpStatus.FORBIDDEN)

  }



  async findAll() {

    return await this.puRepository.findAll()

  }



  async findAllPublished(published: boolean) {

    return await this.puRepository.findAllPublished(published)

  }



  async findAllAfter(after: Date) {

    return await this.puRepository.findAllAfter(after)

  }



  async filter(published: boolean, after: Date) {

    return await this.puRepository.filter(published, after)

  }



  async findOne(id: number) {

    const pub = await this.puRepository.findOne(id)

    if (!pub) throw new HttpException(" Publication não encontrada ", HttpStatus.NOT_FOUND)

    return pub

  }



  async update(id: number, updatePublicationDto: UpdatePublicationDto) {
    //ap 05
    await this.vPublic(updatePublicationDto)

    return this.puRepository.update(id, updatePublicationDto)

  }



  async remove(id: number) {
    //ap 06
    await this.findOne(id)

    return await this.puRepository.remove(id)
  }

}
