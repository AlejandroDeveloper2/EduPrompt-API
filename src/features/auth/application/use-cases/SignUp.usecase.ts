import { hash } from "bcryptjs";

import { ITransactionManager } from "@/core/domain/ports/ITransactionManager.interface";

import { AuthRepositoryType } from "../../domain/repositories/AuthRepository.interface";
import { IEmailSender } from "../../domain/ports/IEmailSender.interface";
import { VerificationCodeGeneratorService } from "../../domain/services";

import { RegisterInput } from "../dto/signup.dto";
import { SendAccountActivationEmailService } from "../services";

import { UsersFeature } from "@/features/users";
import { IndicatorsFeature } from "@/features/indicators";

export class SignUpUseCase {
  private readonly sendAccountActivationEmailService: SendAccountActivationEmailService;

  constructor(
    private readonly codeGenerator: VerificationCodeGeneratorService,
    private readonly authRepository: AuthRepositoryType,
    private readonly emailSender: IEmailSender,
    private readonly transactionManager: ITransactionManager
  ) {
    this.sendAccountActivationEmailService =
      new SendAccountActivationEmailService(
        codeGenerator,
        authRepository,
        emailSender
      );
  }

  /**
   * Registra un nuevo usuario y envía un correo de activación de cuenta.
   *
   * @param registerInput - Datos de registro del usuario.
   * @throws {AppError} - Si ya existe un usuario con el mismo email o username.
   */
  async run(registerInput: RegisterInput): Promise<void> {
    //Validamos que no exista el email o el username en la base de datos
    await UsersFeature.service.validateUserEmailAvailability.run(
      registerInput.email
    );
    await UsersFeature.service.validateUsernameAvailability.run(
      registerInput.userName
    );

    this.transactionManager.execute(async (ctx) => {
      //Encriptamos la contraseña
      const hashedPassword = await hash(registerInput.password, 14);

      // Creamos el usuario
      const userId = await UsersFeature.service.createUser.run(
        {
          ...registerInput,
          password: hashedPassword,
        },
        ctx
      );

      // Creamos e inicializamos los indicadores o estadisticas del usuario
      await IndicatorsFeature.service.createIndicators.run(userId, ctx);

      // Enviamos el correo de activación de cuenta
      await this.sendAccountActivationEmailService.run(
        userId,
        registerInput.email
      );
    });
  }
}
