# UI_Test_March2021

This is the automated UI tests repository for testing [JPetStore page](https://petstore.octoperf.com/) as part of the Technical Assessments.

## Requirements

You will need the following tools to run the automated tests.

- Node.js: v12.13.0
- npm: v6.12.0

After cloning this repository run the following command in the repository folder to install the required libraries.

```
$ npm install
```

Note that the above operation should install chromedriver automatically.
If however you experience any issues please download chromedriver manually from https://chromedriver.storage.googleapis.com/index.html?path=89.0.4389.23/ and place the binary file in the repository's main folder.

## Run test

Run this command in the repository folder to perform the automated tests.

```
$ npm run test
```

## Notes for test cases that has the FAILED status result

1. Sign in again to check the ordered information
   - Sign out</br>
     <span style="color:lightblue">--> _This will fail because 'Sign Out' link is not displayed in the page header after the user has registered their new account._</span>
   - The order information displayed in My Orders page should be correct</br>
     <span style="color:lightblue">--> _This will fail because ordered time does not show its correct time(it is always displayed as 12:00:00)._</span>
1. Input only User Information with account information empty and try to register a new user account
   - Save the account information and verify that no page transition took place due to invalid user input</br>
     <span style="color:lightblue">--> _This will fail(internal server error) because there's no input validation._</span>
1. Negative value given to item quantity
   - Add the same item again and it should be added to the shopping cart</br>
     <span style="color:lightblue">--> _The same item cannot be added in the shopping cart anymore after the item's quantity is updated to a nagative value._</span>
1. Change user account password
   - Sign out and should succeed to sign in with the new password</br>
     <span style="color:lightblue">--> _This will fail because the password has not actually changed._</span>
   - User should fail to sign in with the old password</br>
     <span style="color:lightblue">--> _This will fail because the password has not actually changed and user can sign in with old password._</span>
1. Sign in and sign out with items in the shopping cart
   - Sign out and check the shopping cart. Items should remain in the cart.</br>
     <span style="color:lightblue">--> _This will fail because no items remains in the cart._</span>
   - Sign in again and check the shopping cart. Items should remain in the cart.</br>
     <span style="color:lightblue">--> _This will fail because no items remains in the cart._</span>
1. Input invalid Payment Details
   - Input invalid payment details and click continue. The page should not transition to the order final confirmation page due to invalid user input.</br>
     <span style="color:lightblue">--> _This will fail because the page transits to final confirmation page without validating user's invalid input values._</span>

## Bugs that were found

### Bugs that were found as part of automated testing as explained above

1. 'Sign In' link is displayed in the page header after the user has registered their new account. 'Sign Out' is expected to be displayed in the header.
1. Ordered time in the ordered list table is always displayed as '12:00:00' in My Orders page.
1. Internal Server Error occurs while registering a new user account page. This will occur when user register account with Account Information fields are empty.
1. User can remove item in the shopping cart by updating the item with a negative value in the quantity text area. After this, the same item cannot be added in the shopping cart.
1. Password cannot be changed from My Account page.
1. Items in the shopping cart disappears when user sign out. Items still won't be back in the shopping cart after user sign in again.
1. Internal Server Error occurs when user input string value in card number and invalid format of number in expiry date in the Payment Details page while checkout process.

### Bugs that were found during manual adhoc testing

1. Item page
   - Typo: Dalmation should be Dalmatian
   - Wrong images are used in Fish/Dogs/Cats product item pages.
1. Sign In page
   - Security issue. "j2ee" is automatically filled in the password text area.
   - On the login page the text "Username" is used whilst on the registration page the text "User ID" is used. This can be confusing for users as they may confused "Username" to be their "First Name" which is also on the registration page.
1. New account registration page
   - Internal Server Error occurs when registering a user when the same User ID already exists.
1. My Account page
   - Changes made in this page (password, Account Information and Profile Information) are not saved. This can be confirmed after signing out and signing in to the "My Account" page again.
   - The animal shown within "MyBanner" does not change when the user changes their Favorite Category.
   - The 'Japanese' option as part of the Language Preference does not seem to change the UI language to Japanese.
   - My List feature is not available in the page even after the user has enabled this feature. (Need to check the specification of this feature)
1. Shopping cart
   - Users can input and update the value of quantity to be larger than the maximum stock available.
1. Final Checkout page
   - The confirmation button on the page is "confirm" however the instructions at the top of the page uses the word "continue".
     > Please confirm the information below and then press **continue**...</br>
1. Help page
   - Some of the descriptions are wrong.
     - e.g. Searching the Catalog --> search field is not in the middle of the banner
       > You search for products by typing the product name in search field **in the middle of the banner**.

## Possible tests that can be performed but not created due to time constraints

1. Performance testing
2. Security testing
3. Testing with different types of browsers
