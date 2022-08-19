#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import emailToPhone from "email-to-phone";
import twilio from "twilio";

import { lookupEmail2Text, lookupPhoneNumber } from "./index.js";

yargs(hideBin(process.argv))
  .command(
    "$0 <number>",
    "Looks an email2text address using Twilio",
    (yargsOp) => {
      return yargsOp
        .option("sid", { description: "the Twilio account SID" })
        .option("secret", { description: "the Twilio account secret" })
        .option("format", {
          description: "The format for the output to be written to console",
          default: "json",
          choices: ["json", "text"],
        })
        .option("method", {
          description: "The lookup method, e.g. to prefer / request mms or sms",
          default: "sms",
          choices: ["sms", "mms", "sms_mms", "mms_sms"],
        });
    },
    async (argv) => {
      const sid = argv.sid || process.env.TWILIO_SID;
      if (!sid) {
        throw new Error(
          `Twilio Account SID is required, either supply in the env TWILIO_SID or via the option --sid`
        );
      }
      const secret = argv.secret || process.env.TWILIO_SECRET;
      if (!secret) {
        throw new Error(
          `Twilio Account Secret is required, either supply in the env TWILIO_SECRET or via the option --secret`
        );
      }

      const method = emailToPhone[argv.method];

      const client = new twilio(sid, secret);

      let phoneNumber;
      try {
        phoneNumber = await lookupPhoneNumber(client, argv.number);
      } catch (err) {
        console.error(`Failed to look up phone number: ${argv.number}`, err);
        throw new Error(`Failed to look up phone number: ${argv.number}`);
      }

      const email2Text = lookupEmail2Text(
        argv.number,
        phoneNumber.carrier.name,
        method
      );

      if (argv.format === "text") {
        process.stdout.write(email2Text + "\n");
      } else {
        phoneNumber[argv.method] = email2Text;
        process.stdout.write(JSON.stringify(phoneNumber) + "\n");
      }
    }
  )
  .demandCommand(1)
  .parse();
