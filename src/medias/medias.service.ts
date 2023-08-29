import { Injectable ,ConflictException ,NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';


@Injectable()
export class MediasService {
  constructor(private readonly mRepository: MediasRepository) {}


  //ok
  async create(body: CreateMediaDto) {
const {title,username} = body
const eMedia = await this.mRepository.findByTU(title,username)

    if(eMedia) throw new HttpException('Media já existe',HttpStatus.CONFLICT)

    return await this.mRepository.create(body)  
  }


  //ok
  async findAll() {

    return await this.mRepository.findAll()

  }


  //ok
  async findOne(id: number) {

    const eMedia = await this.mRepository.findUnique(id)

    if (!eMedia) {
      throw new HttpException( 'Media not found',HttpStatus.NOT_FOUND )
    }
    return eMedia
  }


 //ok
 async update(id: number, body: UpdateMediaDto) {

     await this.findOne(id)

    const {title,username} =body
    const eMedia = await this.mRepository.findByTU(title,username)

    if(eMedia) throw new HttpException('Media já existe',HttpStatus.CONFLICT)

    return  await this.mRepository.update(id,body)

  }


 //ok
  async remove(id: number) {

    const eMedia = await this.mRepository.findOneWP(id)

    if (!eMedia) throw new HttpException("Media not found", HttpStatus.NOT_FOUND)

    if (eMedia.publications.length > 0) throw new HttpException("Media em uso", HttpStatus.FORBIDDEN)

    return await this.mRepository.remove(id)
  }
}

