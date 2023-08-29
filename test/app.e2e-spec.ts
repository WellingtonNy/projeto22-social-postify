import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { E2EUtils } from './utils/e2e-utils';
import { CreateMediaDto } from '../src/medias/dto/create-media.dto';
import { MediaFactory } from './factories/media.factory';
import { UpdateMediaDto } from '../src/medias/dto/update-media.dto';
import { CreatePostDto } from '../src/posts/dto/create-post.dto';
import { PostFactory } from './factories/post.factory';
import { UpdatePostDto } from '../src/posts/dto/update-post.dto';
import { PublicationFactory } from './factories/publication.factory';


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

    app = moduleFixture.createNestApplication()
    
    app.useGlobalPipes(new ValidationPipe())
    await app.init();
    
    
   //usar sempre static o outro modo quebra
   await E2EUtils.cleanDb(prisma)

  });


  //boa pratica usar disconnect porem as vezes demora
  afterAll(async ()=>{
    await prisma.$disconnect()
    await app.close()
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


it('POST /posts - post que posta o post', async () => {
  
  const postDto: CreatePostDto = new CreatePostDto({
    title: "titulo do post",
    text: "texto do post!"
  });

  await request(app.getHttpServer())
    .post('/posts')
    .send(postDto)
    .expect(HttpStatus.CREATED)

  const posts = await prisma.post.findMany()
  expect(posts).toHaveLength(1)
  const post = posts[0]

  expect(post).toEqual({
    id: expect.any(Number),
    title: postDto.title,
    text: postDto.text,
    image: null
  })
})



it("POST /posts - post vazio", async () => {
  
  const postDto = new CreatePostDto()

  await request(app.getHttpServer())
    .post('/posts')
    .send(postDto)
    .expect(HttpStatus.BAD_REQUEST)

})




it("GET /posts - todos os posts", async () => {
    
    await new PostFactory(prisma)
      .withTitle("Post1")
      .withText("text Post1")
      .persist()

    await new PostFactory(prisma)
      .withTitle("Post2")
      .withText("text Post2")
      .persist()

    const { status, body } = await request(app.getHttpServer()).get("/posts")
    expect(status).toBe(HttpStatus.OK)
    expect(body).toHaveLength(2)
  })

 
  it('PUT /posts - Put do Post', async () => {
    

    const post = await new PostFactory(prisma)
      .withTitle("Fun Post")
      .withText("This post is fun!")
      .persist()

    
    const updatePostDto = new UpdatePostDto({
      title: "Awesome Post",
      text: "This post is awesome!",
      image: "https://fun.com?image=2",
    })


    await request(app.getHttpServer())
      .put(`/posts/${post.id}`)
      .send(updatePostDto)
      .expect(HttpStatus.OK)


    const posts = await prisma.post.findMany()
    expect(posts).toHaveLength(1)
    expect(posts[0]).toEqual({
      id: expect.any(Number),
      title: updatePostDto.title,
      text: updatePostDto.text,
      image: updatePostDto.image
    })

  })



  it('DELETE /posts - delete do post', async () => {
    
    const post = await new PostFactory(prisma)
      .withTitle("Post")
      .withText("esse é o Post")
      .persist()

    await request(app.getHttpServer())
      .delete(`/posts/${post.id}`)
      .expect(HttpStatus.OK)

    const posts = await prisma.post.findMany()
    expect(posts).toHaveLength(0)

  })


  it('DELETE /posts - não deleta se tiver publicação', async () => {
   

    const media = await new MediaFactory(prisma)
      .withTitle("X")
      .withUsername("Not.not")
      .persist()


    const post = await new PostFactory(prisma)
      .withTitle("Post")
      .withText("Esse é o post")
      .persist()


    await new PublicationFactory(prisma)
      .withMediaId(media.id)
      .withPostId(post.id)
      .withDate(new Date())
      .persist()

    await request(app.getHttpServer())
      .delete(`/posts/${post.id}`)
      .expect(HttpStatus.FORBIDDEN)

  })


});




