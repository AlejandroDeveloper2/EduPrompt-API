import { NextFunction, Request, Response } from "express";

import { RequestExtended } from "@/core/infrastructure/types";
import { DecodedToken } from "@/core/domain/types";

import { LoginInput } from "../../application/dto/login.dto";
import { ResetUserPasswordInput } from "../../application/dto/resetUserPassword.dto";
import { RecoveryPasswordRequestInput } from "../../application/dto/sendRecoveryPassRequest.dto";
import { ValidateResetPassInput } from "../../application/dto/validateResetPassCode.dto";
import { RegisterInput } from "../../application/dto/signup.dto";
import { ResendEmailVerificationCodeInput } from "../../application/dto/resendEmailVerificationCode.dto";
import { ValidateCodeAndUpdateEmailInput } from "../../application/dto/validateCodeAndUpdateEmail.dto";
import { SendEmailChangeRequestInput } from "../../application/dto/sendEmailChangeRequest.dto";
import { ChangeUserPasswordInput } from "../../application/dto/changeUserPassword.dto";
import { ValidateEmailVerificationInput } from "../../application/dto/validateEmailVerificationCode.dto";

import {
  toLoginResponseDto,
  toSendEmailChangeRequestResponseDto,
  toValidateResetPassCodeDto,
} from "../../application/mappers";

import { AuthServiceContainer } from "../containers/AuthService.container";
import { ErrorMessages, handleHttp, handleHttpError } from "@/shared/utils";

const authServiceContainer = new AuthServiceContainer();

/**
 * Controlador del módulo de autenticación.
 *
 * Esta clase expone los endpoints relacionados con el flujo de autenticación y autorización,
 * incluyendo inicio de sesión, registro de usuarios, recuperación y cambio de contraseña,
 * verificación de códigos y cierre de sesión.
 *
 * Cada método recibe la petición HTTP, delega la lógica de negocio al servicio (`AuthService`)
 * y envía la respuesta estandarizada al cliente utilizando el helper `handleHttp`.
 */
class AuthController {
  /**
   * Inicia sesión de un usuario válido.
   *
   * @route POST /auth/login
   * @param req - Request con las credenciales del usuario (`LoginInput`).
   * @param res - Response para enviar el token de sesión y el refresh token en caso de éxito.
   * @param next - NextFunction para el manejo de errores.
   * @returns {Promise<void>} Token JWT en caso de login exitoso.
   */
  async postLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userCredentials = req.body as LoginInput;

      const userToken = await authServiceContainer.login.run(userCredentials);

      /** Creamos una cookie que almacena el refresh token de forma segura */
      // res.cookie("refreshToken", userToken.refreshToken, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production", // solo https en prod
      //   sameSite: "strict", // evita CSRF
      //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      // });

      handleHttp(
        res,
        {
          data: toLoginResponseDto(userToken),
          message: "User logged in successfully",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Registra un nuevo usuario en el sistema.
   *
   * @route POST /auth/signup
   * @param req - Request con los datos de registro (`RegisterInput`).
   * @param res - Response para confirmar la creación de la cuenta.
   * @param next - NextFunction para el manejo de errores.
   * @returns {Promise<void>} Confirmación de registro exitoso.
   */
  async postSignup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userInfo = req.body as RegisterInput;

      await authServiceContainer.signUp.run(userInfo);

      handleHttp(
        res,
        {
          data: null,
          message: "User account created successfully",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * Solicita el envío de un correo con el código de recuperación de contraseña.
   *
   * @route POST /auth/reset-password/request
   * @param req - Request con el email del usuario (`RecoveryPasswordRequestInput`).
   * @param res - Response de confirmación de envío de solicitud.
   * @param next - NextFunction para el manejo de errores.
   * @returns {Promise<void>} Confirmación de solicitud enviada.
   */
  async postResetPassRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body as RecoveryPasswordRequestInput;

      await authServiceContainer.sendRecoveryPassRequest.run({ email });

      handleHttp(
        res,
        {
          data: null,
          message: "Request sent successfully",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * Valida un código de verificación de email.
   *
   * @route POST /auth/verify-email
   * @param req - Request con el código de verificación (`ValidateEmailVerificationInput`).
   * @param res - Response de validación.
   * @param next - NextFunction para el manejo de errores.
   * @returns {Promise<void>} Confirmación de código válido y activación de cuenta.
   */
  async postEmailVerificationCode(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { code } = req.body as ValidateEmailVerificationInput;

      await authServiceContainer.validateEmailVerificationCode.run({ code });

      handleHttp(
        res,
        {
          data: null,
          message: "The Code is valid",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * Valida un código de recuperación de contraseña.
   *
   * @route POST /auth/reset-password/validate
   * @param req - Request con el código de verificación (`ValidateResetPassInput`).
   * @param res - Response con el `userId` asociado si el código es válido.
   * @param next - NextFunction para el manejo de errores.
   * @returns {Promise<void>} Respuesta con `userId` en caso de éxito.
   */
  async postResetPassCode(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { code } = req.body as ValidateResetPassInput;

      const resetPayload = await authServiceContainer.validateResetPassCode.run(
        { code }
      );

      handleHttp(
        res,
        {
          data: toValidateResetPassCodeDto(resetPayload),
          message: "The Code is valid",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * Reenvía un nuevo código de verificación de cuenta al correo del usuario.
   *
   * @route POST /auth/resend-email-code
   * @param req - Request con el email del usuario (`ResendEmailVerificationCodeInput`).
   * @param res - Response con mensaje de confirmación si el reenvío fue exitoso.
   * @param next - NextFunction para el manejo de errores.
   * @returns {Promise<void>} Respuesta con mensaje `"A new code has been sent"` en caso de éxito.
   */
  async postNewEmailVerificationCode(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body as ResendEmailVerificationCodeInput;

      await authServiceContainer.resendEmailVerificationCode.run({ email });

      handleHttp(
        res,
        {
          data: null,
          message: "A new code has been sent",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * Restablece la contraseña de un usuario a partir de su `userId` y nueva contraseña.
   *
   * @route PATCH /auth/reset-password/:userId
   * @param req - Request con `newPassword` (`ResetUserPasswordInput`) y `userId` en los params.
   * @param res - Response de confirmación de cambio de contraseña.
   * @param next - NextFunction para el manejo de errores.
   * @returns {Promise<void>} Confirmación de reseteo de contraseña exitoso.
   */
  async patchUserPasswordReset(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { newPassword } = req.body as ResetUserPasswordInput;
      const { userId } = req.params;

      await authServiceContainer.resetUserPassword.run(userId as string, {
        newPassword,
      });

      handleHttp(
        res,
        {
          data: null,
          message: "Password reseted successfully",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  //Endpoints protegidos
  /**
   * Cambia la contraseña de un usuario autenticado.
   *
   * @route PATCH /auth/change-password
   * @protected
   * @param req - Request extendido (`RequestExtended`) con `userId` extraído del token.
   * @param res - Response de confirmación de cambio de contraseña.
   * @param next - NextFunction para el manejo de errores.
   * @returns {Promise<void>} Confirmación de cambio exitoso.
   */
  async patchUserPassword(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const passwordPayload = req.body as ChangeUserPasswordInput;
      const userPayload = req.user as DecodedToken;

      await authServiceContainer.changeUserPassword.run(
        userPayload.userId,
        passwordPayload
      );

      handleHttp(
        res,
        {
          data: null,
          message: "Password reseted successfully",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * Cierra la sesión de un usuario, invalidando el token en la base de datos.
   *
   * @route POST /auth/logout
   * @param req - Request  con el `sessionToken` a invalidar.
   * @param res - Response de confirmación de logout.
   * @param next - NextFunction para el manejo de errores.
   * @returns {Promise<void>} Confirmación de cierre de sesión exitoso.
   */
  async postLogout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const tokenByUser: string | null = req.headers.authorization || null;

      if (!tokenByUser)
        return handleHttpError(res, {
          name: ErrorMessages.REQUIRED_TOKEN,
          httpCode: 401,
          isOperational: true,
          description: "Session token is required",
        });

      const sessionToken = tokenByUser.split(" ")[1] as string;

      await authServiceContainer.logout.run(sessionToken);

      // /** Limpiamos la cookie */
      // res.clearCookie("refreshToken", {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production", // solo https en prod
      //   sameSite: "strict",
      // });

      handleHttp(
        res,
        {
          data: null,
          message: "User logged out successfully",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * Refresca la sesión del usuario generando nuevos tokens de autenticación.
   *
   * Extrae el token de refresco del encabezado `x-refresh-token` y el token de sesión
   * del encabezado `Authorization`, luego solicita nuevos tokens al servicio de autenticación.
   *
   * @route POST /auth/refresh
   * @param req - Objeto de solicitud extendida que contiene los encabezados con los tokens
   * @param res - Objeto de respuesta para enviar la respuesta HTTP al cliente
   * @param next - Función middleware para pasar el control al siguiente manejador o al manejador de errores
   * @returns {Promise<void>} Una promesa que se resuelve cuando la sesión se refresca exitosamente
   *
   * @throws {Error} Si ocurre un error durante la extracción de tokens o en la llamada al servicio,
   *                 el error se pasa al siguiente middleware a través de `next(error)`
   *
   * @example
   * // Solicitud HTTP
   * // Headers:
   * //   Authorization: Bearer {sessionToken}
   * //   x-refresh-token: {refreshToken}
   * // Respuesta: { data: { accessToken, refreshToken }, message: "Sesión refrescada exitosamente" }
   */
  async postRefreshSession(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken: string | null =
        (req.headers["x-refresh-token"] as string) || null;

      const tokenByUser: string | null = req.headers.authorization || null;

      const sessionToken = tokenByUser
        ? tokenByUser.split(" ")[1] || null
        : null;

      const newTokens = await authServiceContainer.refreshSession.run(
        refreshToken,
        sessionToken
      );

      handleHttp(
        res,
        {
          data: newTokens,
          message: "Sesión refrescada exitosamente",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Envia la solicitud de cambio de correo eléctronico con un código de verificación para un usuario especifico.
   *
   * @route POST /auth/change-email/request
   * @param req - Request  con el `userId` id del usuario que solicita el cambio y `updatedEmail` a verificar.
   * @param res - Response de confirmación de envio de la solicitud.
   * @param next - NextFunction para el manejo de errores.
   * @returns {Promise<void>} Confirmación del envio de la solicitud exitoso.
   */
  async postEmailChangeRequest(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };
      const { updatedEmail } = req.body as SendEmailChangeRequestInput;

      const result = await authServiceContainer.sendEmailChangeRequest.run(
        userId,
        { updatedEmail }
      );

      handleHttp(
        res,
        {
          data: toSendEmailChangeRequestResponseDto(result),
          message: "Email change request sent successfully",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
  /**
   * Valida el código de verificación enviado y posteriormente si dicho código es valido actualiza el correo eléctronico.
   *
   * @route PATCH /auth/change-email
   * @param req - Request  con el `userId` id del usuario que solicita el cambio, `code` código a verificar y`updatedEmail` nuevo correo.
   * @param res - Response de confirmación de actualización del correo.
   * @param next - NextFunction para el manejo de errores.
   * @returns {Promise<void>} Confirmación del cambio de correo exitoso.
   */
  async patchUserEmail(
    req: RequestExtended,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.user ?? { userId: "" };

      const payload = req.body as ValidateCodeAndUpdateEmailInput;

      await authServiceContainer.validateCodeAndUpdateEmail.run(
        userId,
        payload
      );

      handleHttp(
        res,
        {
          data: null,
          message: "Email has been updated successfully",
        },
        200
      );
    } catch (error: unknown) {
      next(error);
    }
  }
}

export const authController = new AuthController();
