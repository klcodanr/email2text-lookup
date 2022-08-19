import "dotenv/config";
import { describe, it } from "mocha";
import { expect } from "chai";

import { lookupPhoneNumber, lookupEmail2Text } from "../src/index.js";
import twilio from "twilio";

const knownGood = process.env.TEST_KNOWN_GOOD_NUMBER;
const expectedEmail2SMS = process.env.TEST_EXPECTED_EMAIL2SMS;

describe("import", () => {
  describe("happy path tests", () => {
    it("can lookup phone number", async () => {
      const client = new twilio(
        process.env.TWILIO_SID,
        process.env.TWILIO_SECRET
      );
      let phoneNumber = await lookupPhoneNumber(client, knownGood);
      expect(phoneNumber).to.not.be.null;
      expect(phoneNumber.phoneNumber).to.not.be.null;
    });

    it("can lookup email2sms", async () => {
      const client = new twilio(
        process.env.TWILIO_SID,
        process.env.TWILIO_SECRET
      );
      let phoneNumber = await lookupPhoneNumber(client, knownGood);
      const email2Text = lookupEmail2Text(knownGood, phoneNumber.carrier.name);
      expect(email2Text).to.eq(expectedEmail2SMS);
    });
  });
});
