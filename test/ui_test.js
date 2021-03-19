const {
  Builder,
  By,
  until,
  Capabilities,
  promise,
} = require("selenium-webdriver");
const { expect } = require("chai");
// TODO: const { expect, use } = require("chai");
// TODO: const chaiWebdriver = require('chai-webdriver');

const petStoreURL = "https://petstore.octoperf.com";
const driver = new Builder().withCapabilities(Capabilities.chrome()).build();
// TODO: use(chaiWebdriver(driver));

const user = {
  userInfo: {
    userId: Math.random().toString(16).substr(2, 8),
    password: "password",
  },
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
  profileInfo: {
    languagePreference: "japanese",
    favoriteCatefory: "DOGS",
    enableMyList: true,
    enableMyBanner: true,
  },
};

const paymentDetails = {
  cardType: "American Express",
  cardNumber: "123 4567 7890 1234",
  expiryDate: "01/2999",
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

async function moveToTopPage() {
  await driver.get(petStoreURL);
  expect(await driver.getTitle()).to.equal("JPetStore Demo");
  await driver.wait(
    until.elementIsVisible(
      await driver.findElement(By.linkText("Enter the Store"))
    )
  );
}

async function enterToStore() {
  let linkToEnterStore = await driver.findElement(
    By.linkText("Enter the Store")
  );
  expect(await linkToEnterStore.isDisplayed()).to.be.true;
  await linkToEnterStore.click();
  await driver.wait(until.urlIs(`${petStoreURL}/actions/Catalog.action`));
}

async function moveToSpecifiedCatalogPage(selectorOfMenuLink, categoryId) {
  let categoryIdLink = await driver.findElement(By.css(selectorOfMenuLink));
  expect(await categoryIdLink.isDisplayed()).to.be.true;
  await categoryIdLink.click();
  await driver.wait(
    until.urlContains(`viewCategory=&categoryId=${categoryId}`)
  );
}

async function moveToProductPageFromCatalogPage(productId) {
  let productIdLink = await driver.findElement(By.linkText(productId));
  expect(await productIdLink.isDisplayed()).to.be.true;
  await productIdLink.click();
  await driver.wait(until.urlContains(`viewProduct=&productId=${productId}`));
}

async function moveToItemPageFromProductPage(itemId) {
  let itemIdLink = await driver.findElement(By.linkText(itemId));
  expect(await itemIdLink.isDisplayed()).to.be.true;
  await itemIdLink.click();
  await driver.wait(until.urlContains(`viewItem=&itemId=${itemId}`));
}

async function addItemToShoppingCart() {
  let addToCartLink = await driver.findElement(By.linkText("Add to Cart"));
  expect(await addToCartLink.isDisplayed()).to.be.true;
  await addToCartLink.click();
  await driver.wait(until.urlContains(`${petStoreURL}/actions/Cart.action`));
}

async function moveToShoppingCartPage() {
  let shoppingCartLink = await driver.findElement(
    By.xpath("//img[@name='img_cart']")
  );
  expect(await shoppingCartLink.isDisplayed()).to.be.true;
  await shoppingCartLink.click();

  await driver.wait(until.urlContains(`${petStoreURL}/actions/Cart.action`));
  expect(
    await driver.findElement(By.xpath("//*[@id='Cart']/h2")).getText()
  ).to.be.eql("Shopping Cart");
}

async function checkDisplayedItemIdAndQuantityInShoppingCart(itemId, quantity) {
  expect(
    await driver.findElement(By.xpath("//*[@id='Cart']/h2")).getText()
  ).to.be.eql("Shopping Cart");

  expect(await driver.findElement(By.linkText(itemId)).isDisplayed()).to.be
    .true;
  expect(
    await driver
      .findElement(By.xpath(`//input[@name='${itemId}']`))
      .getAttribute("value")
  ).to.be.eql(quantity.toString());
}

async function proceedToCheckoutFromCart() {
  expect(
    await driver.findElement(By.xpath("//*[@id='Cart']/h2")).getText()
  ).to.be.eql("Shopping Cart");

  let linkToProceedToCheckout = await driver.findElement(
    By.linkText("Proceed to Checkout")
  );
  expect(await linkToProceedToCheckout.isDisplayed()).to.be.true;
  await linkToProceedToCheckout.click();
}

async function inputUserInfoInRegstrationPage(userInfoObject) {
  await driver
    .findElement(By.xpath("//input[@name='username']"))
    .sendKeys(userInfoObject.userId)
    .toString();

  await driver
    .findElement(By.xpath("//input[@name='password']"))
    .sendKeys(userInfoObject.password);

  await driver
    .findElement(By.xpath("//input[@name='repeatedPassword']"))
    .sendKeys(userInfoObject.password);
}

async function inputAccountInfoInRegstrationPage(accountInfoObject) {
  await driver
    .findElement(By.xpath("//input[@name='account.firstName']"))
    .sendKeys(accountInfoObject.firstName);

  await driver
    .findElement(By.xpath("//input[@name='account.lastName']"))
    .sendKeys(accountInfoObject.lastName);

  await driver
    .findElement(By.xpath("//input[@name='account.email']"))
    .sendKeys(accountInfoObject.email);

  await driver
    .findElement(By.xpath("//input[@name='account.phone']"))
    .sendKeys(accountInfoObject.phone);

  await driver
    .findElement(By.xpath("//input[@name='account.address1']"))
    .sendKeys(accountInfoObject.address1);

  await driver
    .findElement(By.xpath("//input[@name='account.address2']"))
    .sendKeys(accountInfoObject.address2);

  await driver
    .findElement(By.xpath("//input[@name='account.city']"))
    .sendKeys(accountInfoObject.city);

  await driver
    .findElement(By.xpath("//input[@name='account.state']"))
    .sendKeys(accountInfoObject.state);

  await driver
    .findElement(By.xpath("//input[@name='account.zip']"))
    .sendKeys(accountInfoObject.zip);

  await driver
    .findElement(By.xpath("//input[@name='account.country']"))
    .sendKeys(accountInfoObject.country);
}

async function inputProfileInfoInRegstrationPage(profileInfoObject) {
  let languagePrefernceDropdown = await driver.findElement(
    By.xpath(
      `//select[@name='account.languagePreference']/option[text()='${profileInfoObject.languagePreference}']`
    )
  );
  await languagePrefernceDropdown.click();
  expect(await languagePrefernceDropdown.isSelected()).to.be.true;

  let favoriteCategoryDropdown = await driver.findElement(
    By.xpath(
      `//select[@name='account.favouriteCategoryId']/option[text()='${profileInfoObject.favoriteCatefory}']`
    )
  );
  await favoriteCategoryDropdown.click();
  expect(await favoriteCategoryDropdown.isSelected()).to.be.true;

  let enableMyListCheckbox = await driver.findElement(
    By.xpath("//input[@type='checkbox'][@name='account.listOption']")
  );
  if (profileInfoObject.enableMyList) {
    await enableMyListCheckbox.click();
    expect(await enableMyListCheckbox.isSelected()).to.be.true;
  }

  let enableMyBannerCheckbox = await driver.findElement(
    By.xpath("//input[@type='checkbox'][@name='account.bannerOption']")
  );
  if (profileInfoObject.enableMyList) {
    await enableMyBannerCheckbox.click();
    expect(await enableMyBannerCheckbox.isSelected()).to.be.true;
  }
}

async function inputPaymentDetailsToOrderItems(paymentDetailsObject) {
  let cardTypeDropdown = await driver.findElement(
    By.xpath(
      `//select[@name='order.cardType']/option[text()='${paymentDetailsObject.cardType}']`
    )
  );
  await cardTypeDropdown.click();
  expect(await cardTypeDropdown.isSelected()).to.be.true;

  await driver
    .findElement(By.xpath("//input[@name='order.creditCard']"))
    .sendKeys(paymentDetailsObject.cardNumber);

  await driver
    .findElement(By.xpath("//input[@name='order.expiryDate']"))
    .sendKeys(paymentDetailsObject.expiryDate);
}

async function checkBillingAddressIsSameWithAccountInfo(accountInfoObject) {
  expect(
    await driver
      .findElement(By.xpath("//input[@name='order.billToFirstName']"))
      .getAttribute("value")
  ).to.be.eql(accountInfoObject.firstName);

  expect(
    await driver
      .findElement(By.xpath("//input[@name='order.billToLastName']"))
      .getAttribute("value")
  ).to.be.eql(accountInfoObject.lastName);

  expect(
    await driver
      .findElement(By.xpath("//input[@name='order.billAddress1']"))
      .getAttribute("value")
  ).to.be.eql(accountInfoObject.address1);

  expect(
    await driver
      .findElement(By.xpath("//input[@name='order.billAddress2']"))
      .getAttribute("value")
  ).to.be.eql(accountInfoObject.address2);

  expect(
    await driver
      .findElement(By.xpath("//input[@name='order.billCity']"))
      .getAttribute("value")
  ).to.be.eql(accountInfoObject.city);

  expect(
    await driver
      .findElement(By.xpath("//input[@name='order.billZip']"))
      .getAttribute("value")
  ).to.be.eql(accountInfoObject.zip);

  expect(
    await driver
      .findElement(By.xpath("//input[@name='order.billCountry']"))
      .getAttribute("value")
  ).to.be.eql(accountInfoObject.country);
}

async function checkShippingAddressIsSameWithAccountInfo(accountInfoObject) {
  expect(
    await driver
      .findElement(By.xpath("//input[@name='order.shipToFirstName']"))
      .getAttribute("value")
  ).to.be.eql(accountInfoObject.firstName);

  expect(
    await driver
      .findElement(By.xpath("//input[@name='order.shipToLastName']"))
      .getAttribute("value")
  ).to.be.eql(accountInfoObject.lastName);

  expect(
    await driver
      .findElement(By.xpath("//input[@name='order.shipAddress1']"))
      .getAttribute("value")
  ).to.be.eql(accountInfoObject.address1);

  expect(
    await driver
      .findElement(By.xpath("//input[@name='order.shipAddress2']"))
      .getAttribute("value")
  ).to.be.eql(accountInfoObject.address2);

  expect(
    await driver
      .findElement(By.xpath("//input[@name='order.shipCity']"))
      .getAttribute("value")
  ).to.be.eql(accountInfoObject.city);

  expect(
    await driver
      .findElement(By.xpath("//input[@name='order.shipZip']"))
      .getAttribute("value")
  ).to.be.eql(accountInfoObject.zip);

  expect(
    await driver
      .findElement(By.xpath("//input[@name='order.shipCountry']"))
      .getAttribute("value")
  ).to.be.eql(accountInfoObject.country);
}

async function inputShippingAddress(shippingAddressObject) {
  let firstNameTextArea = await driver.findElement(
    By.xpath("//input[@name='order.shipToFirstName']")
  );
  await firstNameTextArea.clear();
  await firstNameTextArea.sendKeys(shippingAddressObject.firstName);

  let lastNameTextArea = await driver.findElement(
    By.xpath("//input[@name='order.shipToLastName']")
  );
  await lastNameTextArea.clear();
  await lastNameTextArea.sendKeys(shippingAddressObject.lastName);

  let shipAddress1TextArea = await driver.findElement(
    By.xpath("//input[@name='order.shipAddress1']")
  );
  await shipAddress1TextArea.clear();
  await shipAddress1TextArea.sendKeys(shippingAddressObject.address1);

  let shipAddress2TextArea = await driver.findElement(
    By.xpath("//input[@name='order.shipAddress2']")
  );
  await shipAddress2TextArea.clear();
  await shipAddress2TextArea.sendKeys(shippingAddressObject.address2);

  let shipCityTextArea = await driver.findElement(
    By.xpath("//input[@name='order.shipCity']")
  );
  await shipCityTextArea.clear();
  await shipCityTextArea.sendKeys(shippingAddressObject.city);

  let shipStateTextArea = await driver.findElement(
    By.xpath("//input[@name='order.shipState']")
  );
  await shipStateTextArea.clear();
  await shipStateTextArea.sendKeys(shippingAddressObject.state);

  let shipZipTextArea = await driver.findElement(
    By.xpath("//input[@name='order.shipZip']")
  );
  await shipZipTextArea.clear();
  await shipZipTextArea.sendKeys(shippingAddressObject.zip);

  let shipCountryTextArea = await driver.findElement(
    By.xpath("//input[@name='order.shipCountry']")
  );
  await shipCountryTextArea.clear();
  await shipCountryTextArea.sendKeys(shippingAddressObject.country);
}

describe("Successful End-to-end customer journey of purchasing 3 Products", function () {
  const spotlessKoiItemId = "EST-5";
  const spottedAdultFemaleDalmationItemId = "EST-10";
  const taillessManxItemId = "EST-14";

  before(async function () {
    await moveToTopPage();
    await enterToStore();
  });

  describe("Add one fish product to shopping cart", function () {
    const fishSelector = "#QuickLinks > a:nth-child(1) > img";
    const fishCategoryId = "FISH";
    const koiProductId = "FI-FW-01";
    it("Move to Fish catalog page from store menu", async function () {
      await moveToSpecifiedCatalogPage(fishSelector, fishCategoryId);
    });

    it("Move to Koi product page from Fish catalog page", async function () {
      await moveToProductPageFromCatalogPage(koiProductId);
    });

    it("Move to Spotless Koi item page from Koi product page", async function () {
      await moveToItemPageFromProductPage(spotlessKoiItemId);
    });

    it("Add Spotless Koi to cart", async function () {
      await addItemToShoppingCart();
    });

    it("Check Spotless Koi has added to cart", async function () {
      await checkDisplayedItemIdAndQuantityInShoppingCart(spotlessKoiItemId, 1);
    });
  });

  describe("Add one dog product to shopping cart", function () {
    const dogsSelector = "#QuickLinks > a:nth-child(3) > img";
    const dogsCategoryId = "DOGS";
    const dalmationProductId = "K9-DL-01";
    it("Move to Dog catalog page from store menu", async function () {
      await moveToSpecifiedCatalogPage(dogsSelector, dogsCategoryId);
    });

    it("Move to Dalmation product page from Dog catalog page", async function () {
      await moveToProductPageFromCatalogPage(dalmationProductId);
    });

    it("Move to Spotted Adult Female Dalmation item page from Dalmation product page", async function () {
      await moveToItemPageFromProductPage(spottedAdultFemaleDalmationItemId);
    });

    it("Add Spotted Adult Female Dalmation to cart", async function () {
      await addItemToShoppingCart();
    });

    it("Check Spotted Adult Female Dalmation has added to cart", async function () {
      await checkDisplayedItemIdAndQuantityInShoppingCart(
        spottedAdultFemaleDalmationItemId,
        1
      );
    });
  });

  describe("Add one cat product to shopping cart", function () {
    const catsSelector = "#QuickLinks > a:nth-child(7) > img";
    const catsCategoryId = "CATS";
    const manxProductId = "FL-DSH-01";
    it("Move to Cat catalog page from store menu", async function () {
      await moveToSpecifiedCatalogPage(catsSelector, catsCategoryId);
    });

    it("Move to Manx product page from Cat catalog page", async function () {
      await moveToProductPageFromCatalogPage(manxProductId);
    });

    it("Move to Tailless Manx item page from Manx product page", async function () {
      await moveToItemPageFromProductPage(taillessManxItemId);
    });

    it("Add Tailless Manx to cart", async function () {
      await addItemToShoppingCart();
    });

    it("Check Tailless Manx has added to cart", async function () {
      await checkDisplayedItemIdAndQuantityInShoppingCart(
        taillessManxItemId,
        1
      );
    });
  });

  describe("Proceed to checkout and register a new user account", function () {
    it("Proceed to checkout from shopping cart", async function () {
      await proceedToCheckoutFromCart();
    });

    it("Click link to register new account", async function () {
      let linkToRegisterNow = await driver.findElement(
        By.linkText("Register Now!")
      );
      expect(await linkToRegisterNow.isDisplayed()).to.be.true;
      await linkToRegisterNow.click();
      await driver.wait(until.urlContains("newAccountForm="));
    });

    it("Input Personal Information", async function () {
      await inputUserInfoInRegstrationPage(user.userInfo);
      await inputAccountInfoInRegstrationPage(user.accountInfo);
      await inputProfileInfoInRegstrationPage(user.profileInfo);
    });

    it("Click Save Account Information link", async function () {
      let saveAccountInfoLink = await driver.findElement(
        By.xpath("//input[@name='newAccount']")
      );
      expect(await saveAccountInfoLink.isDisplayed()).to.be.true;
      await saveAccountInfoLink.click();
      await driver.wait(
        until.urlContains(`${petStoreURL}/actions/Catalog.action`)
      );
    });
  });

  describe("Proceed to checkout again from shopping cart and complete the order", function () {
    it("Proceed to Checkout again from shopping cart", async function () {
      await moveToShoppingCartPage();
      await checkDisplayedItemIdAndQuantityInShoppingCart(spotlessKoiItemId, 1);
      await checkDisplayedItemIdAndQuantityInShoppingCart(
        spottedAdultFemaleDalmationItemId,
        1
      );
      await checkDisplayedItemIdAndQuantityInShoppingCart(
        taillessManxItemId,
        1
      );
      await proceedToCheckoutFromCart();
      await driver.wait(
        until.urlContains(`${petStoreURL}/actions/Order.action?newOrderForm=`)
      );
    });

    it("Input Payment Details", async function () {
      await inputPaymentDetailsToOrderItems(paymentDetails);
    });

    it("Check auto filled Billing Address data is same with registered account information", async function () {
      await checkBillingAddressIsSameWithAccountInfo(user.accountInfo);
    });

    it("Select to ship different address and click continue", async function () {
      let shipToDifferentAddressCheckbox = await driver.findElement(
        By.xpath("//input[@type='checkbox'][@name='shippingAddressRequired']")
      );
      await shipToDifferentAddressCheckbox.click();
      expect(await shipToDifferentAddressCheckbox.isSelected()).to.be.true;

      let continueLink = await driver.findElement(
        By.xpath("//input[@type='submit'][@name='newOrder'][@value='Continue']")
      );
      await continueLink.click();
      await driver.wait(
        until.elementIsVisible(
          await driver.findElement(
            By.xpath("//th[@colspan='2'][text()='Shipping Address']")
          )
        )
      );
    });

    it("Check default Shipping Address is the same with the registered account information", async function () {
      await checkShippingAddressIsSameWithAccountInfo(user.accountInfo);
      await inputShippingAddress(shippingAddress);

      let continueLink = await driver.findElement(
        By.xpath("//input[@type='submit'][@name='newOrder'][@value='Continue']")
      );
      await continueLink.click();
      await driver.wait(
        until.elementIsVisible(
          await driver.findElement(
            By.xpath(
              "//div[@id='Catalog'][contains(text(),'Please confirm the information below and then')]"
            )
          )
        )
      );
    });

    it("Final comfirmation of the order", async function () {
      function checkForValueInText(objectToCheck, skipChecks, rowsText) {
        let objectKey;
        for (objectKey in objectToCheck) {
          if (skipChecks.includes(objectKey)) {
            continue;
          }
          expect(
            rowsText.includes(` ${objectToCheck[objectKey]}`),
            "Failed on finding for value:" +
              objectToCheck[objectKey] +
              " in text"
          ).to.be.true;
        }
      }

      let billingAddressTableRows = await driver.findElement(By.tagName("table")).getText();
      console.log(billingAddressTableRows)
      const skipAccountChecks = ["email", "phone"];
      const accountInfo = user.accountInfo;

      checkForValueInText(accountInfo, skipAccountChecks, billingAddressTableRows);

      checkForValueInText(shippingAddress, [], billingAddressTableRows);
    });
  });

  after(async function () {
    return driver.quit();
  });
});
