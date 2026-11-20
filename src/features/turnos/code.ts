// Alphabet without visually ambiguous characters (0/O, 1/I/L)
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/**
 * Generates a short human-readable booking code with format PT-XXXX.
 */
export function generateBookingCode(): string {
  let suffix = "";
  const values = new Uint32Array(4);
  crypto.getRandomValues(values);

  for (let i = 0; i < 4; i += 1) {
    suffix += CODE_ALPHABET[values[i] % CODE_ALPHABET.length];
  }

  return `PT-${suffix}`;
}

/**
 * Normalizes a phone number to digits only so creation and cancellation match reliably.
 */
export function normalizePhone(rawPhone: string): string {
  return rawPhone.replace(/\D/g, "");
}
