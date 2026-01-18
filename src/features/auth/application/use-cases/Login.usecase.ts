import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { addMinutes } from "date-fns";

import { config } from "@/config/enviromentVariables";
import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { AuthRepositoryType } from "../../domain/repositories/AuthRepository.interface";
import { RefreshTokenGeneratorService } from "../../domain/services";

import { LoginInput } from "../dto/login.dto";

import { UsersFeature } from "@/features/users";

export class LoginUseCase {
  constructor(
    private readonly refreshTokenGenerator: RefreshTokenGeneratorService,
    private readonly authRepository: AuthRepositoryType
  ) {}

  /**
   * Inicia sesión de usuario con credenciales de acceso.
   *
   * @param loginInput - Credenciales de inicio de sesión (email y contraseña).
   * @returns Un objeto con el token JWT y refresh Token generados.
   * @throws {AppError} - Si el usuario no existe, la contraseña es incorrecta,
   *                      la cuenta está inactiva o ya hay una sesión activa.
   */
  async run(
    loginInput: LoginInput
  ): Promise<{ token: string; refreshToken: string }> {
    // Consultamos el usuario por email
    const userByEmail = await UsersFeature.service.findUserByEmail.run(
      loginInput.email
    );

    if (userByEmail.accountStatus === "inactive")
      throw new AppError(
        ErrorMessages.INACTIVE_ACCOUNT,
        403,
        "User account is inactive",
        true
      );

    // Comparamos la contraseña de acceso
    const isCorrectPassword: boolean = await compare(
      loginInput.password,
      userByEmail.password
    );
    if (!isCorrectPassword)
      throw new AppError(
        ErrorMessages.INCORRECT_PASSWORD,
        401,
        "User password is incorrect",
        true
      );

    // Si todo va bien generamos el token de sesión firmado
    const token: string = sign(
      { userId: userByEmail.userId },
      config.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    // Generamos el refreshToken
    const refreshToken = this.refreshTokenGenerator.generate();
    const hashedRefreshToken = this.refreshTokenGenerator.hash(refreshToken);

    //Validamos si existe la sesión activa con el mismo token
    const session = await this.authRepository.findSessionByToken(token);

    if (session)
      throw new AppError(
        ErrorMessages.SESSION_ALREADY_ACTIVE,
        401,
        "Session already exists with that session token",
        true
      );

    /** Añadimos la fecha de expiración del token */
    const currentDate = new Date();
    const expiresAt = addMinutes(currentDate, 15);

    //Creamos la sesión a nivel de base de datos si esta no existe
    await this.authRepository.createSession({
      sessionToken: token,
      refreshToken: hashedRefreshToken,
      active: true,
      expiresAt,
    });

    return { token, refreshToken };
  }
}
