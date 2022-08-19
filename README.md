# Email2Text Lookup

Looks up the email2text address using Twilio.

## Use

### Via CLI

First install:

    npm i -g email2text-lookup

Then execute with:

    email2text-lookup 5558675309 --sid=AC[...] --secret=[...]

More help can be found with the --help flag, e.g.:

    email2text-lookup --help


### As a Module

As a CLI, first install:

    npm i email2text-lookup

Then import and use:

    import { lookupPhoneNumber, lookupEmail2Text } from "email2text-lookup/lookup";

    const client = new twilio(twilioSid, twilioSecret);
    let resolved = await lookupPhoneNumber(client, phoneNumber);
    const email2Text = lookupEmail2Text(phoneNumber, resolved.carrier.name);

More help can be found with the --help flag, e.g.:

    email2text-lookup --help

## Tests

To run the tests you must provide the following environment variables:

    TWILIO_SID=AC[...]
    TWILIO_SECRET=[...]

    ## Testing variables
    TEST_KNOWN_GOOD_NUMBER=[...]
    TEST_EXPECTED_EMAIL2SMS=[...]@somecarrier.com
    TEST_EXPECTED_EMAIL2MMS=[...]@somecarrier.com

