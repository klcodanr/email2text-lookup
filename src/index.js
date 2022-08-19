import emailToPhone from "email-to-phone";

/**
 * Looks up the specified phone number using the twilio API
 * @param {TwilioClient} client the client to use to connect to twilio
 * @param {string} number the number to lookup
 */
export async function lookupPhoneNumber(client, number) {
  return client.lookups.phoneNumbers(number).fetch({ type: ["carrier"] });
}

/**
 * Finds the email2text address for the specified phone number and carrier
 * @param {string} phoneNumber the phone number for which to find the email2text address
 * @param {string} carrerName the carrier name for the phone number
 * @param {(carrerName: any, phoneNumber: any) => string | null} method the method on emailToPhone to call
 * @returns the email address or null if the lookup fails
 */
export function lookupEmail2Text(
  phoneNumber,
  carrerName,
  method = emailToPhone.sms
) {
  return method(carrerName, phoneNumber);
}
