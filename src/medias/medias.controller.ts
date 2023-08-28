import { Controller, Get, Post, Body, Patch, Param,ParseIntPipe, Delete, Put } from '@nestjs/common';
import { MediasService } from './medias.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';



@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}


  @Post()
  create(@Body() body: CreateMediaDto) {
    return this.mediasService.create(body);
  }


  @Get()
  findAll() {
    return this.mediasService.findAll();
  }


  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.mediasService.findOne(+id);
  }


  @Put(':id')
  update(@Param('id',new ParseIntPipe()) id: number, @Body() body: UpdateMediaDto) {
    return this.mediasService.update(+id, body);
  }


  @Delete(':id')
  remove(@Param('id',new ParseIntPipe()) id: number) {
    return this.mediasService.remove(+id);
  }
}