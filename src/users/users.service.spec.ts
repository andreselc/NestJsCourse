import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;
  const mockRepository = () => {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          //el getRepositoryToken te ayuda una imitación del repositorio para no lidiar directamente con la base de datos y evitar problemas con el UsersService en las pruebas unitarias. Esto retorna un token basado en una entidad dada.
          provide: getRepositoryToken(User),
          useFactory: mockRepository, 
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
