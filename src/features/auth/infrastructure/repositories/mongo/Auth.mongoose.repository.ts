import { ErrorMessages } from "@/shared/utils";
import { AppError } from "@/core/domain/exeptions/AppError";

import { Session, VerificationCode } from "../../../domain/entities";
import {
  CreateSession,
  VerificationCodeType,
  CreateCode,
} from "../../../domain/types";
import { AuthRepositoryType } from "../../../domain/repositories/AuthRepository.interface";

import {
  MongoSession,
  MongoVerificationCode,
  SessionModel,
  VerificationCodeModel,
} from "./Auth.model";

/**
 * Mapea un documento de MongoDB de verificación de código a la entidad de dominio `VerificationCode`.
 *
 * @param mongoVerificationCode - Documento de código de verificación proveniente de MongoDB.
 * @returns Entidad `VerificationCode` con el `codeId` normalizado como string.
 */
const mapCode = (
  mongoVerificationCode: MongoVerificationCode
): VerificationCode => {
  const { _id, code, type, userId, expiresAt } = mongoVerificationCode;
  return new VerificationCode(_id.toString(), code, type, userId, expiresAt);
};

/**
 * Mapea un documento de MongoDB de sesión a la entidad de dominio `Session`.
 *
 * @param mongoSession - Documento de sesión proveniente de MongoDB.
 * @returns Entidad `Session` con el `sessionId` normalizado como string.
 */
const mapSession = (mongoSession: MongoSession): Session => {
  const { _id, sessionToken, refreshToken, active, createdAt, expiresAt } =
    mongoSession;

  return new Session(
    _id.toString(),
    sessionToken,
    refreshToken,
    active,
    createdAt,
    expiresAt
  );
};

/**
 * Implementación del repositorio de autenticación utilizando MongoDB.
 *
 * Maneja la persistencia y recuperación de datos relacionados con:
 * - Códigos de verificación.
 * - Sesiones de usuario.
 *
 * Implementa la interfaz `AuthRepositoryType` para garantizar consistencia
 * y desacoplamiento de la lógica de negocio respecto a la infraestructura.
 */
export class AuthMongoRepository implements AuthRepositoryType {
  /**
   * Crea un nuevo código de verificación en la base de datos.
   *
   * @param newCode - Objeto `NewVerificationCode` con los datos del código a registrar.
   * @throws {AppError} - Error 500 si la operación de persistencia falla.
   */
  async createCode(newCode: CreateCode): Promise<void> {
    try {
      await VerificationCodeModel.create(newCode);
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while creating code: ${error}`,
        false
      );
    }
  }

  /**
   * Busca un código de verificación por su valor y tipo.
   *
   * @param code - Código de verificación generado.
   * @param type - Tipo de código (`email_verification` | `password_reset`).
   * @returns Entidad `VerificationCode` si existe, o `null` si no se encuentra.
   * @throws {AppError} - Error 500 si ocurre un fallo en la consulta.
   */
  async findByCode(
    code: string,
    type: VerificationCodeType
  ): Promise<VerificationCode | null> {
    try {
      const verificationCode = await VerificationCodeModel.findOne({
        code,
        type,
      });

      if (!verificationCode) return null;
      return mapCode(verificationCode.toObject());
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while finding code: ${error}`,
        false
      );
    }
  }
  /**
   * Elimina todos los códigos de verificación asociados a un usuario.
   *
   * @param userId - ID del usuario propietario de los códigos.
   * @throws {AppError} - Error 500 si la operación falla.
   */
  async deleteCodesByUserId(userId: string): Promise<void> {
    try {
      await VerificationCodeModel.deleteMany({ userId });
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while deleting codes: ${error}`,
        false
      );
    }
  }
  /**
   * Busca una sesión activa por su token JWT.
   *
   * @param sessionToken - Token JWT de la sesión a consultar.
   * @returns Entidad `Session` si existe, o `null` si no se encuentra.
   * @throws {AppError} - Error 500 si ocurre un fallo en la consulta.
   */
  async findSessionByToken(sessionToken: string): Promise<Session | null> {
    try {
      const session = await SessionModel.findOne({
        sessionToken,
        active: true,
      });

      if (!session) return null;

      return mapSession(session.toObject());
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while finding user session: ${error}`,
        false
      );
    }
  }

  /**
   * Busca sesión activa por refreshToken.
   *
   * @param refreshToken - Refresh token de la sesión a consultar.
   * @returns Entidad `Session` si existe, o `null` si no se encuentra.
   * @throws {AppError} - Error 500 si ocurre un fallo en la consulta.
   */
  async findSessionByRefreshToken(
    refreshToken: string
  ): Promise<Session | null> {
    try {
      const session = await SessionModel.findOne({
        refreshToken,
        active: true,
      });

      if (!session) return null;
      return mapSession(session.toObject());
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while finding user session: ${error}`,
        false
      );
    }
  }

  /**
   * Crea una nueva sesión de usuario en la base de datos.
   *
   * @param newSession - Objeto `CreateSession` con los datos de la sesión a registrar.
   * @throws {AppError} - Error 500 si la operación de persistencia falla.
   */
  async createSession(newSession: CreateSession): Promise<void> {
    try {
      await SessionModel.create(newSession);
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while creating user session: ${error}`,
        false
      );
    }
  }

  /**
   * Actualiza el token de acceso de una sesión.
   *
   * @param sessionId - Id de la sesión a actualizar.
   * @param updatedSession - Objeto con el nuevo access token, refresh token y fecha de expiración
   * @throws {AppError} - Error 500 si la operación de persistencia falla.
   */
  async updateSessionToken(
    sessionId: string,
    updatedSession: Pick<Session, "refreshToken" | "sessionToken" | "expiresAt">
  ): Promise<void> {
    try {
      await SessionModel.updateOne({ _id: sessionId }, { ...updatedSession });
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while updating session token: ${error}`,
        false
      );
    }
  }

  /**
   * Invalida una sesión (la marca como inactiva).
   *
   * @param sessionId - ID de la sesión a invalidar.
   * @throws {AppError} - Error 500 si la actualización falla.
   */
  async invalidateSession(sessionId: string): Promise<void> {
    try {
      await SessionModel.updateOne({ _id: sessionId }, { active: false });
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while revoking user session: ${error}`,
        false
      );
    }
  }
  /**
   * Cuenta la cantidad de códigos de verificación según su tipo asociados a un usuario.
   *
   * @param userId - ID del usuario del cual se quieren contar los códigos.
   * @param type - Tipo de código a contar.
   * @returns Número total de códigos de verificación encontrados para ese usuario.
   * @throws {AppError} - Error 500 si ocurre un fallo durante la consulta a la base de datos.
   */
  async countCodesByUser(
    userId: string,
    type: "email_verification" | "password_reset" | "email_reset"
  ): Promise<number> {
    try {
      const codesByuser = await VerificationCodeModel.countDocuments({
        userId,
        type,
      });
      return codesByuser;
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while counting verification codes: ${error}`,
        false
      );
    }
  }
  /**
   * Elimina todos los códigos de verificación asociados a un usuario
   * según el tipo especificado (email_verification | password_reset).
   *
   * @param userId - ID del usuario.
   * @param type - Tipo de código a eliminar.
   * @throws AppError si ocurre un error durante la eliminación.
   */
  async deleteCodesByType(
    userId: string,
    type: "email_verification" | "password_reset" | "email_reset"
  ): Promise<void> {
    try {
      await VerificationCodeModel.deleteMany({
        userId,
        type,
      });
    } catch (error: unknown) {
      throw new AppError(
        ErrorMessages.INTERNAL_SERVER_ERROR,
        500,
        `An error ocurred while deleting verification codes by type: ${error}`,
        false
      );
    }
  }
}
