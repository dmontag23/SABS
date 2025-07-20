import axios from "axios";
import { expect } from "detox";

import { login } from "./utils/utils";

describe("Holds", () => {
  beforeEach(login);

  it("can place a hold for a show where tickets are already open", async () => {
    // select a showtime that is already open
    await expect(
      element(by.text("Rush is not unlocked for this show.")).atIndex(0)
    ).not.toBeVisible();

    await element(by.text("Guys & Dolls")).tap();
    const selectATimeText = element(by.text("Select a Time"));
    await expect(selectATimeText).toBeVisible();
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
    const sixShow = element(by.label("SIX the Musical"));
    await expect(sixShow).toBeVisible();
    await expect(holdConfirmationText).toBeVisible();
    await expect(detailsText).not.toBeVisible();

    // navigate to a new show and check the modal is still minimized and buttons disabled
    await sixShow.tap();
    await expect(selectATimeText).toBeVisible();
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
    await expect(
      element(by.text("Rush is not unlocked for this show.")).atIndex(0)
    ).not.toBeVisible();
    // select a showtime that is already open
    await element(by.text("Guys & Dolls")).tap();
    await expect(element(by.text("Select a Time"))).toBeVisible();
    const showtime = element(by.text("19:30"));
    await expect(showtime).toBeVisible();
    await showtime.tap();
    const oneTicket = element(by.text("1"));
    await expect(oneTicket).toBeVisible();
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
    await expect(
      element(by.text("Rush is not unlocked for this show.")).atIndex(0)
    ).not.toBeVisible();
    // select a showtime that is already open
    await element(by.text("Guys & Dolls")).tap();
    await expect(element(by.text("Select a Time"))).toBeVisible();
    await element(by.text("19:30")).tap();
    const oneTicket = element(by.text("1"));
    await expect(oneTicket).toBeVisible();
    await oneTicket.tap();
    const headerText = element(
      by.text("You've won 1 ticket to Guys & Dolls 🎉")
    );
    await expect(headerText).toBeVisible();

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
    await expect(
      element(by.text("Rush is not unlocked for this show.")).atIndex(0)
    ).not.toBeVisible();

    // select a showtime that is shadow blocked
    await element(by.text("SIX the Musical")).tap();
    await expect(element(by.text("Select a Time"))).toBeVisible();
    const showtime = element(by.text("19:00"));
    await showtime.tap();
    await element(by.text("1")).tap();
    const shadowBlockedHeaderText = element(
      by.text("You've been shadow blocked!")
    );
    await expect(shadowBlockedHeaderText).toBeVisible();
    await expect(
      element(
        by.text(
          "TodayTix is putting you at the back of the queue. You can try to get tickets again, but you will only get them if someone else does not ask for them too. Please create a new TodayTix account to ensure you get tickets."
        )
      )
    ).toBeVisible();
    const retryButton = element(by.text("Retry"));
    await expect(retryButton).toBeVisible();
    await retryButton.tap();
    await expect(shadowBlockedHeaderText).toBeVisible();
    await shadowBlockedHeaderText.swipe("down");

    // select a showtime that has all tickets currently reserved
    await element(by.text("2")).tap();
    const errorHeaderMessage = element(
      by.text("Error getting tickets to SIX the Musical")
    );
    await expect(errorHeaderMessage).toBeVisible();
    await expect(
      element(
        by.text(
          "Sorry, all remaining tickets are currently being held by other customers. Please try again later."
        )
      )
    ).toBeVisible();
    await expect(retryButton).toBeVisible();
    await retryButton.tap();
    await expect(errorHeaderMessage).toBeVisible();
    await showtime.tap();
    await expect(errorHeaderMessage).not.toBeVisible();
  });

  it("can cancel hold", async () => {
    await expect(
      element(by.text("Rush is not unlocked for this show.")).atIndex(0)
    ).not.toBeVisible();
    // select a showtime that is not open
    await element(by.text("Guys & Dolls")).tap();
    await expect(element(by.text("Select a Time"))).toBeVisible();
    await element(by.text("23:59")).tap();
    const oneTicket = element(by.text("1"));
    await expect(oneTicket).toBeVisible();
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
    await expect(
      element(by.text("Rush is not unlocked for this show.")).atIndex(0)
    ).not.toBeVisible();
    // select a showtime that is already open
    await element(by.text("Guys & Dolls")).tap();
    const selectATimeText = element(by.text("Select a Time"));
    await expect(selectATimeText).toBeVisible();
    await element(by.text("19:30")).tap();
    const oneTicket = element(by.text("1"));
    await expect(oneTicket).toBeVisible();
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
    await expect(selectATimeText).toBeVisible();
    await expect(headerText).not.toBeVisible();
  });
});
