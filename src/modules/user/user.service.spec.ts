import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'nestjs-prisma';

describe('UserService', () => {
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    userService = module.get<UserService>(UserService);

    console.log('💫 seed executing ...');

    await userService.prismaService.user.create({
      data: {
        name: 'john',
        email: 'john@gmail.com',
        posts: {
          create: {
            title: 'first article',
            content: 'hello!world!',
            published: true,
          },
        },
      },
    });

    console.log('💫 seed finished.');
  });

  it('findOneWithPost', async () => {
    const expectedResult = {
      id: expect.any(Number),
      name: 'john',
      email: 'john@gmail.com',
      posts: [
        {
          authorId: expect.any(Number),
          id: expect.any(Number),
          title: 'first article',
          content: 'hello!world!',
          published: true,
        },
      ],
    };

    const actualResult = await userService.findOneWithPost(
      expectedResult.email,
    );

    expect(expectedResult).toEqual(actualResult);
  });

  afterAll(async () => {
    await userService.prismaService.user.deleteMany();
    await userService.prismaService.$disconnect();
  });
});
