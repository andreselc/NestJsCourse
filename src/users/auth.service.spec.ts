import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";

//Nos da una refencia de cuál prueba está corriendo
describe ("AuthServe", () =>{
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () =>{
    //Create a fake copy of the users service
    const users: User[]= [];
     fakeUsersService ={
      //Find y create son los únicos métodos dentro de AuthService
      //Métodos asíncronos por naturaleza, toman tiempo para buscar en la bases de datos, guardar (cuand creas)...
      //por esose retorna una promesa en find y create.
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email ===email);
        return Promise.resolve(filteredUsers);
      },
      create: (email:string, password:string) => {
        const user= { id:Math.floor(Math.random() * 999999), email, password} as User;
        users.push(user);
        return Promise.resolve(user);
      }
    };
    
    const module = await Test.createTestingModule({
      providers:[
        AuthService,
      {
        provide: UsersService, //Si alguien solicita esto
        useValue: fakeUsersService, ///... se les da esto
      },
    ],
    }).compile();
  
    //Esto hará que nuestro contenedor DI cree una instancia 
    //...de AuthService con todas sus dependencias inicializadas y funciones.
     service = module.get(AuthService);
  });
  
  //Prueba unitaria de AuthService
  it("can create an instance of auth service", async() => {
    expect(service).toBeDefined();
  });

  it("creates a new user with a salted and hashed password", async() => {
    const user = await service.signup("asdf@asdf.com","asdf");

    //Verificar que nuestra contraseña realmente hizo un salt y se encriptó
    expect(user.password).not.toEqual("asdf");
    const [salt, hash] = user.password.split(".");
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

   it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('laskdjf@alskdfj.com', 'password');
    await expect(
      service.signin('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException);
  });

  it ("returns a user if correct password is provided", async()=>{
      await service.signup("pablo@gmail.com", "12345");
      const user = await service.signin("pablo@gmail.com", "12345");
      expect(user).toBeDefined();
  });
});


