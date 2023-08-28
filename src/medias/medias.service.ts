import { Injectable ,ConflictException ,NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';


@Injectable()
export class MediasService {
  constructor(private readonly mediasRepository: MediasRepository) {}


  //fix me
  async create(body: CreateMediaDto) {

    //fix me
    const eMedia = await this.mediasRepository.create(body)

    if(!eMedia){
      throw new ConflictException()
    }
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
      throw new NotFoundException()
    }
    return eMedia

  }


 //ok
 async update(id: number, body: UpdateMediaDto) {

    const eMedia = await this.mediasRepository.findUnique(id)

    if (!eMedia) {
      throw new NotFoundException()
    }
    return  await this.mediasRepository.update(id,body)

  }


 //ok
  async remove(id: number) {

    const eMedia = await this.mediasRepository.findUnique(id)

    if (!eMedia) {
      throw new NotFoundException()
    }

    return this.mediasRepository.remove(id)
  }

}
