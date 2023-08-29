import { PrismaService } from "../../src/prisma/prisma.service";

export class E2EUtils {
    async cleanDb (prisma:PrismaService){
        await prisma.media.deleteMany()
    await prisma.post.deleteMany()
    await prisma.publication.deleteMany()
    }
}