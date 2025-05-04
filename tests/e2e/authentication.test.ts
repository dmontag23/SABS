import {expect} from "detox";

describe("Authentication flow", () => {
  it("should be able to log in", async () => {
    // check the initial state of the login screen
    await expect(element(by.text("Sign into TodayTix"))).toBeVisible();
    await expect(
      element(
        by.text("Enter the access tokens from the current TodayTix session.")
      )
    ).toBeVisible();
    const accessTokenFormInput = element(
      by.label("Access token input")
    ).atIndex(1);
    await expect(accessTokenFormInput).toBeVisible();
    const refreshTokenFormInput = element(
      by.label("Refresh token input")
    ).atIndex(1);
    await expect(refreshTokenFormInput).toBeVisible();
    const loginButton = element(by.text("Login"));
    await expect(loginButton).toBeVisible();

    // enter valid access and refresh tokens
    await accessTokenFormInput.typeText("access-token");
    await refreshTokenFormInput.typeText("refresh-token");

    // login
    await loginButton.tap();
    await expect(element(by.text("Guys & Dolls"))).toBeVisible();
  });

  // TODO: Add or amend the above test to keep the user logged in by trying to make a request to an endpoint that requires auth
});
