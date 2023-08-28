import { Injectable ,ConflictException ,NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';


@Injectable()
export class MediasService {



  async create(body: CreateMediaDto) {

    const eMedia:any = await this.create(body)

    if(eMedia){
      throw new ConflictException()
    }
    return await this.create(body)

  }



  async findAll() {

    return await this.findAll()

  }



  async findOne(id: number) {

    const eMedia = await this.findOne(id)

    if (!eMedia) {
      throw new NotFoundException()
    }
    return eMedia

  }



 async update(id: number, body: UpdateMediaDto) {

    const eMedia = await this.findOne(id)

    if (!eMedia) {
      throw new NotFoundException()
    }
    return  await this.update(id,body)

  }



  async remove(id: number) {

    const eMedia = await this.findOne(id)

    if (!eMedia) {
      throw new NotFoundException()
    }

    return this.remove(id)
  }

}
