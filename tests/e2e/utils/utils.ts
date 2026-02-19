import axios from "axios";

/* TODO: Maybe find a better way to do this? Testing the login functionality
for every test isn't great. Something like a deep link may work better, but
has other disadvantages. Perhaps exposing a way to do this from the mock server somehow
would be best? */
export const login = async () => {
  const accessTokenFormInput = element(by.label("Access token input"));
  await expect(accessTokenFormInput).toBeVisible();
  await accessTokenFormInput.typeText("access-token");
  await element(by.label("Refresh token input")).typeText("refresh-token");
  await element(by.text("Login")).tap();
};

export const clearAllMockServerData = async () =>
  await axios.delete(`${process.env.TODAY_TIX_API_BASE_URL}/clearAllData`);
