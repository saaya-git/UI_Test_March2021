const { expect } = require("chai");
const { By, until } = require("selenium-webdriver");
const { NoSuchElementError } = require("selenium-webdriver/lib/error");
const petStoreUrl = "https://petstore.octoperf.com";
const storeMainMenuUrl = `${petStoreUrl}/actions/Catalog.action`;

async function accessTopPage(driver) {
  await driver.get(petStoreUrl);
  expect(await driver.getTitle()).to.equal("JPetStore Demo");
  await driver.wait(
    until.elementIsVisible(
      await driver.findElement(By.linkText("Enter the Store"))
    )
  );
}

async function enterToStore(driver) {
  let linkToEnterStore = await driver.findElement(
    By.linkText("Enter the Store")
  );
  expect(await linkToEnterStore.isDisplayed()).to.be.true;
  await linkToEnterStore.click();
  await driver.wait(until.urlIs(storeMainMenuUrl));
}

async function moveToSpecifiedCatalogPage(
  driver,
  selectorOfMenuLink,
  categoryId
) {
  let categoryIdLink = await driver.findElement(By.css(selectorOfMenuLink));
  expect(await categoryIdLink.isDisplayed()).to.be.true;
  await categoryIdLink.click();
  await driver.wait(
    until.urlContains(`viewCategory=&categoryId=${categoryId}`)
  );
}

async function moveToProductPageFromCatalogPage(driver, productId) {
  let productIdLink = await driver.findElement(By.linkText(productId));
  expect(await productIdLink.isDisplayed()).to.be.true;
  await productIdLink.click();
  await driver.wait(until.urlContains(`viewProduct=&productId=${productId}`));
}

async function moveToItemPageFromProductPage(driver, itemId) {
  let itemIdLink = await driver.findElement(By.linkText(itemId));
  expect(await itemIdLink.isDisplayed()).to.be.true;
  await itemIdLink.click();
  await driver.wait(until.urlContains(`viewItem=&itemId=${itemId}`));
}

async function addItemToShoppingCart(driver, link, order) {
  await moveToSpecifiedCatalogPage(driver, link, order.category.id);
  await moveToProductPageFromCatalogPage(driver, order.product.id);
  await moveToItemPageFromProductPage(driver, order.item.id);

  let addToCartLink = await driver.findElement(By.linkText("Add to Cart"));
  expect(await addToCartLink.isDisplayed()).to.be.true;
  await addToCartLink.click();
  await driver.wait(until.urlContains(`${petStoreUrl}/actions/Cart.action`));
}

async function moveToShoppingCartPage(driver) {
  let shoppingCartLink = await driver.findElement(
    By.xpath("//img[@name='img_cart']")
  );
  expect(await shoppingCartLink.isDisplayed()).to.be.true;
  await shoppingCartLink.click();

  await driver.wait(until.urlContains(`${petStoreUrl}/actions/Cart.action`));
  expect(
    await driver.findElement(By.xpath("//*[@id='Cart']/h2")).getText()
  ).to.be.eql("Shopping Cart");
}

async function checkDisplayedItemIdAndQuantityInShoppingCart(
  driver,
  itemId,
  quantity
) {
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

async function checkDisplayedItemDetailsInShoppingCart(
  driver,
  order,
  totalPrice,
  rowText
) {
  expect(
    await driver.findElement(By.xpath("//*[@id='Cart']/h2")).getText()
  ).to.be.eql("Shopping Cart");

  expect(await driver.findElement(By.linkText(order.item.id)).isDisplayed()).to
    .be.true;
  expect(rowText).to.have.string(order.product.id);
  expect(
    await driver
      .findElement(By.xpath(`//input[@name='${order.item.id}']`))
      .getAttribute("value")
  ).to.be.eql(order.item.quantity.toString());
  expect(rowText).to.have.string(` $${totalPrice}`);
  checkForValueInText(order.item, ["quantity"], rowText);
}

async function proceedToCheckoutFromCart(driver) {
  expect(
    await driver.findElement(By.xpath("//*[@id='Cart']/h2")).getText()
  ).to.be.eql("Shopping Cart");

  let linkToProceedToCheckout = await driver.findElement(
    By.linkText("Proceed to Checkout")
  );
  expect(await linkToProceedToCheckout.isDisplayed()).to.be.true;
  await linkToProceedToCheckout.click();
}

async function moveToRegisterNewAccountPage(driver) {
  let linkToRegisterNow = await driver.findElement(
    By.linkText("Register Now!")
  );
  expect(await linkToRegisterNow.isDisplayed()).to.be.true;
  await linkToRegisterNow.click();
  await driver.wait(until.urlContains("newAccountForm="));
}

async function inputUserInfoInRegstrationPage(driver, userInfoObject) {
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

async function inputAccountInfoInRegstrationPage(driver, accountInfoObject) {
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

async function inputProfileInfoInRegstrationPage(driver, profileInfoObject) {
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

async function clickSaveAccountInformationLinkForCreatingNewAccount(driver) {
  let saveAccountInfoLink = await driver.findElement(
    By.xpath("//input[@name='newAccount']")
  );
  expect(await saveAccountInfoLink.isDisplayed()).to.be.true;
  await saveAccountInfoLink.click();
}

async function clickSaveAccountInformationLinkForEditingAccount(driver) {
  let saveAccountInfoLink = await driver.findElement(
    By.xpath("//input[@name='editAccount']")
  );
  expect(await saveAccountInfoLink.isDisplayed()).to.be.true;
  await saveAccountInfoLink.click();
}

async function inputPaymentDetails(driver, paymentDetailsObject) {
  let cardTypeDropdown = await driver.findElement(
    By.xpath(
      `//select[@name='order.cardType']/option[text()='${paymentDetailsObject.cardType}']`
    )
  );
  await cardTypeDropdown.click();
  expect(await cardTypeDropdown.isSelected()).to.be.true;

  let cardNumberTextArea = await driver.findElement(
    By.xpath("//input[@name='order.creditCard']")
  );
  cardNumberTextArea.clear();
  cardNumberTextArea.sendKeys(paymentDetailsObject.cardNumber);

  let expiryDateTextArea = await driver.findElement(
    By.xpath("//input[@name='order.expiryDate']")
  );
  expiryDateTextArea.clear();
  expiryDateTextArea.sendKeys(paymentDetailsObject.expiryDate);
}

async function checkBillingAddressIsSameWithAccountInfo(
  driver,
  accountInfoObject
) {
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

async function checkShippingAddressIsSameWithAccountInfo(
  driver,
  accountInfoObject
) {
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

async function inputShippingAddress(driver, shippingAddressObject) {
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

function checkForValueInText(objectToCheck, skipChecks, rowsText) {
  let objectKey;
  for (objectKey in objectToCheck) {
    if (skipChecks.includes(objectKey)) {
      continue;
    }

    if ("price" == objectKey) {
      expect(rowsText).to.have.string(` $${objectToCheck[objectKey]}`);
    } else if ("id" == objectKey) {
      expect(rowsText).to.have.string(`${objectToCheck[objectKey]}`);
    } else {
      expect(rowsText).to.have.string(` ${objectToCheck[objectKey]}`);
    }
  }
}

function getOrderIdAndDateTimeFromSubmittedOrderForm(rowsText) {
  const orderInfo = rowsText.split("\n")[0];
  return {
    orderId: orderInfo.split(" ")[1].substring(1),
    orderDate: orderInfo.split(" ")[2],
    orderTime: orderInfo.split(" ")[3],
  };
}

async function signout(driver) {
  await driver.findElement(By.xpath("//a[text()='Sign Out']")).click();
  await driver.wait(
    until.elementIsVisible(
      await driver.findElement(By.xpath("//a[text()='Sign In']"))
    )
  );
  await driver
    .findElement(By.xpath("//a[text()='My Account']"))
    .then(null, function (err) {
      expect(err.name).to.be.eql(NoSuchElementError.name);
    });
  await driver.wait(until.urlIs(storeMainMenuUrl));
}

async function moveToSigninPage(driver) {
  await driver.findElement(By.xpath("//a[text()='Sign In']")).click();
  await driver.wait(until.urlContains("signonForm="));
}

async function signinWithValidUsernameAndPassword(driver, username, password) {
  expect(await driver.getCurrentUrl()).to.have.string("signonForm=");

  let usernameTextArea = await driver.findElement(
    By.xpath("//input[@name='username']")
  );
  usernameTextArea.clear();
  usernameTextArea.sendKeys(username);

  let passwordTextArea = await driver.findElement(
    By.xpath("//input[@name='password']")
  );
  passwordTextArea.clear();
  passwordTextArea.sendKeys(password);

  await driver.findElement(By.xpath("//input[@name='signon']")).click();

  await driver.wait(
    until.elementIsVisible(
      await driver.findElement(By.xpath("//a[text()='Sign Out']"))
    )
  );
  await driver.wait(
    until.elementIsVisible(
      await driver.findElement(By.xpath("//a[text()='My Account']"))
    )
  );
  await driver.wait(until.urlIs(storeMainMenuUrl));
}

async function moveToMyAccountPage(driver) {
  await driver.findElement(By.xpath("//a[text()='My Account']")).click();
  await driver.wait(until.urlContains("editAccountForm="));
}

module.exports = {
  accessTopPage: accessTopPage,
  enterToStore: enterToStore,
  moveToSpecifiedCatalogPage: moveToSpecifiedCatalogPage,
  moveToProductPageFromCatalogPage: moveToProductPageFromCatalogPage,
  moveToItemPageFromProductPage: moveToItemPageFromProductPage,
  addItemToShoppingCart: addItemToShoppingCart,
  moveToShoppingCartPage: moveToShoppingCartPage,
  checkDisplayedItemIdAndQuantityInShoppingCart: checkDisplayedItemIdAndQuantityInShoppingCart,
  checkDisplayedItemDetailsInShoppingCart: checkDisplayedItemDetailsInShoppingCart,
  proceedToCheckoutFromCart: proceedToCheckoutFromCart,
  moveToRegisterNewAccountPage: moveToRegisterNewAccountPage,
  inputUserInfoInRegstrationPage: inputUserInfoInRegstrationPage,
  inputAccountInfoInRegstrationPage: inputAccountInfoInRegstrationPage,
  inputProfileInfoInRegstrationPage: inputProfileInfoInRegstrationPage,
  clickSaveAccountInformationLinkForCreatingNewAccount: clickSaveAccountInformationLinkForCreatingNewAccount,
  clickSaveAccountInformationLinkForEditingAccount: clickSaveAccountInformationLinkForEditingAccount,
  inputPaymentDetails: inputPaymentDetails,
  checkBillingAddressIsSameWithAccountInfo: checkBillingAddressIsSameWithAccountInfo,
  checkShippingAddressIsSameWithAccountInfo: checkShippingAddressIsSameWithAccountInfo,
  inputShippingAddress: inputShippingAddress,
  checkForValueInText: checkForValueInText,
  getOrderIdAndDateTimeFromSubmittedOrderForm: getOrderIdAndDateTimeFromSubmittedOrderForm,
  signout: signout,
  moveToSigninPage: moveToSigninPage,
  signinWithValidUsernameAndPassword: signinWithValidUsernameAndPassword,
  moveToMyAccountPage: moveToMyAccountPage,
};
