import {beforeEach, describe, it} from "@jest/globals";
import axios from "axios";
import {expect, waitFor} from "detox";

import {login} from "./utils/utils";

describe("Holds", () => {
  beforeEach(login);

  it("can place a hold for a show where tickets are already open", async () => {
    // select a showtime that is already open
    await element(by.text("Guys & Dolls")).tap();
    const showtime = element(by.text("19:30"));
    const ticketNumber = element(by.text("1"));
    await showtime.tap();
    await ticketNumber.tap();
    const holdConfirmationText = element(
      by.text("You've won 1 ticket to Guys & Dolls 🎉")
    );
    const detailsText = element(by.text("Seats"));
    await expect(holdConfirmationText).toBeVisible();
    await expect(detailsText).toBeVisible();
    await expect(element(by.text("Dress Circle"))).toBeVisible();
    await expect(element(by.text("Row J, Seat 28"))).toBeVisible();
    await expect(element(by.text("Order Total"))).toBeVisible();
    await expect(element(by.text("£29.50"))).toBeVisible();
    await expect(
      element(
        by.text(
          "IMPORTANT: Hard-close the TodayTix app before pressing the Purchase button!"
        )
      )
    ).toBeVisible();
    await expect(element(by.text("Purchase on TodayTix"))).toBeVisible();
    await expect(element(by.text("Release tickets"))).toBeVisible();

    // check that you can close the modal
    await holdConfirmationText.swipe("down");
    await expect(holdConfirmationText).toBeVisible();
    await expect(detailsText).not.toBeVisible();

    // check that the buttons to select a show are disabled
    for (const buttonText of ["23:59", "19:30", "1", "2"]) {
      await expect(
        element(
          by.text(buttonText).withAncestor(by.traits(["button", "notEnabled"]))
        )
      ).toExist();
    }

    // ensure the modal stays minimized when navigating between screens
    await element(by.label("Back button")).atIndex(1).tap();
    await expect(holdConfirmationText).toBeVisible();
    await expect(detailsText).not.toBeVisible();

    // navigate to a new show and check the modal is still minimized and buttons disabled
    await element(by.label("SIX the Musical")).tap();
    await expect(holdConfirmationText).toBeVisible();
    await expect(detailsText).not.toBeVisible();
    await expect(
      element(
        by.text("19:00").withAncestor(by.traits(["button", "notEnabled"]))
      )
    ).toExist();

    // re-enlarge the modal
    await holdConfirmationText.swipe("up");
    await expect(detailsText).toBeVisible();
  });

  it("can purchase tickets on TodayTix", async () => {
    // select a showtime that is already open
    await element(by.text("Guys & Dolls")).tap();
    const showtime = element(by.text("19:30"));
    await waitFor(showtime).toBeVisible().withTimeout(20000);
    await showtime.tap();
    await element(by.text("19:30")).tap();
    const oneTicket = element(by.text("1"));
    await waitFor(oneTicket).toBeVisible().withTimeout(30000);
    await oneTicket.tap();
    await expect(
      element(by.text("You've won 1 ticket to Guys & Dolls 🎉"))
    ).toBeVisible();
    const purchaseTicketsButton = element(by.text("Purchase on TodayTix"));
    await expect(purchaseTicketsButton).toBeVisible();
    await purchaseTicketsButton.tap();
    // TODO: maybe mock the Linking module here and test that openURL was called?
  });

  it("can release tickets", async () => {
    // select a showtime that is already open
    await element(by.text("Guys & Dolls")).tap();
    await waitFor(element(by.text("Select a Time")))
      .toBeVisible()
      .withTimeout(20000);
    await element(by.text("19:30")).tap();
    const oneTicket = element(by.text("1"));
    await waitFor(oneTicket).toBeVisible().withTimeout(10000);
    await oneTicket.tap();
    const headerText = element(
      by.text("You've won 1 ticket to Guys & Dolls 🎉")
    );
    await waitFor(headerText).toBeVisible().withTimeout(20000);

    // release tickets via the hold confirmation modal
    const releaseTicketsButton = element(by.text("Release tickets"));
    await expect(releaseTicketsButton).toBeVisible();
    await releaseTicketsButton.tap();
    await expect(headerText).not.toBeVisible();

    // re-reserve the tickets
    await element(by.text("19:30")).tap();
    await element(by.text("1")).tap();
    await expect(headerText).toBeVisible();
  });

  it("can attempt to get tickets again if all tickets are currently reserved", async () => {
    // select a showtime that has all tickets currently reserved
    await element(by.text("SIX the Musical")).tap();
    const showtime = element(by.text("19:00"));
    await showtime.tap();
    await element(by.text("2")).tap();

    // retry the request for tickets
    const errorMessage = element(
      by.text(
        "Oh no! There was an error getting tickets to SIX the Musical:\nSorry, all remaining tickets are currently being held by other customers. Please try again later."
      )
    );
    await expect(errorMessage).toBeVisible();
    const retryButton = element(by.text("Retry"));
    await expect(retryButton).toBeVisible();
    await retryButton.tap();
    await expect(errorMessage).toBeVisible();
    await showtime.tap();
    await expect(errorMessage).not.toBeVisible();
  });

  it("can cancel hold", async () => {
    // select a showtime that is not open
    await element(by.text("Guys & Dolls")).tap();
    await element(by.text("23:59")).tap();
    const oneTicket = element(by.text("1"));
    await waitFor(oneTicket).toBeVisible().withTimeout(20000);
    await oneTicket.tap();
    // TODO: Somehow fix the time for the e2e tests to test the countdown timer?
    const guysAndDolls1Ticket = element(
      by.text(/Attempting to get 1 ticket for Guys & Dolls in (.*)/)
    );
    await expect(guysAndDolls1Ticket).toBeVisible();

    // cancel by selecting the cancel button
    const cancelButton = element(by.text("Cancel"));
    await expect(cancelButton).toBeVisible();
    await cancelButton.tap();
    await expect(guysAndDolls1Ticket).not.toBeVisible();

    // cancel by selecting a new showtime
    await element(by.text("23:59")).tap();
    await element(by.text("2")).tap();
    const guysAndDolls2Tickets = element(
      by.text(/Attempting to get 2 tickets for Guys & Dolls in (.*)/)
    );
    await expect(guysAndDolls2Tickets).toBeVisible();
    await element(by.text("23:59")).tap();
    await expect(guysAndDolls2Tickets).not.toBeVisible();
  });

  it("re-fetches holds when the app is brought into the foreground", async () => {
    // select a showtime that is already open
    await element(by.text("Guys & Dolls")).tap();
    await element(by.text("19:30")).tap();
    const oneTicket = element(by.text("1"));
    await waitFor(oneTicket).toBeVisible().withTimeout(30000);
    await oneTicket.tap();
    const headerText = element(
      by.text("You've won 1 ticket to Guys & Dolls 🎉")
    );
    await expect(headerText).toBeVisible();

    // send the app to the background and release the tickets via the API
    await device.sendToHome();
    await axios.delete(
      `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}/holds/75088671`
    );

    // check that, when bringing the app to the foreground, the hold is no longer visible
    await device.launchApp();
    await expect(element(by.text("Select a Time"))).toBeVisible();
    await expect(headerText).not.toBeVisible();
  });
});
