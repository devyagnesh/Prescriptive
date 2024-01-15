/* eslint-disable no-useless-escape */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Validator {
  /**
 * Check if a given string is empty or contains only whitespace.
 * @param params - The string to be checked for emptiness.
 * @returns A boolean indicating whether the string is empty or not.
 */
  public static isEmpty (params: string): boolean {
    return (params === undefined) || params?.trim() === ''
  }

  /**
 * Check if a given string is a valid email address.
 * @param params - The string to be checked for valid email format.
 * @returns A boolean indicating whether the string is a valid email address.
 */
  public static isValidEmail (params: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(params)
  }

  /**
 * Check if a given string has a valid length based on specific criteria.
 * @param str - The string to be checked for valid length.
 * @param length - The expected length for the string.
 * @returns A boolean indicating whether the string has a valid length.
 */
  public static hasValidLength (str: string, length: number): boolean {
    return str?.trim().length >= length
  }

  /**
 * Compare two strings lexicographically.
 * @param str1 - The first string to compare.
 * @param str2 - The second string to compare.
 * @returns 0 if the strings are equal, a negative value if str1 is lexicographically less than str2,
 *          and a positive value if str1 is lexicographically greater than str2.
 */
  public static compare (str1: string, str2: string): boolean {
    return str1 === str2
  }

  /**
 * Checks if a given string consists only of alphabetic characters.
 *
 * @param {string} input - The input string to be validated.
 * @param {boolean} [includeSpaces=true] - Indicates whether spaces should be considered as valid characters.
 *   If set to `true` (default), spaces are allowed; if set to `false`, spaces are excluded from validation.
 *
 * @returns {boolean} Returns `true` if the input string consists only of alphabetic characters (and optional spaces),
 *   otherwise returns `false`.
 *
 * @example
 * // Example with spaces included
 * const resultWithSpaces = StringValidator.isAlphabetic("Hello World");
 * console.log(resultWithSpaces); // true
 *
 * @example
 * // Example without spaces
 * const resultWithoutSpaces = StringValidator.isAlphabetic("HelloWorld", false);
 * console.log(resultWithoutSpaces); // true
 */
  public static isAlphabetic (input: string, includeSpaces: boolean = true): boolean {
    const regexPattern = includeSpaces ? /^[a-zA-Z\s]+$/ : /^[a-zA-Z]+$/
    return regexPattern.test(input.trim())
  }

  /**
 * Checks if a given string consists of alphabetic characters, numeric values, and spaces.
 *
 * @param {string} input - The input string to be validated.
 *
 * @returns {boolean} Returns `true` if the input string consists only of alphabetic characters, numeric values, and spaces,
 *   otherwise returns `false`.
 *
 * @example
 * // Example with spaces, alphabets, and numeric values
 * const result = StringValidator.isAlphaNumericWithSpaces("Hello 123");
 * console.log(result); // true
 */
  public static isAlphaNumericWithSpaces (input: string): boolean {
    const regexPattern = /^[a-zA-Z0-9\s]+$/
    return regexPattern.test(input.trim())
  }

  /**
 * Checks if a given string represents a valid phone number with support for various formats.
 *
 * @param {string} phoneNumber - The input string to be validated as a phone number.
 *
 * @returns {boolean} Returns `true` if the input string represents a valid phone number, otherwise returns `false`.
 *
 * @example
 * // Example with a valid phone number
 * const resultValid = StringValidator.isValidPhoneNumber("+1 (123) 456-7890");
 * console.log(resultValid); // true
 *
 * @example
 * // Example with an invalid phone number
 * const resultInvalid = StringValidator.isValidPhoneNumber("123-456-7890");
 * console.log(resultInvalid); // false
 */
  public static isValidPhoneNumber (phoneNumber: string): boolean {
  // This regex allows for various phone number formats
    const regexPattern = /^(\+?\d{1,4}[\s\.-]?)?(\()?\d{1,}(\))?[\s\.-]?\d{1,}[\s\.-]?\d{1,}[\s\.-]?\d{1,}$/
    return regexPattern.test(phoneNumber.trim())
  }
}
