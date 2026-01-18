import {
  RefreshTokenGeneratorService,
  VerificationCodeGeneratorService,
} from "../../domain/services";

import {
  LoginUseCase,
  SignUpUseCase,
  SendRecoveryPassRequestUseCase,
  ValidateEmailVerificationCodeUseCase,
  ValidateResetPassCodeUseCase,
  ResendEmailVerificationCodeUseCase,
  ResetUserPasswordUseCase,
  ChangeUserPasswordUseCase,
  ValidateSessionUseCase,
  RefreshSessionUseCase,
  LogoutUseCase,
  SendEmailChangeRequestUseCase,
  ValidateCodeAndUpdateEmailUseCase,
} from "../../application/use-cases";

import { AuthMongoRepository } from "../repositories";
import { NodeMailerAdapter } from "../adapters";

import { MongoTransactionManagerAdapter } from "@/core/infrastructure/database";

/**
 * Repositorio de autenticación basado en MongoDB.
 * Proporciona las operaciones de persistencia necesarias para los casos de uso.
 */
const authRepository = new AuthMongoRepository();
/**
 * Adaptador de envío de correos utilizando NodeMailer.
 * Encargado de entregar emails transaccionales (verificación, recuperación, etc.).
 */
const emailSender = new NodeMailerAdapter();

/** Adaptador encargado de gestionar procesos transaccionales en base de datos basado en MongoDB*/
const transactionManager = new MongoTransactionManagerAdapter();

/** Servicio de dominio para generar codigos de verificación */
const codeGenerator = new VerificationCodeGeneratorService();

/** Servicio de dominio para gestionar refresh tokens */
const refreshTokenGenerator = new RefreshTokenGeneratorService();

/**
 * Contenedor de servicios de autenticación.
 * Expone instancias de casos de uso ya configuradas con sus dependencias.
 *
 * Uso:
 *   import { AuthServiceContainer } from "...";
 *   await AuthServiceContainer.login.execute(payload);
 *
 * Propiedades:
 * @property {LoginUseCase} login - Autentica a un usuario con email/usuario y contraseña.
 * @property {SignUpUseCase} signUp - Registra un nuevo usuario y envía código de verificación por correo.
 * @property {SendRecoveryPassRequestUseCase} sendRecoveryPassRequest - Envía instrucciones/código para recuperar la contraseña.
 * @property {ValidateEmailVerificationCodeUseCase} validateEmailVerificationCode - Valida el código de verificación de correo.
 * @property {ValidateResetPassCodeUseCase} validateResetPassCode - Valida el código para restablecer contraseña.
 * @property {ResendEmailVerificationCodeUseCase} resendEmailVerificationCode - Reenvía el código de verificación de correo.
 * @property {ResetUserPasswordUseCase} resetUserPassword - Restablece la contraseña usando un código válido.
 * @property {ChangeUserPasswordUseCase} changeUserPassword - Cambia la contraseña estando autenticado.
 * @property {ValidateSessionUseCase} validateSession - Valida el estado de la sesión (tokens/expiración).
 * @property {RefreshSessionUseCase} refreshSession - Renueva la sesión emitiendo nuevos tokens.
 * @property {LogoutUseCase} logout - Cierra la sesión e invalida tokens/credenciales activas.
 * @property {SendEmailChangeRequestUseCase} sendEmailChangeRequest - Envía código para solicitar cambio de correo.
 * @property {ValidateCodeAndUpdateEmailUseCase} validateCodeAndUpdateEmail - Valida el código recibido y actualiza el correo.
 */
export class AuthServiceContainer {
  login = new LoginUseCase(refreshTokenGenerator, authRepository);
  signUp = new SignUpUseCase(
    codeGenerator,
    authRepository,
    emailSender,
    transactionManager
  );
  sendRecoveryPassRequest = new SendRecoveryPassRequestUseCase(
    codeGenerator,
    authRepository,
    emailSender
  );
  validateEmailVerificationCode = new ValidateEmailVerificationCodeUseCase(
    authRepository
  );
  validateResetPassCode = new ValidateResetPassCodeUseCase(authRepository);
  resendEmailVerificationCode = new ResendEmailVerificationCodeUseCase(
    codeGenerator,
    authRepository,
    emailSender
  );
  resetUserPassword = new ResetUserPasswordUseCase();
  changeUserPassword = new ChangeUserPasswordUseCase();
  validateSession = new ValidateSessionUseCase(authRepository);
  refreshSession = new RefreshSessionUseCase(
    refreshTokenGenerator,
    authRepository
  );
  logout = new LogoutUseCase(authRepository);
  sendEmailChangeRequest = new SendEmailChangeRequestUseCase(
    codeGenerator,
    authRepository,
    emailSender
  );
  validateCodeAndUpdateEmail = new ValidateCodeAndUpdateEmailUseCase(
    authRepository
  );
}
