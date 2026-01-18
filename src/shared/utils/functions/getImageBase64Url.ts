/**
 * Construye una URL de datos (data URL) para una imagen PNG a partir de una cadena codificada en Base64 (sin el prefijo).
 *
 * Esta utilidad antepone el esquema correcto para imágenes PNG: "data:image/png;base64,".
 * Se asume que la entrada es una carga Base64 válida y no se realiza validación.
 *
 * @param {string} base64Image - Contenido de la imagen en Base64 sin el prefijo "data:*;base64,".
 * @returns {string} Una cadena URL de datos que representa la imagen PNG.
 *
 * @example
 * const base64 = "iVBORw0KGgoAAAANSUhEUgAA...";
 * const url = getImageBase64Url(base64);
 * // url -> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 */
export const getImageBase64Url = (base64Image: string): string => {
  const mimeType = "image/png";
  const dataUrl = `data:${mimeType};base64,${base64Image}`;

  return dataUrl;
};
