import {expect} from "detox";

import {login} from "./utils/utils";

describe("Rush shows", () => {
  beforeEach(login);

  it("can see the expected shows", async () => {
    // check the initial state of the email screen
    await expect(element(by.text("Hamilton"))).not.toBeVisible();
    await expect(element(by.text("Guys & Dolls"))).toBeVisible();
    await expect(element(by.text("SIX the Musical"))).toBeVisible();

    const penultimateShowName = element(by.text("Tina"));
    const finalShowName = element(by.text("Wicked"));
    await expect(penultimateShowName).not.toBeVisible();
    await expect(finalShowName).not.toBeVisible();

    await element(by.id("rushShows")).scroll(400, "down");
    await expect(penultimateShowName).toBeVisible();
    await expect(finalShowName).toBeVisible();
  });

  it("can select a show and number of tickets", async () => {
    await expect(
      element(by.text("Rush is not unlocked for this show.")).atIndex(0)
    ).not.toBeVisible();
    // select the showtime in the distant future
    const guysAndDollsText = element(by.text("Guys & Dolls"));
    await guysAndDollsText.tap();
    await expect(guysAndDollsText).toBeVisible();
    const selectATimeText = element(by.text("Select a Time"));
    await expect(selectATimeText).toBeVisible();
    const futureShowtime = element(by.text("23:59"));
    await expect(futureShowtime).toBeVisible();
    await expect(element(by.text("19:30"))).toBeVisible();
    const numberOfTicketText = element(by.text("Number of Tickets"));
    await expect(numberOfTicketText).not.toBeVisible();

    // select the number of desired tickets
    await futureShowtime.tap();
    await expect(numberOfTicketText).toBeVisible();
    const ticketButton = element(by.text("1"));
    await expect(ticketButton).toBeVisible();
    await expect(element(by.text("2"))).toBeVisible();
    await ticketButton.tap();

    // navigate to a different show
    const backButton = element(by.label("Back button")).atIndex(1);
    await backButton.tap();
    await element(by.label("SIX the Musical")).tap();
    await expect(selectATimeText).toBeVisible();
    await expect(element(by.text("19:00"))).toBeVisible();
    await expect(numberOfTicketText).not.toBeVisible();

    // navigate back to the original show and ensure the original selection remains
    await backButton.tap();
    await guysAndDollsText.tap();
    await element(by.text("Cancel")).swipe("down");
    await expect(numberOfTicketText).toBeVisible();
  });
});
