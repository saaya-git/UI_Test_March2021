const { Builder, By, until, Capabilities } = require("selenium-webdriver");
const { expect } = require("chai");

const commonFunctions = require("./common_functions.js");

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

describe("Successful End-to-end customer journey of purchasing 3 Products", function () {
  const orders = {
    order1: {
      category: {
        id: "FISH",
      },
      product: {
        name: "Koi",
        id: "FI-FW-01",
      },
      item: {
        name: "Spotless Koi",
        id: "EST-5",
        quantity: 1,
        price: 18.5,
      },
    },
    order2: {
      category: {
        id: "DOGS",
      },
      product: {
        name: "Dalmation",
        id: "K9-DL-01",
      },
      item: {
        name: "Spotted Adult Female Dalmation",
        id: "EST-10",
        quantity: 1,
        price: 18.5,
      },
    },
    order3: {
      category: {
        id: "CATS",
      },
      product: {
        name: "Manx",
        id: "FL-DSH-01",
      },
      item: {
        name: "Tailless Manx",
        id: "EST-14",
        quantity: 1,
        price: 58.5,
      },
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
  const storeMainMenuUrl = "https://petstore.octoperf.com/actions/Catalog.action";
  let driver;
  let orderId;
  let orderDate;
  let orderTime;
  let expectedOrderTotalPrice;

  before(async function () {
    driver = new Builder().withCapabilities(Capabilities.chrome()).build();
    expectedOrderTotalPrice =
      orders.order1.item.price * orders.order1.item.quantity +
      orders.order2.item.price * orders.order2.item.quantity +
      orders.order3.item.price * orders.order3.item.quantity;
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

  describe("Add orders into shopping cart", function () {
    it("Add one Spotless Koi to shopping cart", async function () {
      await commonFunctions.addItemToShoppingCart(
        driver,
        "#QuickLinks > a:nth-child(1) > img",
        orders.order1
      );
    });

    it("Check Spotless Koi has added to cart", async function () {
      await commonFunctions.checkDisplayedItemIdAndQuantityInShoppingCart(
        driver,
        orders.order1.item.id,
        orders.order1.item.quantity
      );
    });

    it("Add one Spotted Adult Female Dalmation to shopping cart", async function () {
      await commonFunctions.addItemToShoppingCart(
        driver,
        "#QuickLinks > a:nth-child(3) > img",
        orders.order2
      );
    });

    it("Check Spotted Adult Female Dalmation has added to cart", async function () {
      await commonFunctions.checkDisplayedItemIdAndQuantityInShoppingCart(
        driver,
        orders.order2.item.id,
        orders.order2.item.quantity
      );
    });

    it("Add one Tailless Manx to shopping cart", async function () {
      await commonFunctions.addItemToShoppingCart(
        driver,
        "#QuickLinks > a:nth-child(7) > img",
        orders.order3
      );
    });

    it("Check Tailless Manx has added to cart", async function () {
      await commonFunctions.checkDisplayedItemIdAndQuantityInShoppingCart(
        driver,
        orders.order3.item.id,
        orders.order3.item.quantity
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
      await commonFunctions.clickSaveAccountInformationLinkForCreatingNewAccount(
        driver
      );
      await driver.wait(until.urlContains(storeMainMenuUrl));
    });
  });

  describe("Proceed to checkout again from shopping cart and complete the order", function () {
    it("Proceed to Checkout again from shopping cart", async function () {
      await commonFunctions.moveToShoppingCartPage(driver);

      const itemsInCartTable = await driver
        .findElement(By.tagName("table"))
        .getText();
      await commonFunctions.checkDisplayedItemDetailsInShoppingCart(
        driver,
        orders.order1,
        expectedOrderTotalPrice,
        itemsInCartTable
      );
      await commonFunctions.checkDisplayedItemDetailsInShoppingCart(
        driver,
        orders.order2,
        expectedOrderTotalPrice,
        itemsInCartTable
      );
      await commonFunctions.checkDisplayedItemDetailsInShoppingCart(
        driver,
        orders.order3,
        expectedOrderTotalPrice,
        itemsInCartTable
      );

      await commonFunctions.proceedToCheckoutFromCart(driver);
      await driver.wait(
        until.elementIsVisible(
          await driver.findElement(
            By.xpath("//th[@colspan='2'][text()='Payment Details']")
          )
        )
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
      await driver
        .findElement(By.xpath("//a[@class='Button'][text()='Confirm']"))
        .click();
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
        orders.order1.item,
        [],
        submittedOrderTable
      );
      commonFunctions.checkForValueInText(
        orders.order2.item,
        [],
        submittedOrderTable
      );
      commonFunctions.checkForValueInText(
        orders.order3.item,
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
      await commonFunctions.moveToMyAccountPage(driver);

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
        orders.order1.item,
        [],
        orderDetailsTable
      );
      commonFunctions.checkForValueInText(
        orders.order2.item,
        [],
        orderDetailsTable
      );
      commonFunctions.checkForValueInText(
        orders.order3.item,
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
    await commonFunctions.clickSaveAccountInformationLinkForCreatingNewAccount(
      driver
    );
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

describe("Update oder item quantity to outside boundary value", function () {
  let driver;
  const order = {
    category: {
      id: "REPTILES",
    },
    product: {
      id: "RP-LI-02",
      name: "Iguana",
    },
    item: {
      id: "EST-13",
      name: "Green Adult Iguana",
      quantity: 1,
      price: 18.5,
    },
  };

  before(async function () {
    driver = new Builder().withCapabilities(Capabilities.chrome()).build();
    await commonFunctions.accessTopPage(driver);
    await commonFunctions.enterToStore(driver);
    await commonFunctions.addItemToShoppingCart(
      driver,
      "#QuickLinks > a:nth-child(5) > img",
      order
    );
    await commonFunctions.checkDisplayedItemIdAndQuantityInShoppingCart(
      driver,
      order.item.id,
      order.item.quantity
    );
  });

  after(async function () {
    return driver.quit();
  });

  it("Update item quantity to -1 in shopping cart and item should be removed from cart", async function () {
    let itemQuantityTextArea = await driver.findElement(
      By.xpath(`//input[@name='${order.item.id}']`)
    );
    await itemQuantityTextArea.clear();
    await itemQuantityTextArea.sendKeys("-1");

    await driver
      .findElement(
        By.xpath("//input[@name='updateCartQuantities'][@value='Update Cart']")
      )
      .click();
    await driver.wait(
      until.elementIsVisible(
        await driver.findElement(
          By.xpath("//td/b[contains(text(),'Your cart is empty.')]")
        )
      )
    );
  });

  it("Add the same item again and it should be added to shopping cart --> This will fail because there's a bug with handling or validating outside boundary value", async function () {
    await commonFunctions.addItemToShoppingCart(
      driver,
      "#QuickLinks > a:nth-child(5) > img",
      order
    );
    await commonFunctions.checkDisplayedItemIdAndQuantityInShoppingCart(
      driver,
      order.item.id,
      order.item.quantity
    );
  });
});

describe("Change user account password", function () {
  let driver;
  let newPassword = "newPassword!";

  before(async function () {
    driver = new Builder().withCapabilities(Capabilities.chrome()).build();
    await commonFunctions.accessTopPage(driver);
    await commonFunctions.enterToStore(driver);
  });

  after(async function () {
    return driver.quit();
  });

  it("Sign in with current username/password and should be able to sign in", async function () {
    await commonFunctions.moveToSignInPage(driver);
    await commonFunctions.signinWithValidAuthInfo(
      driver,
      user.userInfo.userId,
      user.userInfo.password
    );
  });

  it("Change password from My Account page and should be able to change it successfully", async function () {
    await commonFunctions.moveToMyAccountPage(driver);
    await driver
      .findElement(By.xpath("//input[@name='password']"))
      .sendKeys(newPassword);

    await driver
      .findElement(By.xpath("//input[@name='repeatedPassword']"))
      .sendKeys(newPassword);

    await commonFunctions.clickSaveAccountInformationLinkForEditingAccount(
      driver
    );
  });

  it("Signout and sign in with new password and it should success --> This will fail because the password has not actually changed", async function () {
    await commonFunctions.signout(driver);
    await commonFunctions.moveToSignInPage(driver);
    await commonFunctions.signinWithValidAuthInfo(
      driver,
      user.userInfo.userId,
      newPassword
    );
  });

  it("Sign in with old password and user should failed to sign on.", async function () {
    await commonFunctions.moveToSignInPage(driver);
    await commonFunctions
      .signinWithValidAuthInfo(
        driver,
        user.userInfo.userId,
        user.userInfo.password
      )
      .then(
        function () {
          // when user sign in successfully
          expect.fail(
            "Failed because user suceeded to sign on with the old password."
          );
        },
        async function () {
          // when sign on failed
          await driver.wait(
            until.elementIsVisible(
              await driver.findElement(
                "//li[text()='Invalid username or password.  Signon failed.']"
              )
            )
          );
        }
      );
  });
});

describe("Sign in and sign out with items in the shopping cart", function () {
  const order = {
    category: {
      id: "BIRDS",
    },
    product: {
      id: "AV-SB-02",
      name: "Finch",
    },
    item: {
      id: "EST-19",
      name: "Adult Male Finch",
      quantity: 2,
      price: 15.5,
    },
  };
  let driver;
  let expectedOrderTotalPrice;

  before(async function () {
    driver = new Builder().withCapabilities(Capabilities.chrome()).build();
    expectedOrderTotalPrice = order.item.price * order.item.quantity;
    await commonFunctions.accessTopPage(driver);
    await commonFunctions.enterToStore(driver);
  });

  after(async function () {
    return driver.quit();
  });

  it("Add items to shopping cart", async function () {
    var i;
    for (i = 1; i <= order.item.quantity; i++) {
      await commonFunctions.addItemToShoppingCart(
        driver,
        "#QuickLinks > a:nth-child(9) > img",
        order
      );
      await commonFunctions.checkDisplayedItemIdAndQuantityInShoppingCart(
        driver,
        order.item.id,
        i
      );
    }
  });

  it("Sign in and check the shopping cart. Items should be in the cart.", async function () {
    await commonFunctions.moveToSignInPage(driver);
    await commonFunctions.signinWithValidAuthInfo(
      driver,
      user.userInfo.userId,
      user.userInfo.password
    );
    await commonFunctions.moveToShoppingCartPage(driver);

    const itemsInCartTable = await driver
      .findElement(By.tagName("table"))
      .getText();

    await commonFunctions.checkDisplayedItemDetailsInShoppingCart(
      driver,
      order,
      expectedOrderTotalPrice,
      itemsInCartTable
    );
  });

  it("Sign out and check the shopping cart. Items should be in the cart. --> This will fail because no items remains in the cart.", async function () {
    await commonFunctions.signout(driver);
    await commonFunctions.moveToShoppingCartPage(driver);

    const itemsInCartTable = await driver
      .findElement(By.tagName("table"))
      .getText();

    await commonFunctions.checkDisplayedItemDetailsInShoppingCart(
      driver,
      order,
      expectedOrderTotalPrice,
      itemsInCartTable
    );
  });

  it("Sign in again and check the shopping cart. Items should be in the cart. --> This will fail because no items remains in the cart.", async function () {
    await commonFunctions.moveToSignInPage(driver);
    await commonFunctions.signinWithValidAuthInfo(
      driver,
      user.userInfo.userId,
      user.userInfo.password
    );
    await commonFunctions.moveToShoppingCartPage(driver);

    const itemsInCartTable = await driver
      .findElement(By.tagName("table"))
      .getText();

    await commonFunctions.checkDisplayedItemDetailsInShoppingCart(
      driver,
      order,
      expectedOrderTotalPrice,
      itemsInCartTable
    );
  });
});

describe("Input invalid Payment Details", function () {
  let driver;
  const order = {
    category: {
      id: "REPTILES",
    },
    product: {
      id: "RP-SN-01",
      name: "Rattlesnake",
    },
    item: {
      id: "EST-11",
      name: "Venomless Rattlesnake",
      quantity: 1,
      price: 18.5,
    },
  };
  const invalidPaymentDetails = {
    cardType: "American Express",
    cardNumber: "ABCDEFGHIJK",
    expiryDate: "123456789",
  };

  before(async function () {
    driver = new Builder().withCapabilities(Capabilities.chrome()).build();
    await commonFunctions.accessTopPage(driver);
    await commonFunctions.enterToStore(driver);
  });

  after(async function () {
    return driver.quit();
  });

  it("Sign in and add item to shopping cart", async function () {
    // Sign in
    await commonFunctions.moveToSignInPage(driver);
    await commonFunctions.signinWithValidAuthInfo(
      driver,
      user.userInfo.userId,
      user.userInfo.password
    );

    // Add item to cart
    await commonFunctions.addItemToShoppingCart(
      driver,
      "#QuickLinks > a:nth-child(5) > img",
      order
    );
    await commonFunctions.checkDisplayedItemIdAndQuantityInShoppingCart(
      driver,
      order.item.id,
      order.item.quantity
    );
  });

  it("Proceed to checkout", async function () {
    await commonFunctions.proceedToCheckoutFromCart(driver);
    await driver.wait(
      until.elementIsVisible(
        await driver.findElement(
          By.xpath("//th[@colspan='2'][text()='Payment Details']")
        )
      )
    );
  });

  it("Input invalid payment details and click continue. The page should not transit to the order final confirmation page.", async function () {
    // Input invalid card number and expiry date in payment details form
    await commonFunctions.inputPaymentDetailsToOrderItems(
      driver,
      invalidPaymentDetails
    );

    // Click to continue
    await driver
      .findElement(
        By.xpath("//input[@type='submit'][@name='newOrder'][@value='Continue']")
      )
      .click();
    await driver
      .wait(
        until.elementIsVisible(
          await driver.findElement(
            By.xpath(
              "//div[@id='Catalog'][contains(text(),'Please confirm the information below and then')]"
            )
          )
        )
      )
      .then(
        function () {
          // when page transit successfully
          expect.fail(
            "Failed because the page transit to order final confirmation page without validating user invalid input values."
          );
        },
        async function () {
          // when page failed to transit, check the page remains in the same page
          await driver.wait(
            until.elementIsVisible(
              await driver.findElement(
                By.xpath("//th[@colspan='2'][text()='Payment Details']")
              )
            )
          );
        }
      );
  });
});
