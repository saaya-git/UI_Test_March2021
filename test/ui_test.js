const { Builder, By, until, Capabilities } = require("selenium-webdriver");
const { expect } = require("chai");

const commonFunctions = require("./common_functions.js");

const petStoreUrl = "https://petstore.octoperf.com";
const storeMainMenuUrl = `${petStoreUrl}/actions/Catalog.action`;
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

let orderId;
let orderDate;
let orderTime;
let expectedOrderTotalPrice;

describe("Successful End-to-end customer journey of purchasing 3 Products", function () {
  let driver;
  const orderInfo = {
    fish: {
      categoryId: "FISH",
      koi: {
        productId: "FI-FW-01",
        spotlessKoi: {
          itemId: "EST-5",
          quantity: 1,
          dollarPrice: 18.5,
        },
      },
    },
    dogs: {
      categoryId: "DOGS",
      dalmation: {
        productId: "K9-DL-01",
        spottedAdultFemaleDalmation: {
          itemId: "EST-10",
          quantity: 1,
          dollarPrice: 18.5,
        },
      },
    },
    cats: {
      categoryId: "CATS",
      manx: {
        productId: "FL-DSH-01",
        taillessManx: {
          itemId: "EST-14",
          quantity: 1,
          dollarPrice: 58.5,
        },
      },
    },
  };

  before(async function () {
    driver = new Builder().withCapabilities(Capabilities.chrome()).build();
    expectedOrderTotalPrice =
      orderInfo.fish.koi.spotlessKoi.dollarPrice +
      orderInfo.dogs.dalmation.spottedAdultFemaleDalmation.dollarPrice +
      orderInfo.cats.manx.taillessManx.dollarPrice;
  });
  after(async function () {
    return driver.quit();
  });

  describe("Access pet store web site", function () {
    it("Access pet store main menu", async function () {
      await commonFunctions.accessTopPage(driver);
      await commonFunctions.enterToStore(driver);
    });
  });

  describe("Add one fish product to shopping cart", function () {
    it("Move to Fish catalog page from store menu", async function () {
      await commonFunctions.moveToSpecifiedCatalogPage(
        driver,
        "#QuickLinks > a:nth-child(1) > img",
        orderInfo.fish.categoryId
      );
    });

    it("Move to Koi product page from Fish catalog page", async function () {
      await commonFunctions.moveToProductPageFromCatalogPage(
        driver,
        orderInfo.fish.koi.productId
      );
    });

    it("Move to Spotless Koi item page from Koi product page", async function () {
      await commonFunctions.moveToItemPageFromProductPage(
        driver,
        orderInfo.fish.koi.spotlessKoi.itemId
      );
    });

    it("Add Spotless Koi to cart", async function () {
      await commonFunctions.addItemToShoppingCart(driver);
    });

    it("Check Spotless Koi has added to cart", async function () {
      await commonFunctions.checkDisplayedItemIdAndQuantityInShoppingCart(
        driver,
        orderInfo.fish.koi.spotlessKoi.itemId,
        orderInfo.fish.koi.spotlessKoi.quantity
      );
    });
  });

  describe("Add one dog product to shopping cart", function () {
    it("Move to Dog catalog page from store menu", async function () {
      await commonFunctions.moveToSpecifiedCatalogPage(
        driver,
        "#QuickLinks > a:nth-child(3) > img",
        orderInfo.dogs.categoryId
      );
    });

    it("Move to Dalmation product page from Dog catalog page", async function () {
      await commonFunctions.moveToProductPageFromCatalogPage(
        driver,
        orderInfo.dogs.dalmation.productId
      );
    });

    it("Move to Spotted Adult Female Dalmation item page from Dalmation product page", async function () {
      await commonFunctions.moveToItemPageFromProductPage(
        driver,
        orderInfo.dogs.dalmation.spottedAdultFemaleDalmation.itemId
      );
    });

    it("Add Spotted Adult Female Dalmation to cart", async function () {
      await commonFunctions.addItemToShoppingCart(driver);
    });

    it("Check Spotted Adult Female Dalmation has added to cart", async function () {
      await commonFunctions.checkDisplayedItemIdAndQuantityInShoppingCart(
        driver,
        orderInfo.dogs.dalmation.spottedAdultFemaleDalmation.itemId,
        orderInfo.dogs.dalmation.spottedAdultFemaleDalmation.quantity
      );
    });
  });

  describe("Add one cat product to shopping cart", function () {
    it("Move to Cat catalog page from store menu", async function () {
      await commonFunctions.moveToSpecifiedCatalogPage(
        driver,
        "#QuickLinks > a:nth-child(7) > img",
        orderInfo.cats.categoryId
      );
    });

    it("Move to Manx product page from Cat catalog page", async function () {
      await commonFunctions.moveToProductPageFromCatalogPage(
        driver,
        orderInfo.cats.manx.productId
      );
    });

    it("Move to Tailless Manx item page from Manx product page", async function () {
      await commonFunctions.moveToItemPageFromProductPage(
        driver,
        orderInfo.cats.manx.taillessManx.itemId
      );
    });

    it("Add Tailless Manx to cart", async function () {
      await commonFunctions.addItemToShoppingCart(driver);
    });

    it("Check Tailless Manx has added to cart", async function () {
      await commonFunctions.checkDisplayedItemIdAndQuantityInShoppingCart(
        driver,
        orderInfo.cats.manx.taillessManx.itemId,
        orderInfo.cats.manx.taillessManx.quantity
      );
    });
  });

  describe("Proceed to checkout and register a new user account", function () {
    it("Proceed to checkout from shopping cart", async function () {
      await commonFunctions.proceedToCheckoutFromCart(driver);
    });

    it("Click link to register new account", async function () {
      await commonFunctions.moveToRegisterNewAccountPage(driver);
    });

    it("Input Personal Information and save account information", async function () {
      await commonFunctions.inputUserInfoInRegstrationPage(
        driver,
        user.userInfo
      );
      await commonFunctions.inputAccountInfoInRegstrationPage(
        driver,
        user.accountInfo
      );
      await commonFunctions.inputProfileInfoInRegstrationPage(
        driver,
        user.profileInfo
      );
      await commonFunctions.clickSaveAccountInformationLink(driver);
      await driver.wait(until.urlContains(storeMainMenuUrl));
    });
  });

  describe("Proceed to checkout again from shopping cart and complete the order", function () {
    it("Proceed to Checkout again from shopping cart", async function () {
      await commonFunctions.moveToShoppingCartPage(driver);
      await commonFunctions.checkDisplayedItemIdAndQuantityInShoppingCart(
        driver,
        orderInfo.fish.koi.spotlessKoi.itemId,
        orderInfo.fish.koi.spotlessKoi.quantity
      );
      await commonFunctions.checkDisplayedItemIdAndQuantityInShoppingCart(
        driver,
        orderInfo.dogs.dalmation.spottedAdultFemaleDalmation.itemId,
        orderInfo.dogs.dalmation.spottedAdultFemaleDalmation.quantity
      );
      await commonFunctions.checkDisplayedItemIdAndQuantityInShoppingCart(
        driver,
        orderInfo.cats.manx.taillessManx.itemId,
        orderInfo.cats.manx.taillessManx.quantity
      );
      await commonFunctions.proceedToCheckoutFromCart(driver);
      await driver.wait(
        until.urlContains(`${petStoreUrl}/actions/Order.action?newOrderForm=`)
      );
    });

    it("Input Payment Details", async function () {
      await commonFunctions.inputPaymentDetailsToOrderItems(
        driver,
        paymentDetails
      );
    });

    it("Check auto filled Billing Address data is same with registered account information", async function () {
      await commonFunctions.checkBillingAddressIsSameWithAccountInfo(
        driver,
        user.accountInfo
      );
    });

    it("Select to ship different address and click continue", async function () {
      let shipToDifferentAddressCheckbox = await driver.findElement(
        By.xpath("//input[@type='checkbox'][@name='shippingAddressRequired']")
      );
      await shipToDifferentAddressCheckbox.click();
      expect(await shipToDifferentAddressCheckbox.isSelected()).to.be.true;

      await driver
        .findElement(
          By.xpath(
            "//input[@type='submit'][@name='newOrder'][@value='Continue']"
          )
        )
        .click();
      await driver.wait(
        until.elementIsVisible(
          await driver.findElement(
            By.xpath("//th[@colspan='2'][text()='Shipping Address']")
          )
        )
      );
    });

    it("Check default Shipping Address is the same with the registered account information", async function () {
      await commonFunctions.checkShippingAddressIsSameWithAccountInfo(
        driver,
        user.accountInfo
      );
      await commonFunctions.inputShippingAddress(driver, shippingAddress);

      await driver
        .findElement(
          By.xpath(
            "//input[@type='submit'][@name='newOrder'][@value='Continue']"
          )
        )
        .click();
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
      const billingAddressTableRows = await driver
        .findElement(By.tagName("table"))
        .getText();
      const skipAccountChecks = ["email", "phone"];
      const billingAddress = user.accountInfo;

      commonFunctions.checkForValueInText(
        billingAddress,
        skipAccountChecks,
        billingAddressTableRows
      );

      commonFunctions.checkForValueInText(
        shippingAddress,
        [],
        billingAddressTableRows
      );
    });

    it("Click confirm and complete order", async function () {
      await driver.findElement(By.xpath("//a[text()='Confirm']")).click();
      await driver.wait(
        until.elementIsVisible(
          await driver.findElement(
            By.xpath("//li[text()='Thank you, your order has been submitted.']")
          )
        )
      );
      await driver.wait(until.urlContains("newOrder=&confirmed=true"));
    });

    it("Check order information displayed in order submitted page", async function () {
      const submittedOrderTable = await driver
        .findElement(By.tagName("table"))
        .getText();

      const skipAccountChecks = ["email", "phone"];
      const billingAddress = user.accountInfo;
      commonFunctions.checkForValueInText(
        billingAddress,
        skipAccountChecks,
        submittedOrderTable
      );

      commonFunctions.checkForValueInText(
        shippingAddress,
        [],
        submittedOrderTable
      );

      commonFunctions.checkForValueInText(
        paymentDetails,
        [],
        submittedOrderTable
      );

      commonFunctions.checkForValueInText(
        orderInfo.fish.koi.spotlessKoi,
        [],
        submittedOrderTable
      );
      commonFunctions.checkForValueInText(
        orderInfo.dogs.dalmation.spottedAdultFemaleDalmation,
        [],
        submittedOrderTable
      );
      commonFunctions.checkForValueInText(
        orderInfo.cats.manx.taillessManx,
        [],
        submittedOrderTable
      );

      expect(submittedOrderTable).to.have.string(
        ` $${expectedOrderTotalPrice}`
      );

      const orderIdAndDatetime = commonFunctions.getOrderIdAndDateTimeFromSubmittedOrderForm(
        submittedOrderTable
      );
      orderId = orderIdAndDatetime.orderId;
      orderDate = orderIdAndDatetime.orderDate;
      orderTime = orderIdAndDatetime.orderTime;
    });
  });

  describe("Sign in again to check the ordered information", function () {
    it("Sign out --> This will fail because 'Sign Out' link is not displayed in the page header after user registered their new account.", async function () {
      await commonFunctions.signout(driver);
    });

    it("Sign in again", async function () {
      await commonFunctions.moveToSignInPage(driver);
      await commonFunctions.signinWithValidAuthInfo(
        driver,
        user.userInfo.userId,
        user.userInfo.password
      );
    });

    it("Move to My Orders page", async function () {
      // Move to My Account page
      await driver.findElement(By.xpath("//a[text()='My Account']")).click();
      await driver.wait(until.urlContains("editAccountForm="));

      // Move to My Orders page
      await driver.findElement(By.xpath("//a[text()='My Orders']")).click();
      await driver.wait(until.urlContains("listOrders="));
      await driver.wait(
        until.elementIsVisible(
          await driver.findElement(By.xpath("//h2[text()='My Orders']"))
        )
      );
    });

    it("Check list in My Orders page --> This will fail because ordered time does not show its correct time(it always displayed as 12:00:00)", async function () {
      expect(
        await driver
          .findElement(
            By.xpath(
              `//a[text()='${orderId}']/parent::td/following-sibling::td[1]`
            )
          )
          .getText()
      ).to.have.string(`${orderDate} ${orderTime}`);
      expect(
        await driver
          .findElement(
            By.xpath(
              `//a[text()='${orderId}']/parent::td/following-sibling::td[2]`
            )
          )
          .getText()
      ).to.have.string(`$${expectedOrderTotalPrice}`);
    });

    it("Click Order ID and move to view ordered information page", async function () {
      await driver.findElement(By.xpath(`//a[text()='${orderId}']`)).click();
      await driver.wait(until.urlContains(`viewOrder=&orderId=${orderId}`));
    });

    it("Check order information in the past ordered information page", async function () {
      const orderDetailsTable = await driver
        .findElement(By.tagName("table"))
        .getText();

      const skipAccountChecks = ["email", "phone"];
      const billingAddress = user.accountInfo;
      commonFunctions.checkForValueInText(
        billingAddress,
        skipAccountChecks,
        orderDetailsTable
      );

      commonFunctions.checkForValueInText(
        shippingAddress,
        [],
        orderDetailsTable
      );

      commonFunctions.checkForValueInText(
        paymentDetails,
        [],
        orderDetailsTable
      );

      commonFunctions.checkForValueInText(
        orderInfo.fish.koi.spotlessKoi,
        [],
        orderDetailsTable
      );
      commonFunctions.checkForValueInText(
        orderInfo.dogs.dalmation.spottedAdultFemaleDalmation,
        [],
        orderDetailsTable
      );
      commonFunctions.checkForValueInText(
        orderInfo.cats.manx.taillessManx,
        [],
        orderDetailsTable
      );

      expect(orderDetailsTable).to.have.string(` $${expectedOrderTotalPrice}`);
    });
  });
});

describe("Register new user account page :: Input only User Information and click Save Account Information", function () {
  let driver;
  before(async function () {
    driver = new Builder().withCapabilities(Capabilities.chrome()).build();
    await commonFunctions.accessTopPage(driver);
    await commonFunctions.enterToStore(driver);
    await commonFunctions.moveToSignInPage(driver);
    await commonFunctions.moveToRegisterNewAccountPage(driver);
  });
  after(async function () {
    return driver.quit();
  });

  it("Input valid user information into the form", async function () {
    await commonFunctions.inputUserInfoInRegstrationPage(driver, user.userInfo);
  });

  it("Make the Account Information form emtpy", async function () {
    await driver
      .findElement(By.xpath("//input[@name='account.firstName']"))
      .clear();

    await driver
      .findElement(By.xpath("//input[@name='account.lastName']"))
      .clear();

    await driver
      .findElement(By.xpath("//input[@name='account.email']"))
      .clear();

    await driver
      .findElement(By.xpath("//input[@name='account.phone']"))
      .clear();

    await driver
      .findElement(By.xpath("//input[@name='account.address1']"))
      .clear();

    await driver
      .findElement(By.xpath("//input[@name='account.address2']"))
      .clear();

    await driver.findElement(By.xpath("//input[@name='account.city']")).clear();

    await driver
      .findElement(By.xpath("//input[@name='account.state']"))
      .clear();

    await driver.findElement(By.xpath("//input[@name='account.zip']")).clear();

    await driver
      .findElement(By.xpath("//input[@name='account.country']"))
      .clear();
  });

  it("Click save account infroamtion link and should not proceed to a next page --> This will fail(internal server error) because there's no input validation", async function () {
    await commonFunctions.clickSaveAccountInformationLink(driver);
    // wait for page to fully load
    await driver.wait(function () {
      return driver
        .executeScript("return document.readyState")
        .then(function (readyState) {
          return readyState === "complete";
        });
    });
    expect(await driver.getCurrentUrl()).to.have.string("newAccountForm=");
  });
});
