import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { E2EUtils } from './utils/e2e-utils';
import { CreateMediaDto } from '../src/medias/dto/create-media.dto';
import { MediaFactory } from './factories/media.factory';
import { UpdateMediaDto } from '../src/medias/dto/update-media.dto';


describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService()

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(PrismaService)
    .useValue(prisma)
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe())
    await app.init();
    
    

    new E2EUtils().cleanDb(prisma)
  });


  //boa pratica usar disconnect porem as vezes demora
  afterAll(async ()=>{
    await prisma.$disconnect()
  })



  it('GET /health => return 200', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(HttpStatus.OK)
      .expect("I'm Okay!")
  })



it('POST /medias - criar media', async () => {
  
  const mediaDto: CreateMediaDto = new CreateMediaDto({

    title: "Face",
    username: "not@not.com"

  })

  await request(app.getHttpServer())
    .post('/medias')
    .send(mediaDto)
    .expect(HttpStatus.CREATED)

  const medias = await prisma.media.findMany()
  expect(medias).toHaveLength(1)

  const media = medias[0]

  expect(media).toEqual({

    id: expect.any(Number),
    title: mediaDto.title,
    username: mediaDto.username

  })
})



it("POST /medias - propiedades faltando", async () => {
  
  const mediaDto = new CreateMediaDto()

  await request(app.getHttpServer())
    .post('/medias')
    .send(mediaDto)
    .expect(HttpStatus.BAD_REQUEST)

})



it("GET /medias todas as medias", async () => {
  
  await new MediaFactory(prisma)
    .withTitle("Face")
    .withUsername("not@not.com")
    .persist()

  await new MediaFactory(prisma)
    .withTitle("X")
    .withUsername("notX@not.com")
    .persist()

  const { status, body } = await request(app.getHttpServer()).get("/medias")
  expect(status).toBe(HttpStatus.OK)
  expect(body).toHaveLength(2)
})


it('PUT /medias - update', async () => {
  
  const facebook = await new MediaFactory(prisma)
    .withTitle("Face")
    .withUsername("not@not.com")
    .persist()

  
  const mediaDto: CreateMediaDto = new CreateMediaDto();
  mediaDto.title = "FaceB";
  mediaDto.username = "notx@notx.com.br"

  await request(app.getHttpServer())
    .put(`/medias/${facebook.id}`)
    .send(mediaDto)
    .expect(HttpStatus.OK)

  const medias = await prisma.media.findMany()

  expect(medias).toHaveLength(1)

  const media = medias[0]
  
  expect(media).toEqual({
    id: expect.any(Number),
    title: mediaDto.title,
    username: mediaDto.username
  })

})



it('PUT /medias - att o que não existe', async () => {
  
  const mediaDto: UpdateMediaDto = new UpdateMediaDto({

    title: "Face",
    username: "not@not.com"

  })

  await request(app.getHttpServer())
    .put(`/medias/777`)
    .send(mediaDto)
    .expect(HttpStatus.NOT_FOUND)

})


it('delete /medias - deletar', async () => {

  //cria
  const media = await new MediaFactory(prisma)
    .withTitle("Face")
    .withUsername("not@not.com")
    .persist()

    //deleta o que criou
  await request(app.getHttpServer())
    .delete(`/medias/${media.id}`)
    .expect(HttpStatus.OK)
 
    //conferir se sumiu
  const medias = await prisma.media.findMany()
  expect(medias).toHaveLength(0)

})


it('delete /medias - deletar o que n existe', async () => {

  await request(app.getHttpServer())
    .delete(`/medias/777`)
    .expect(HttpStatus.NOT_FOUND)

})


});




