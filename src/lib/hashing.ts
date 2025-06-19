import { createCipheriv, createDecipheriv, randomBytes, pbkdf2Sync } from "crypto"

const ALGORITHM = "aes-256-gcm"
const KEY_LENGTH = 32
const IV_LENGTH = 16
const SALT_LENGTH = 32
const TAG_LENGTH = 16

function deriveKey(password: string, salt: Buffer): Buffer {
  return pbkdf2Sync(password, salt, 100000, KEY_LENGTH, "sha512")
}

export function hash(
  apiKey: string,
  password: string = process.env.ENCRYPTION_PASSWORD || "default-password"
): string {
  const salt = randomBytes(SALT_LENGTH)
  const iv = randomBytes(IV_LENGTH)
  const key = deriveKey(password, salt)

  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(apiKey, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()

  const result = Buffer.concat([salt, iv, tag, encrypted])
  return result.toString("base64")
}

export function unhash(
  encryptedData: string,
  password: string = process.env.ENCRYPTION_PASSWORD || "default-password"
): string | null {
  try {
    const data = Buffer.from(encryptedData, "base64")
    const salt = data.subarray(0, SALT_LENGTH)
    const iv = data.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
    const tag = data.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH)
    const encrypted = data.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH)

    const key = deriveKey(password, salt)

    const decipher = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(tag)

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
    return decrypted.toString("utf8")
  } catch (error) {
    console.error(error)
    return null
  }
}
