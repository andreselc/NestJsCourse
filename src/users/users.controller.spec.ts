import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  //Recuerda que Partial te permite implementar solo unas partes de UsersService, no tienes que implementar todo
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = { //Tienes que proveer los métodos que usas de UsersServices dentro del controlador de usuario
      findOne: (id :number) =>{
        return Promise.resolve ({id, email: "beatriz@gmail.com", password: "12345"} as User)
      },
      find: (email: string) =>{
        return Promise.resolve([{id:8, email, password:"12345"} as User])
      },
      /*remove: () =>{},
      update: () =>{},*/
    };
    fakeAuthService = { //Tienes que proveer los métodos que usas de AuthServices dentro del controlador de usuario
      //Si no quieres testear alguno de estos dos métodos, no hay problema, no se coloca.
     /* signup: () =>{},*/
      signin: (email: string, password: string) =>{
        return Promise.resolve({ id: 8, email, password} as User)
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("findAllUsers returns a list of users with the given email", async () =>{
    const users= await controller.findAllUsers("beatriz@gmail.com");
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual("beatriz@gmail.com");
  });

  it("findUsers returns a single user with the given id", async () =>{
    const users= await controller.findUser("8");
    expect(users).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('8')).rejects.toThrow(NotFoundException);
  });

  it ("signin updates session object and returns user", async() =>{
    const session = { userId: -10};
    const user = await controller.signin({email: "beatriz@gmail.com", password:"12345"}, 
    session
    );

    expect(user.id).toEqual(8);
    expect(session.userId).toEqual(8);
  });

});

