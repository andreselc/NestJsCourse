//Decoradores
import { AfterInsert, AfterUpdate, AfterRemove, Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
//Exclude será un decorador que nos ayuda a crear reglas que describe cómo tomar una instancia de Usuario y covertirlo en un objeto plano
//Esto se hace para la encriptación de la contraseña (La excluye de la consulta).
import { Report } from "../reports/report.entity";

@Entity()
export class User {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report) //Esto no establece un cambio en la tabala de Usuarios
  reports: Report[];
  
  //Decoradores Hooks. [Para que se ejecuten, debes crear(instanciar la entidad) y salvar]
  @AfterInsert()
  logInsert(){
    //Se ejecutará este método cuando hagas algo al usuario (Insert, Update, Delete)
    console.log("Inerted User with id ", this.id);
  }

  @AfterUpdate()
  logUpdate(){
    console.log("Update User whit id ", this.id);
  }

  @AfterRemove()
  logRemove(){
    console.log("Remove User whit id ", this.id);
  }
}