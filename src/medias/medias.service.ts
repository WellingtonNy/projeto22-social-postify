import { Injectable ,ConflictException ,NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';


@Injectable()
export class MediasService {
  constructor(private readonly mediasRepository: MediasRepository) {}


  //ok
  async create(body: CreateMediaDto) {
const {title,username} = body
const eMedia = await this.mediasRepository.findByTU(title,username)

    if(eMedia) throw new HttpException('Media já existe',HttpStatus.CONFLICT)

    return await this.mediasRepository.create(body)  
  }


  //ok
  async findAll() {

    return await this.mediasRepository.findAll()

  }


  //ok
  async findOne(id: number) {

    const eMedia = await this.mediasRepository.findUnique(id)

    if (!eMedia) {
      throw new HttpException( 'Media not found',HttpStatus.NOT_FOUND )
    }
    return eMedia
  }


 //ok
 async update(id: number, body: UpdateMediaDto) {

     await this.findOne(id)

    const {title,username} =body
    const eMedia = await this.mediasRepository.findByTU(title,username)

    if(eMedia) throw new HttpException('Media já existe',HttpStatus.CONFLICT)

    return  await this.mediasRepository.update(id,body)

  }


 //ok
  async remove(id: number) {

    const eMedia = await this.mediasRepository.findOneWP(id)

    if (!eMedia) throw new HttpException("Media not found", HttpStatus.NOT_FOUND)

    if (eMedia.publications.length > 0) throw new HttpException("Media em uso", HttpStatus.FORBIDDEN)

    return await this.mediasRepository.remove(id)
  }
}

