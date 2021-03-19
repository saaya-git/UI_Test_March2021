const user = {
  accountInfo: {
    firstName: "firstName",
    lastName: "lastName",
    email: "test@test.com",
    phone: "phone",
    address1: "address1",
    address2: "address2",
    city: "city",
    state: "state",
    zip: "zip",
    country: "country",
  },
};

const shippingAddress = {
  firstName: "shippingFirstName",
  lastName: "shippingLastName",
  address1: "shippingAddress1",
  address2: "shippingAddress2",
  city: "shippingCity",
  state: "shippingState",
  zip: "shippingZip",
  country: "shippingCountry",
};

var texts = [
  "Order\n" +
    "2021/03/19 12:23:51\n" +
    "Billing Address\n" +
    "First name: firstName\n" +
    "Last name: lastName\n" +
    "Address 1: address1\n" +
    "Address 2: address2\n" +
    "City: city\n" +
    "State: state\n" +
    "Zip: zip\n" +
    "Country: country\n" +
    "Shipping Address\n" +
    "First name: firstNameshippingFirstName\n" +
    "Last name: lastNameshippingLastName\n" +
    "Address 1: address1shippingAddress1\n" +
    "Address 2: address2shippingAddress2\n" +
    "City: cityshippingCity\n" +
    "State: stateshippingState\n" +
    "Zip: zipshippingZip\n" +
    "Country: countryshippingCountry",
];

const skipAccountChecks = ["email", "phone"];
const accountInfo = user.accountInfo;

function checkForValueInText(objectToCheck, skipChecks) {
  let objectKey;
  for (objectKey in objectToCheck) {
    if (skipChecks.includes(objectKey)) {
      continue;
    }
    if (!texts.includes(accountInfo[objectKey])) {
      //Fail code
    }
  }
}

checkForValueInText(accountInfo, skipAccountChecks, texts);
