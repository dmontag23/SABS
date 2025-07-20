import { Router } from "express";

import { getItemFromStore, writeItemToStore } from "./utils";

import {
  TodayTixAPIv2ErrorResponse,
  TodayTixAPIv2Response
} from "../types/base";
import {
  DeliveryMethodEnum,
  ProviderPlatformEnum,
  TodayTixHold,
  TodayTixHoldErrorCode,
  TodayTixHoldType,
  TodayTixHoldsReq
} from "../types/holds";
import { TodayTixRushGrant } from "../types/rushGrants";
import { ProductType } from "../types/shows";
import { DayOfWeek, Daypart } from "../types/showtimes";

const guysAndDollsHold: TodayTixHold = {
  _type: "Hold",
  id: 75088671,
  admissionType: "Timed",
  accessibilityText: null,
  allocatedSeatId: 6107064,
  availableTicketProtection: null,
  baseTotal: {
    value: 26.5,
    currency: "GBP",
    display: "£26.50",
    displayRounded: "£26.50"
  },
  braintreeClientToken:
    "eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklqSXdNVGd3TkRJMk1UWXRjSEp2WkhWamRHbHZiaUlzSW1semN5STZJbWgwZEhCek9pOHZZWEJwTG1KeVlXbHVkSEpsWldkaGRHVjNZWGt1WTI5dEluMC5leUpsZUhBaU9qRTNNRGs1TURJNE5UWXNJbXAwYVNJNklqSTNabUZsTlRaaUxUZ3laRFF0TkRneFpDMDVOekZrTFdVMllXTTBOV0UyTTJNNFppSXNJbk4xWWlJNkltczFjV2czZERSemJqSTVObWhyTTNvaUxDSnBjM01pT2lKb2RIUndjem92TDJGd2FTNWljbUZwYm5SeVpXVm5ZWFJsZDJGNUxtTnZiU0lzSW0xbGNtTm9ZVzUwSWpwN0luQjFZbXhwWTE5cFpDSTZJbXMxY1dnM2REUnpiakk1Tm1ock0zb2lMQ0oyWlhKcFpubGZZMkZ5WkY5aWVWOWtaV1poZFd4MElqcDBjblZsZlN3aWNtbG5hSFJ6SWpwYkltMWhibUZuWlY5MllYVnNkQ0pkTENKelkyOXdaU0k2V3lKQ2NtRnBiblJ5WldVNlZtRjFiSFFpWFN3aWIzQjBhVzl1Y3lJNmV5SnRaWEpqYUdGdWRGOWhZMk52ZFc1MFgybGtJam9pVkc5a1lYbFVhWGhmUjBKUUluMTkuTEpRdENiaDlSRVhBVHBjX0lLV3l5d1ljaVRfZ19Qd01wUFRGV1Q5R1RXUXRRUWJja1Fuc3dxcUtfX0ZPZVo1bDM4VkdVUi1RZnVhcnJBOHBwWjcxSXciLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzL2s1cWg3dDRzbjI5NmhrM3ovY2xpZW50X2FwaS92MS9jb25maWd1cmF0aW9uIiwibWVyY2hhbnRBY2NvdW50SWQiOiJUb2RheVRpeF9HQlAiLCJncmFwaFFMIjp7InVybCI6Imh0dHBzOi8vcGF5bWVudHMuYnJhaW50cmVlLWFwaS5jb20vZ3JhcGhxbCIsImRhdGUiOiIyMDE4LTA1LTA4IiwiZmVhdHVyZXMiOlsidG9rZW5pemVfY3JlZGl0X2NhcmRzIl19LCJjbGllbnRBcGlVcmwiOiJodHRwczovL2FwaS5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzL2s1cWg3dDRzbjI5NmhrM3ovY2xpZW50X2FwaSIsImVudmlyb25tZW50IjoicHJvZHVjdGlvbiIsIm1lcmNoYW50SWQiOiJrNXFoN3Q0c24yOTZoazN6IiwiYXNzZXRzVXJsIjoiaHR0cHM6Ly9hc3NldHMuYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhdXRoVXJsIjoiaHR0cHM6Ly9hdXRoLnZlbm1vLmNvbSIsInZlbm1vIjoicHJvZHVjdGlvbiIsImNoYWxsZW5nZXMiOlsiY3Z2IiwicG9zdGFsX2NvZGUiXSwidGhyZWVEU2VjdXJlRW5hYmxlZCI6dHJ1ZSwiYW5hbHl0aWNzIjp7InVybCI6Imh0dHBzOi8vY2xpZW50LWFuYWx5dGljcy5icmFpbnRyZWVnYXRld2F5LmNvbS9rNXFoN3Q0c24yOTZoazN6In0sImFwcGxlUGF5Ijp7ImNvdW50cnlDb2RlIjoiSUUiLCJjdXJyZW5jeUNvZGUiOiJHQlAiLCJtZXJjaGFudElkZW50aWZpZXIiOiJtZXJjaGFudC5jb20udG9kYXl0aXguVG9kYXlUaXgiLCJzdGF0dXMiOiJwcm9kdWN0aW9uIiwic3VwcG9ydGVkTmV0d29ya3MiOlsidmlzYSIsIm1hc3RlcmNhcmQiLCJhbWV4IiwiZGlzY292ZXIiXX0sInBheXBhbEVuYWJsZWQiOnRydWUsImJyYWludHJlZV9hcGkiOnsidXJsIjoiaHR0cHM6Ly9wYXltZW50cy5icmFpbnRyZWUtYXBpLmNvbSIsImFjY2Vzc190b2tlbiI6ImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSkZVekkxTmlJc0ltdHBaQ0k2SWpJd01UZ3dOREkyTVRZdGNISnZaSFZqZEdsdmJpSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllYQnBMbUp5WVdsdWRISmxaV2RoZEdWM1lYa3VZMjl0SW4wLmV5SmxlSEFpT2pFM01EazVNREkxTlRnc0ltcDBhU0k2SWpnMFpUSmtNamxrTFRjeFltTXROR1F3TUMxaU5URXdMV013TkRGbE5qVmxaRGMyWVNJc0luTjFZaUk2SW1zMWNXZzNkRFJ6YmpJNU5taHJNM29pTENKcGMzTWlPaUpvZEhSd2N6b3ZMMkZ3YVM1aWNtRnBiblJ5WldWbllYUmxkMkY1TG1OdmJTSXNJbTFsY21Ob1lXNTBJanA3SW5CMVlteHBZMTlwWkNJNkltczFjV2czZERSemJqSTVObWhyTTNvaUxDSjJaWEpwWm5sZlkyRnlaRjlpZVY5a1pXWmhkV3gwSWpwMGNuVmxmU3dpY21sbmFIUnpJanBiSW5SdmEyVnVhWHBsSWl3aWJXRnVZV2RsWDNaaGRXeDBJbDBzSW5OamIzQmxJanBiSWtKeVlXbHVkSEpsWlRwV1lYVnNkQ0pkTENKdmNIUnBiMjV6SWpwN2ZYMC5mSzhYWlUtUjNPVGNUeEtoWW9HQ0h1R0E1RmpXMFphSGx5bEF0OU5PVmM0dHRYY0FiZHdiV3JsaFRQQl8zWkNlWEZodUZXRDJuVEM4QlFOcUZ3Y3N6USJ9LCJwYXlwYWwiOnsiYmlsbGluZ0FncmVlbWVudHNFbmFibGVkIjp0cnVlLCJlbnZpcm9ubWVudE5vTmV0d29yayI6ZmFsc2UsInVudmV0dGVkTWVyY2hhbnQiOmZhbHNlLCJhbGxvd0h0dHAiOmZhbHNlLCJkaXNwbGF5TmFtZSI6IlRvZGF5VGl4IiwiY2xpZW50SWQiOiJBYmdUQTBGTFFBUzY0NWxrbE1teFdFRGxNckRFb1NmN2VlRGMzRFpFQU9vMktxMnlyZ0hmeXVmMDZBWDJ1cmMzYy1KUkJKd3pCaGJ3VmxPQSIsImJhc2VVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImFzc2V0c1VybCI6Imh0dHBzOi8vY2hlY2tvdXQucGF5cGFsLmNvbSIsImRpcmVjdEJhc2VVcmwiOm51bGwsImVudmlyb25tZW50IjoibGl2ZSIsImJyYWludHJlZUNsaWVudElkIjoiQVJLcllSRGgzQUdYRHpXN3NPXzNiU2txLVUxQzdIR191V05DLXo1N0xqWVNETlVPU2FPdElhOXE2VnBXIiwibWVyY2hhbnRBY2NvdW50SWQiOiJUb2RheVRpeF9HQlAiLCJjdXJyZW5jeUlzb0NvZGUiOiJHQlAifX0=",
  localBraintreeClientToken:
    "eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklqSXdNVGd3TkRJMk1UWXRjSEp2WkhWamRHbHZiaUlzSW1semN5STZJbWgwZEhCek9pOHZZWEJwTG1KeVlXbHVkSEpsWldkaGRHVjNZWGt1WTI5dEluMC5leUpsZUhBaU9qRTNNRGs1TURJNE5UWXNJbXAwYVNJNklqSTNabUZsTlRaaUxUZ3laRFF0TkRneFpDMDVOekZrTFdVMllXTTBOV0UyTTJNNFppSXNJbk4xWWlJNkltczFjV2czZERSemJqSTVObWhyTTNvaUxDSnBjM01pT2lKb2RIUndjem92TDJGd2FTNWljbUZwYm5SeVpXVm5ZWFJsZDJGNUxtTnZiU0lzSW0xbGNtTm9ZVzUwSWpwN0luQjFZbXhwWTE5cFpDSTZJbXMxY1dnM2REUnpiakk1Tm1ock0zb2lMQ0oyWlhKcFpubGZZMkZ5WkY5aWVWOWtaV1poZFd4MElqcDBjblZsZlN3aWNtbG5hSFJ6SWpwYkltMWhibUZuWlY5MllYVnNkQ0pkTENKelkyOXdaU0k2V3lKQ2NtRnBiblJ5WldVNlZtRjFiSFFpWFN3aWIzQjBhVzl1Y3lJNmV5SnRaWEpqYUdGdWRGOWhZMk52ZFc1MFgybGtJam9pVkc5a1lYbFVhWGhmUjBKUUluMTkuTEpRdENiaDlSRVhBVHBjX0lLV3l5d1ljaVRfZ19Qd01wUFRGV1Q5R1RXUXRRUWJja1Fuc3dxcUtfX0ZPZVo1bDM4VkdVUi1RZnVhcnJBOHBwWjcxSXciLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzL2s1cWg3dDRzbjI5NmhrM3ovY2xpZW50X2FwaS92MS9jb25maWd1cmF0aW9uIiwibWVyY2hhbnRBY2NvdW50SWQiOiJUb2RheVRpeF9HQlAiLCJncmFwaFFMIjp7InVybCI6Imh0dHBzOi8vcGF5bWVudHMuYnJhaW50cmVlLWFwaS5jb20vZ3JhcGhxbCIsImRhdGUiOiIyMDE4LTA1LTA4IiwiZmVhdHVyZXMiOlsidG9rZW5pemVfY3JlZGl0X2NhcmRzIl19LCJjbGllbnRBcGlVcmwiOiJodHRwczovL2FwaS5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzL2s1cWg3dDRzbjI5NmhrM3ovY2xpZW50X2FwaSIsImVudmlyb25tZW50IjoicHJvZHVjdGlvbiIsIm1lcmNoYW50SWQiOiJrNXFoN3Q0c24yOTZoazN6IiwiYXNzZXRzVXJsIjoiaHR0cHM6Ly9hc3NldHMuYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhdXRoVXJsIjoiaHR0cHM6Ly9hdXRoLnZlbm1vLmNvbSIsInZlbm1vIjoicHJvZHVjdGlvbiIsImNoYWxsZW5nZXMiOlsiY3Z2IiwicG9zdGFsX2NvZGUiXSwidGhyZWVEU2VjdXJlRW5hYmxlZCI6dHJ1ZSwiYW5hbHl0aWNzIjp7InVybCI6Imh0dHBzOi8vY2xpZW50LWFuYWx5dGljcy5icmFpbnRyZWVnYXRld2F5LmNvbS9rNXFoN3Q0c24yOTZoazN6In0sImFwcGxlUGF5Ijp7ImNvdW50cnlDb2RlIjoiSUUiLCJjdXJyZW5jeUNvZGUiOiJHQlAiLCJtZXJjaGFudElkZW50aWZpZXIiOiJtZXJjaGFudC5jb20udG9kYXl0aXguVG9kYXlUaXgiLCJzdGF0dXMiOiJwcm9kdWN0aW9uIiwic3VwcG9ydGVkTmV0d29ya3MiOlsidmlzYSIsIm1hc3RlcmNhcmQiLCJhbWV4IiwiZGlzY292ZXIiXX0sInBheXBhbEVuYWJsZWQiOnRydWUsImJyYWludHJlZV9hcGkiOnsidXJsIjoiaHR0cHM6Ly9wYXltZW50cy5icmFpbnRyZWUtYXBpLmNvbSIsImFjY2Vzc190b2tlbiI6ImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSkZVekkxTmlJc0ltdHBaQ0k2SWpJd01UZ3dOREkyTVRZdGNISnZaSFZqZEdsdmJpSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllYQnBMbUp5WVdsdWRISmxaV2RoZEdWM1lYa3VZMjl0SW4wLmV5SmxlSEFpT2pFM01EazVNREkxTlRnc0ltcDBhU0k2SWpnMFpUSmtNamxrTFRjeFltTXROR1F3TUMxaU5URXdMV013TkRGbE5qVmxaRGMyWVNJc0luTjFZaUk2SW1zMWNXZzNkRFJ6YmpJNU5taHJNM29pTENKcGMzTWlPaUpvZEhSd2N6b3ZMMkZ3YVM1aWNtRnBiblJ5WldWbllYUmxkMkY1TG1OdmJTSXNJbTFsY21Ob1lXNTBJanA3SW5CMVlteHBZMTlwWkNJNkltczFjV2czZERSemJqSTVObWhyTTNvaUxDSjJaWEpwWm5sZlkyRnlaRjlpZVY5a1pXWmhkV3gwSWpwMGNuVmxmU3dpY21sbmFIUnpJanBiSW5SdmEyVnVhWHBsSWl3aWJXRnVZV2RsWDNaaGRXeDBJbDBzSW5OamIzQmxJanBiSWtKeVlXbHVkSEpsWlRwV1lYVnNkQ0pkTENKdmNIUnBiMjV6SWpwN2ZYMC5mSzhYWlUtUjNPVGNUeEtoWW9HQ0h1R0E1RmpXMFphSGx5bEF0OU5PVmM0dHRYY0FiZHdiV3JsaFRQQl8zWkNlWEZodUZXRDJuVEM4QlFOcUZ3Y3N6USJ9LCJwYXlwYWwiOnsiYmlsbGluZ0FncmVlbWVudHNFbmFibGVkIjp0cnVlLCJlbnZpcm9ubWVudE5vTmV0d29yayI6ZmFsc2UsInVudmV0dGVkTWVyY2hhbnQiOmZhbHNlLCJhbGxvd0h0dHAiOmZhbHNlLCJkaXNwbGF5TmFtZSI6IlRvZGF5VGl4IiwiY2xpZW50SWQiOiJBYmdUQTBGTFFBUzY0NWxrbE1teFdFRGxNckRFb1NmN2VlRGMzRFpFQU9vMktxMnlyZ0hmeXVmMDZBWDJ1cmMzYy1KUkJKd3pCaGJ3VmxPQSIsImJhc2VVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImFzc2V0c1VybCI6Imh0dHBzOi8vY2hlY2tvdXQucGF5cGFsLmNvbSIsImRpcmVjdEJhc2VVcmwiOm51bGwsImVudmlyb25tZW50IjoibGl2ZSIsImJyYWludHJlZUNsaWVudElkIjoiQVJLcllSRGgzQUdYRHpXN3NPXzNiU2txLVUxQzdIR191V05DLXo1N0xqWVNETlVPU2FPdElhOXE2VnBXIiwibWVyY2hhbnRBY2NvdW50SWQiOiJUb2RheVRpeF9HQlAiLCJjdXJyZW5jeUlzb0NvZGUiOiJHQlAifX0=",
  calculatedTotal: {
    value: 29.5,
    currency: "GBP",
    display: "£29.50",
    displayRounded: "£29.50"
  },
  configurableTexts: {
    _type: "HoldConfigurableTexts",
    aboutSeatsButton: null,
    amountDisplayForWeb: "£29.50",
    amountIncludingFeesText: "1 ticket x £26.50 (+ fee: £3/ticket) = £29.50",
    bestPriceGuaranteedText: "",
    deliveryInstructions:
      "You'll receive your tickets as barcodes before the event. Display these barcodes on your phone or print them out to be scanned for admission.",
    deliveryInstructionsForMobile: null,
    feeButtonEnabled: true,
    feesButtonText: "(inc. vat + £3 booking fee per ticket)",
    feePerTicketButtonText: "(+ fee: £3/ticket)",
    feeTextPerTicket: null,
    optionalText: null,
    optionalTitle: null,
    saveTextForMobile: "",
    saveTextForWeb: "",
    soYouKnowText: "All sales are final.",
    subtotalTitle: "Total:",
    ticketPriceInfoText: "1 ticket x £26.50 = £26.50",
    totalAmountTitle: "Total amount (inc. vat + fees):",
    youRequestedText: "You requested"
  },
  createdDatetime: "2024-03-07T13:00:56.677Z",
  credits: null,
  currency: {
    _type: "Currency",
    displayName: "Great British Pound",
    name: "GBP",
    symbol: "£"
  },
  customerId: "customer-id",
  deliveryMethod: DeliveryMethodEnum.Barcode,
  deliveryMethodId: 2,
  expirationDatetime: "2024-03-07T13:05:56.000Z",
  faceValuePerTicket: {
    value: 29.5,
    currency: "GBP",
    display: "£29.50",
    displayRounded: "£29.50"
  },
  fractionalDiscount: 0,
  hasPromotion: false,
  holdExpirationTime: "2024-03-07T13:05:56Z",
  holdTimeAllowedSeconds: 300,
  isEligibleForQuickCheckout: true,
  isPotentialDuplicate: false,
  localPrices: {
    _type: "LocalPrices",
    localCalculatedTotal: {
      value: 36.02,
      currency: "EUR",
      display: "€36.02 EUR",
      displayRounded: "€37 EUR"
    },
    localCurrency: {
      _type: "Currency",
      displayName: "Euro",
      name: "EUR",
      symbol: "€"
    },
    localPriceItems: [
      {
        _type: "BASE_PRICE",
        details: "1 x €36.02",
        displaySubtext: null,
        full: "1 x €36.02 = €36.02",
        result: "€36.02",
        resultSymbol: "NONE",
        title: "Ticket",
        total: {
          value: 36.02,
          currency: "EUR",
          display: "€36.02",
          displayRounded: "€36.02"
        },
        description: null
      }
    ],
    localTotalSalesTaxAmount: {
      value: 0.0,
      currency: "EUR",
      display: "€0",
      displayRounded: "€0"
    },
    localAvailableTicketProtectionFeeAmount: null,
    localTotalAmountSaved: {
      value: 0.0,
      currency: "EUR",
      display: "€0",
      displayRounded: "€0"
    }
  },
  numSeats: 1,
  paymentCaptureType: "IMMEDIATE",
  paymentMethods: null,
  paymentOption: "IN_APP",
  partTwoShowDatetime: null,
  priceItems: [
    {
      _type: "BASE_PRICE",
      details: "1 x £29.50",
      displaySubtext: null,
      full: "1 x £29.50 = £29.50",
      result: "£29.50",
      resultSymbol: "NONE",
      title: "Ticket",
      total: {
        value: 29.5,
        currency: "GBP",
        display: "£29.50",
        displayRounded: "£29.50"
      },
      description: null
    }
  ],
  promotion: null,
  provider: "1",
  providerId: 1,
  providerName: "TodayTix",
  providerPlatformEnum: ProviderPlatformEnum.TodayTix,
  pspOptions: [
    {
      _type: "PspOption",
      merchantAccount: "TodayTix_GBP",
      paymentGatewayType: "BRAINTREE",
      paymentSession: {
        braintreeClientToken:
          "eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklqSXdNVGd3TkRJMk1UWXRjSEp2WkhWamRHbHZiaUlzSW1semN5STZJbWgwZEhCek9pOHZZWEJwTG1KeVlXbHVkSEpsWldkaGRHVjNZWGt1WTI5dEluMC5leUpsZUhBaU9qRTNNRGs1TURJNE5UWXNJbXAwYVNJNklqSTNabUZsTlRaaUxUZ3laRFF0TkRneFpDMDVOekZrTFdVMllXTTBOV0UyTTJNNFppSXNJbk4xWWlJNkltczFjV2czZERSemJqSTVObWhyTTNvaUxDSnBjM01pT2lKb2RIUndjem92TDJGd2FTNWljbUZwYm5SeVpXVm5ZWFJsZDJGNUxtTnZiU0lzSW0xbGNtTm9ZVzUwSWpwN0luQjFZbXhwWTE5cFpDSTZJbXMxY1dnM2REUnpiakk1Tm1ock0zb2lMQ0oyWlhKcFpubGZZMkZ5WkY5aWVWOWtaV1poZFd4MElqcDBjblZsZlN3aWNtbG5hSFJ6SWpwYkltMWhibUZuWlY5MllYVnNkQ0pkTENKelkyOXdaU0k2V3lKQ2NtRnBiblJ5WldVNlZtRjFiSFFpWFN3aWIzQjBhVzl1Y3lJNmV5SnRaWEpqYUdGdWRGOWhZMk52ZFc1MFgybGtJam9pVkc5a1lYbFVhWGhmUjBKUUluMTkuTEpRdENiaDlSRVhBVHBjX0lLV3l5d1ljaVRfZ19Qd01wUFRGV1Q5R1RXUXRRUWJja1Fuc3dxcUtfX0ZPZVo1bDM4VkdVUi1RZnVhcnJBOHBwWjcxSXciLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzL2s1cWg3dDRzbjI5NmhrM3ovY2xpZW50X2FwaS92MS9jb25maWd1cmF0aW9uIiwibWVyY2hhbnRBY2NvdW50SWQiOiJUb2RheVRpeF9HQlAiLCJncmFwaFFMIjp7InVybCI6Imh0dHBzOi8vcGF5bWVudHMuYnJhaW50cmVlLWFwaS5jb20vZ3JhcGhxbCIsImRhdGUiOiIyMDE4LTA1LTA4IiwiZmVhdHVyZXMiOlsidG9rZW5pemVfY3JlZGl0X2NhcmRzIl19LCJjbGllbnRBcGlVcmwiOiJodHRwczovL2FwaS5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzL2s1cWg3dDRzbjI5NmhrM3ovY2xpZW50X2FwaSIsImVudmlyb25tZW50IjoicHJvZHVjdGlvbiIsIm1lcmNoYW50SWQiOiJrNXFoN3Q0c24yOTZoazN6IiwiYXNzZXRzVXJsIjoiaHR0cHM6Ly9hc3NldHMuYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhdXRoVXJsIjoiaHR0cHM6Ly9hdXRoLnZlbm1vLmNvbSIsInZlbm1vIjoicHJvZHVjdGlvbiIsImNoYWxsZW5nZXMiOlsiY3Z2IiwicG9zdGFsX2NvZGUiXSwidGhyZWVEU2VjdXJlRW5hYmxlZCI6dHJ1ZSwiYW5hbHl0aWNzIjp7InVybCI6Imh0dHBzOi8vY2xpZW50LWFuYWx5dGljcy5icmFpbnRyZWVnYXRld2F5LmNvbS9rNXFoN3Q0c24yOTZoazN6In0sImFwcGxlUGF5Ijp7ImNvdW50cnlDb2RlIjoiSUUiLCJjdXJyZW5jeUNvZGUiOiJHQlAiLCJtZXJjaGFudElkZW50aWZpZXIiOiJtZXJjaGFudC5jb20udG9kYXl0aXguVG9kYXlUaXgiLCJzdGF0dXMiOiJwcm9kdWN0aW9uIiwic3VwcG9ydGVkTmV0d29ya3MiOlsidmlzYSIsIm1hc3RlcmNhcmQiLCJhbWV4IiwiZGlzY292ZXIiXX0sInBheXBhbEVuYWJsZWQiOnRydWUsImJyYWludHJlZV9hcGkiOnsidXJsIjoiaHR0cHM6Ly9wYXltZW50cy5icmFpbnRyZWUtYXBpLmNvbSIsImFjY2Vzc190b2tlbiI6ImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSkZVekkxTmlJc0ltdHBaQ0k2SWpJd01UZ3dOREkyTVRZdGNISnZaSFZqZEdsdmJpSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllYQnBMbUp5WVdsdWRISmxaV2RoZEdWM1lYa3VZMjl0SW4wLmV5SmxlSEFpT2pFM01EazVNREkxTlRnc0ltcDBhU0k2SWpnMFpUSmtNamxrTFRjeFltTXROR1F3TUMxaU5URXdMV013TkRGbE5qVmxaRGMyWVNJc0luTjFZaUk2SW1zMWNXZzNkRFJ6YmpJNU5taHJNM29pTENKcGMzTWlPaUpvZEhSd2N6b3ZMMkZ3YVM1aWNtRnBiblJ5WldWbllYUmxkMkY1TG1OdmJTSXNJbTFsY21Ob1lXNTBJanA3SW5CMVlteHBZMTlwWkNJNkltczFjV2czZERSemJqSTVObWhyTTNvaUxDSjJaWEpwWm5sZlkyRnlaRjlpZVY5a1pXWmhkV3gwSWpwMGNuVmxmU3dpY21sbmFIUnpJanBiSW5SdmEyVnVhWHBsSWl3aWJXRnVZV2RsWDNaaGRXeDBJbDBzSW5OamIzQmxJanBiSWtKeVlXbHVkSEpsWlRwV1lYVnNkQ0pkTENKdmNIUnBiMjV6SWpwN2ZYMC5mSzhYWlUtUjNPVGNUeEtoWW9HQ0h1R0E1RmpXMFphSGx5bEF0OU5PVmM0dHRYY0FiZHdiV3JsaFRQQl8zWkNlWEZodUZXRDJuVEM4QlFOcUZ3Y3N6USJ9LCJwYXlwYWwiOnsiYmlsbGluZ0FncmVlbWVudHNFbmFibGVkIjp0cnVlLCJlbnZpcm9ubWVudE5vTmV0d29yayI6ZmFsc2UsInVudmV0dGVkTWVyY2hhbnQiOmZhbHNlLCJhbGxvd0h0dHAiOmZhbHNlLCJkaXNwbGF5TmFtZSI6IlRvZGF5VGl4IiwiY2xpZW50SWQiOiJBYmdUQTBGTFFBUzY0NWxrbE1teFdFRGxNckRFb1NmN2VlRGMzRFpFQU9vMktxMnlyZ0hmeXVmMDZBWDJ1cmMzYy1KUkJKd3pCaGJ3VmxPQSIsImJhc2VVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImFzc2V0c1VybCI6Imh0dHBzOi8vY2hlY2tvdXQucGF5cGFsLmNvbSIsImRpcmVjdEJhc2VVcmwiOm51bGwsImVudmlyb25tZW50IjoibGl2ZSIsImJyYWludHJlZUNsaWVudElkIjoiQVJLcllSRGgzQUdYRHpXN3NPXzNiU2txLVUxQzdIR191V05DLXo1N0xqWVNETlVPU2FPdElhOXE2VnBXIiwibWVyY2hhbnRBY2NvdW50SWQiOiJUb2RheVRpeF9HQlAiLCJjdXJyZW5jeUlzb0NvZGUiOiJHQlAifX0="
      },
      thirdPartyPaymentsEnabled: ["APPLE_PAY", "GOOGLE_PAY"],
      isPrimaryPsp: true
    },
    {
      _type: "PspOption",
      merchantAccount: "TodayTixUK",
      paymentGatewayType: "ADYEN",
      paymentSession: {},
      thirdPartyPaymentsEnabled: ["APPLE_PAY"],
      isPrimaryPsp: false
    }
  ],
  localPspOptions: [
    {
      _type: "PspOption",
      merchantAccount: "TodayTix_UK_EUR",
      paymentGatewayType: "BRAINTREE",
      paymentSession: {
        braintreeClientToken:
          "eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklqSXdNVGd3TkRJMk1UWXRjSEp2WkhWamRHbHZiaUlzSW1semN5STZJbWgwZEhCek9pOHZZWEJwTG1KeVlXbHVkSEpsWldkaGRHVjNZWGt1WTI5dEluMC5leUpsZUhBaU9qRTNNRGs1TURJNE5UWXNJbXAwYVNJNklqaGpabU16WmpoaUxUSXdaREV0TkdJell5MWhaVEkzTFdRME1ESm1ZV0k0TmpCbFpTSXNJbk4xWWlJNkltczFjV2czZERSemJqSTVObWhyTTNvaUxDSnBjM01pT2lKb2RIUndjem92TDJGd2FTNWljbUZwYm5SeVpXVm5ZWFJsZDJGNUxtTnZiU0lzSW0xbGNtTm9ZVzUwSWpwN0luQjFZbXhwWTE5cFpDSTZJbXMxY1dnM2REUnpiakk1Tm1ock0zb2lMQ0oyWlhKcFpubGZZMkZ5WkY5aWVWOWtaV1poZFd4MElqcDBjblZsZlN3aWNtbG5hSFJ6SWpwYkltMWhibUZuWlY5MllYVnNkQ0pkTENKelkyOXdaU0k2V3lKQ2NtRnBiblJ5WldVNlZtRjFiSFFpWFN3aWIzQjBhVzl1Y3lJNmV5SnRaWEpqYUdGdWRGOWhZMk52ZFc1MFgybGtJam9pVkc5a1lYbFVhWGhmVlV0ZlJWVlNJbjE5Lnk3Wm92SnVMRU9iQTFxckxmUS1QSlhkaHFINERxQmxlai1aWTZtak1xbzhoZGtHb3dNYmZId1piZ3RWdFJJN2lRY0VSTVVtaUh2VHdiSGE5Rk5RTUdRIiwiY29uZmlnVXJsIjoiaHR0cHM6Ly9hcGkuYnJhaW50cmVlZ2F0ZXdheS5jb206NDQzL21lcmNoYW50cy9rNXFoN3Q0c24yOTZoazN6L2NsaWVudF9hcGkvdjEvY29uZmlndXJhdGlvbiIsIm1lcmNoYW50QWNjb3VudElkIjoiVG9kYXlUaXhfVUtfRVVSIiwiZ3JhcGhRTCI6eyJ1cmwiOiJodHRwczovL3BheW1lbnRzLmJyYWludHJlZS1hcGkuY29tL2dyYXBocWwiLCJkYXRlIjoiMjAxOC0wNS0wOCIsImZlYXR1cmVzIjpbInRva2VuaXplX2NyZWRpdF9jYXJkcyJdfSwiY2xpZW50QXBpVXJsIjoiaHR0cHM6Ly9hcGkuYnJhaW50cmVlZ2F0ZXdheS5jb206NDQzL21lcmNoYW50cy9rNXFoN3Q0c24yOTZoazN6L2NsaWVudF9hcGkiLCJlbnZpcm9ubWVudCI6InByb2R1Y3Rpb24iLCJtZXJjaGFudElkIjoiazVxaDd0NHNuMjk2aGszeiIsImFzc2V0c1VybCI6Imh0dHBzOi8vYXNzZXRzLmJyYWludHJlZWdhdGV3YXkuY29tIiwiYXV0aFVybCI6Imh0dHBzOi8vYXV0aC52ZW5tby5jb20iLCJ2ZW5tbyI6InByb2R1Y3Rpb24iLCJjaGFsbGVuZ2VzIjpbImN2diIsInBvc3RhbF9jb2RlIl0sInRocmVlRFNlY3VyZUVuYWJsZWQiOnRydWUsImFuYWx5dGljcyI6eyJ1cmwiOiJodHRwczovL2NsaWVudC1hbmFseXRpY3MuYnJhaW50cmVlZ2F0ZXdheS5jb20vazVxaDd0NHNuMjk2aGszeiJ9LCJhcHBsZVBheSI6eyJjb3VudHJ5Q29kZSI6IklFIiwiY3VycmVuY3lDb2RlIjoiRVVSIiwibWVyY2hhbnRJZGVudGlmaWVyIjoibWVyY2hhbnQuY29tLnRvZGF5dGl4LlRvZGF5VGl4Iiwic3RhdHVzIjoicHJvZHVjdGlvbiIsInN1cHBvcnRlZE5ldHdvcmtzIjpbInZpc2EiLCJtYXN0ZXJjYXJkIiwiYW1leCIsImRpc2NvdmVyIl19LCJwYXlwYWxFbmFibGVkIjp0cnVlLCJicmFpbnRyZWVfYXBpIjp7InVybCI6Imh0dHBzOi8vcGF5bWVudHMuYnJhaW50cmVlLWFwaS5jb20iLCJhY2Nlc3NfdG9rZW4iOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklqSXdNVGd3TkRJMk1UWXRjSEp2WkhWamRHbHZiaUlzSW1semN5STZJbWgwZEhCek9pOHZZWEJwTG1KeVlXbHVkSEpsWldkaGRHVjNZWGt1WTI5dEluMC5leUpsZUhBaU9qRTNNRGs1TURJM01EVXNJbXAwYVNJNkltRmlZelZqTVRBM0xXTmlNekV0TkRaaU1DMWhOVFZpTFRWaFlUaGpPREppTW1KalpTSXNJbk4xWWlJNkltczFjV2czZERSemJqSTVObWhyTTNvaUxDSnBjM01pT2lKb2RIUndjem92TDJGd2FTNWljbUZwYm5SeVpXVm5ZWFJsZDJGNUxtTnZiU0lzSW0xbGNtTm9ZVzUwSWpwN0luQjFZbXhwWTE5cFpDSTZJbXMxY1dnM2REUnpiakk1Tm1ock0zb2lMQ0oyWlhKcFpubGZZMkZ5WkY5aWVWOWtaV1poZFd4MElqcDBjblZsZlN3aWNtbG5hSFJ6SWpwYkluUnZhMlZ1YVhwbElpd2liV0Z1WVdkbFgzWmhkV3gwSWwwc0luTmpiM0JsSWpwYklrSnlZV2x1ZEhKbFpUcFdZWFZzZENKZExDSnZjSFJwYjI1eklqcDdmWDAuRjB4NzJpeGlUT2xyUGw3MllSUjJwemVZRlR4MEtVeXlFRkJpd2hoRmVmeUdabHR5T2dwcmN1eUlPQUQwRWtWaG9oTTZNMGFJM0RIeGlIT3pDdjBFeFEifSwicGF5cGFsIjp7ImJpbGxpbmdBZ3JlZW1lbnRzRW5hYmxlZCI6dHJ1ZSwiZW52aXJvbm1lbnROb05ldHdvcmsiOmZhbHNlLCJ1bnZldHRlZE1lcmNoYW50IjpmYWxzZSwiYWxsb3dIdHRwIjpmYWxzZSwiZGlzcGxheU5hbWUiOiJUb2RheVRpeCIsImNsaWVudElkIjoiQWJnVEEwRkxRQVM2NDVsa2xNbXhXRURsTXJERW9TZjdlZURjM0RaRUFPbzJLcTJ5cmdIZnl1ZjA2QVgydXJjM2MtSlJCSnd6Qmhid1ZsT0EiLCJiYXNlVXJsIjoiaHR0cHM6Ly9hc3NldHMuYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhc3NldHNVcmwiOiJodHRwczovL2NoZWNrb3V0LnBheXBhbC5jb20iLCJkaXJlY3RCYXNlVXJsIjpudWxsLCJlbnZpcm9ubWVudCI6ImxpdmUiLCJicmFpbnRyZWVDbGllbnRJZCI6IkFSS3JZUkRoM0FHWER6VzdzT18zYlNrcS1VMUM3SEdfdVdOQy16NTdMallTRE5VT1NhT3RJYTlxNlZwVyIsIm1lcmNoYW50QWNjb3VudElkIjoiVG9kYXlUaXhfVUtfRVVSIiwiY3VycmVuY3lJc29Db2RlIjoiRVVSIn19"
      },
      thirdPartyPaymentsEnabled: ["APPLE_PAY", "GOOGLE_PAY"],
      isPrimaryPsp: true
    }
  ],
  reservedOfferHold: null,
  retailer: {
    _type: "Retailer",
    id: 1,
    name: "TodayTix",
    pubId: "todaytix",
    vertical: {
      _type: "RetailerVertical",
      id: 1,
      name: "Owned",
      department: {
        _type: "RetailerDepartment",
        id: 1,
        name: "Owned"
      }
    }
  },
  retailerId: "todaytix",
  rewards: {
    _type: "EarnedRewardsSummary",
    balance: {
      value: 3.54,
      currency: "GBP",
      display: "£3.54",
      displayRounded: "£3.54"
    },
    rewardsAmount: null,
    earnedCredit: null
  },
  seatSelectionType: "BEST_AVAILABLE",
  seatsInfo: {
    doorInfo: null,
    endSeat: null,
    row: "J",
    seats: ["28"],
    sectionCode: "DC",
    sectionName: "Dress Circle",
    startSeat: "28",
    seatsDetails: []
  },
  secret: "ffcaddbc-6d9e-46ee-95e7-ef9fbaaf7c2b",
  sectionDescriptionMetadata: null,
  showEndDatetime: null,
  showDatetime: "2024-03-07T19:30:00.000Z",
  showId: 3,
  showtime: {
    _type: "Showtime",
    id: 3,
    admissionType: "Timed",
    endDatetime: null,
    endDatetimeEpoch: null,
    endLocalDate: null,
    endLocalTime: null,
    datetime: "2024-03-07T19:30:00.000Z",
    datetimeEpoch: 1709839800,
    daypart: Daypart.Evening,
    dayOfWeek: DayOfWeek.Thursday,
    localDate: "2024-03-07",
    localTime: "19:30",
    numDaysOut: 0,
    partTwoDatetime: null,
    partTwoDatetimeEpoch: null,
    show: {
      _type: "Show",
      id: 22396,
      account: {
        _type: "Account",
        id: 321,
        name: "Lloyd Webber"
      },
      admissionType: "TIMED",
      areaTags: ["West End"],
      avgRating: 4.67984,
      category: {
        _type: "Category",
        id: 8,
        name: "Musicals",
        slug: "musicals"
      },
      displayName: "Guys & Dolls",
      genreTags: ["Musical"],
      location: {
        _type: "Location",
        id: 2,
        abbr: "LON",
        country: "GB",
        currency: "GBP",
        currencySymbol: "£",
        includeFees: true,
        language: "en",
        locale: "en_GB",
        name: "London",
        seoName: "london",
        timezone: "Europe/London"
      },
      name: "Guys & Dolls",
      numRatings: 6587,
      productType: ProductType.Show
    }
  },
  subTotal: {
    value: 29.5,
    currency: "GBP",
    display: "£29.50",
    displayRounded: "£29.50"
  },
  supportedDeliveryMethods: [
    {
      method: DeliveryMethodEnum.Barcode,
      postPurchaseText:
        "You will receive your e-ticket(s) via email on March 07 by 5:30 PM GMT.",
      prePurchaseText:
        "You'll receive your tickets as barcodes before the event. Display these barcodes on your phone or print them out to be scanned for admission.",
      price: {
        value: 0.0,
        currency: "GBP",
        display: "£0",
        displayRounded: "£0"
      }
    }
  ],
  ticketProtectionPlanId: null,
  ticketType: TodayTixHoldType.Rush,
  ticketsType: TodayTixHoldType.Rush,
  totalAmountSaved: {
    value: 0,
    currency: "GBP",
    display: "£0",
    displayRounded: "£0"
  },
  totalPricePerTicket: {
    value: 29.5,
    currency: "GBP",
    display: "£29.50",
    displayRounded: "£29.50"
  },
  totalTicketDiscount: {
    value: 0e-7,
    currency: "GBP",
    display: "£0",
    displayRounded: "£0"
  },
  totalSalesTaxAmount: {
    value: 0.0,
    currency: "GBP",
    display: "£0",
    displayRounded: "£0"
  },
  venueAreaIds: null,
  voucher: null,
  voucherApplicationMessage: null,
  voucherCode: "",
  voucherDiscount: null
};

const postHolds401Response: TodayTixAPIv2ErrorResponse = {
  code: 401,
  error: TodayTixHoldErrorCode.UNAUTHENTICATED,
  context: null,
  title: "Error",
  message:
    "Sorry, something went wrong. Please try signing in again and contact TodayTix Support if the issue persists."
};

const postHolds409AddedToAnotherCartResponse: TodayTixAPIv2ErrorResponse = {
  code: 409,
  error: TodayTixHoldErrorCode.SEATS_TAKEN,
  context: [
    "Unfortunately, those tickets have just been added to another user's cart."
  ],
  title: "All seats are being held",
  message:
    "Sorry, all remaining tickets are currently being held by other customers. Please try again later."
};

const postHolds409SeatsTakenResponse: TodayTixAPIv2ErrorResponse = {
  code: 409,
  error: TodayTixHoldErrorCode.SEATS_TAKEN,
  context: [
    "Sorry, all remaining tickets are currently being held by other customers. Please try again later."
  ],
  title: "All seats are being held",
  message:
    "Sorry, all remaining tickets are currently being held by other customers. Please try again later."
};

const postHolds409RushNotUnlockedResponse: TodayTixAPIv2ErrorResponse = {
  code: 409,
  error: TodayTixHoldErrorCode.CONFLICT,
  context: ["You are not eligible to purchase Rush tickets."],
  title: "Not eligible",
  message:
    "You are not eligible to make this purchase. Please unlock Rush and try again. Contact TodayTix Support if you feel you have received this message in error."
};

const postHoldsRoute = (router: Router) =>
  router.post<
    "/holds",
    null,
    TodayTixAPIv2Response<TodayTixHold> | TodayTixAPIv2ErrorResponse,
    TodayTixHoldsReq
  >("/holds", (req, res) => {
    /* When trying to get tickets to SIX, return
     - 1 ticket: Seats just added to another user's cart (i.e. customer id has been deprioritized)
     - 2 tickets: Seats held by other customers */
    if (req.body.showtime === 1) {
      res
        .status(409)
        .json(
          req.body.numTickets === 1
            ? postHolds409AddedToAnotherCartResponse
            : postHolds409SeatsTakenResponse
        );
      return;
    }

    // Guys & Dolls @19.30
    if (req.body.showtime === 3) {
      // If trying to get 2 tickets, return unauthenticated response
      if (req.body.numTickets === 2) {
        res.status(401).json(postHolds401Response);
        return;
      }
      // see if Guys & Dolls has been unlocked
      const isGuysAndDollsUnlocked = Boolean(
        getItemFromStore<TodayTixRushGrant>("rush-grants", "3")
      );

      if (!isGuysAndDollsUnlocked) {
        res.status(409).json(postHolds409RushNotUnlockedResponse);
        return;
      }

      // Otherwise store the hold for Guys & Dolls
      const holdToReturn = writeItemToStore(
        "holds",
        guysAndDollsHold.id.toString(),
        guysAndDollsHold
      );

      if (!holdToReturn) {
        res.status(500).json({
          code: 500,
          error: `Internal server error trying to write hold with id ${guysAndDollsHold.id} to the file system.`
        });
        return;
      }

      res.status(201).json({
        code: 201,
        data: holdToReturn
      });
      return;
    }

    res.status(401).json(postHolds401Response);
  });

export default postHoldsRoute;
