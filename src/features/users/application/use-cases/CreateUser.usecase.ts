import { TransactionContext } from "@/core/domain/ports/TransactionContext.interface";
import { CreateUser } from "../../domain/types";
import { UserRepositoryType } from "../../domain/repositories/UserRepository.interface";

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryType) {}
  /**
   * Crea un nuevo usuario en el repositorio.
   *
   * @param user - Los datos para el nuevo usuario que se va a crear.
   * @param ctx -  TransactionContext opcional para ejecutar la creación dentro de una transacción.
   * @returns Una promesa que resuelve con el identificador único del usuario recién creado.
   */
  async run(user: CreateUser, ctx?: TransactionContext): Promise<string> {
    const { userId } = await this.userRepository.create(user, ctx);
    return userId;
  }
}
