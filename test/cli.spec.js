import "dotenv/config";
import { describe, it } from "mocha";
import { execSync } from "child_process";
import { expect } from "chai";
import { fail } from "assert";

const knownGood = process.env.TEST_KNOWN_GOOD_NUMBER;
const expectedEmail2SMS = process.env.TEST_EXPECTED_EMAIL2SMS;
const expectedEmail2MMS = process.env.TEST_EXPECTED_EMAIL2MMS;

describe("cli", () => {
  describe("sad path tests", () => {
    it("requires phone number", () => {
      try {
        execSync("node_modules/dotenv-cli/cli.js -e .env -- node ./src/cli.js");
        fail();
      } catch (error) {
        expect(error.message).to.contain(
          "Not enough non-option arguments: got 0, need at least 1"
        );
      }
    });
    it("requires valid method", () => {
      try {
        execSync(
          `node_modules/dotenv-cli/cli.js -e .env -- node ./src/cli.js ${knownGood} --method=notreal`
        );
        fail();
      } catch (error) {
        expect(error.message).to.contain(
          'Argument: method, Given: "notreal", Choices:'
        );
      }
    });
    it("Fails on invalid number", () => {
      try {
        execSync(`node_modules/dotenv-cli/cli.js -e .env -- node ./src/cli.js 777`);
        fail();
      } catch (error) {
        expect(error.message).to.contain("Failed to look up phone number: 777");
      }
    });
    it("requires twilio auth", () => {
      const sid = process.env.TWILIO_SID;
      try {
        process.env.TWILIO_SID = null;
        const res = execSync(
          `node_modules/dotenv-cli/cli.js -e .envnoauth -- node ./src/cli.js ${knownGood}`
        );
        console.log(res.toString());
        fail("Did not get expected exception");
      } catch (error) {
        expect(error.message).to.contain("accountSid must start with AC");
      } finally {
        process.env.TWILIO_SID = sid;
      }
    });
  });
  describe("happy path tests", () => {
    it("can retrieve mms", () => {
      const res = execSync(
        `node_modules/dotenv-cli/cli.js -e .env -- node ./src/cli.js ${knownGood} --method=mms`
      );
      expect(res).to.not.be.null;
      const parsed = JSON.parse(res);
      expect(parsed["mms"]).to.eq(expectedEmail2MMS);
    });
    it("can retrieve sms", () => {
      const res = execSync(
        `node_modules/dotenv-cli/cli.js -e .env -- node ./src/cli.js ${knownGood}`
      );
      expect(res).to.not.be.null;
      const parsed = JSON.parse(res);
      expect(parsed["sms"]).to.eq(expectedEmail2SMS);
    });
    it("can prefer mms", () => {
      const res = execSync(
        `node_modules/dotenv-cli/cli.js -e .env -- node ./src/cli.js ${knownGood} --method=mms_sms`
      );
      expect(res).to.not.be.null;
      const parsed = JSON.parse(res);
      expect(parsed["mms_sms"]).to.eq(expectedEmail2MMS);
    });
    it("can prefer sms", () => {
      const res = execSync(
        `node_modules/dotenv-cli/cli.js -e .env -- node ./src/cli.js ${knownGood} --method=sms_mms`
      );
      expect(res).to.not.be.null;
      const parsed = JSON.parse(res);
      expect(parsed["sms_mms"]).to.eq(expectedEmail2SMS);
    });
    it("can request text output", () => {
      const res = execSync(
        `node_modules/dotenv-cli/cli.js -e .env -- node ./src/cli.js ${knownGood} --method=sms_mms --format=text`
      );
      expect(res.toString()).to.eq(expectedEmail2SMS + "\n");
    });
  });
});
