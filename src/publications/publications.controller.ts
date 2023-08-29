import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseBoolPipe, Put } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { ParseDatePipe } from './pipes/dates.pipes';



@Controller('publications')

export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) { }



  @Post()
  create(@Body() body: CreatePublicationDto) {

    return this.publicationsService.create(body)

  }



  @Get()
  findAll(
    @Query("published", new ParseBoolPipe({ optional:true })) published:boolean,
    @Query("after", new ParseDatePipe()) after: Date) {

    if (published !== undefined && !after) return this.publicationsService.findAllPublished(published)

    if (published === undefined && after) return this.publicationsService.findAllAfter(after)

    if (published !== undefined && after) return this.publicationsService.filter(published, after)

    return this.publicationsService.findAll()

  }



  @Get(':id')
  findOne(@Param('id') id: string) {

    return this.publicationsService.findOne(+id)

  }



  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdatePublicationDto) {

    return this.publicationsService.update(+id, body)

  }



  @Delete(':id')
  remove(@Param('id') id: string) {

    return this.publicationsService.remove(+id)

  }

}
