import { Router } from "express";

import {
  TodayTixAPIv2ErrorResponse,
  TodayTixAPIv2Response
} from "../types/base";
import { TodayTixLocation } from "../types/locations";

const getLocations200Response: TodayTixAPIv2Response<TodayTixLocation[]> = {
  code: 200,
  data: [
    {
      _type: "Location",
      id: 1,
      abbr: "NYC",
      allowPassbook: true,
      appBanner: null,
      appLaunchImageUrl: null,
      appLaunchVideoUrl: null,
      bannerAd: null,
      currencyCode: "USD",
      currencySymbol: "$",
      customerServiceInfo: {
        callPhone: "+1 (855) 464-9778",
        email: "support@todaytix.com",
        mailingAddress:
          "32 Avenue of the Americas, Floor 23, New York, NY 10013, USA",
        textPhone: ""
      },
      displayName: "NYC",
      enableDiscover: true,
      inRangeDistanceKm: 75,
      includeFees: true,
      insiderHeaderImageUrl: "https://todaytix-insider.imgix.net/nyc.png",
      latitude: 40.7641667,
      locale: "en_US",
      longitude: -73.9563889,
      mapInitialRadiusKm: 3,
      name: "New York",
      referralDiscount: 0,
      regionCode: "US",
      seoCountryName: "us",
      seoName: "nyc",
      tileImageUrl: "https://todaytix.imgix.net/web-location-nyc.jpg",
      timezone: "America/New_York",
      webBanner: null
    },
    {
      _type: "Location",
      id: 2,
      abbr: "LON",
      allowPassbook: true,
      appBanner: null,
      appLaunchImageUrl: null,
      appLaunchVideoUrl: null,
      bannerAd: null,
      currencyCode: "GBP",
      currencySymbol: "£",
      customerServiceInfo: {
        callPhone: "+44 2045 388272",
        email: "support@todaytix.com",
        mailingAddress:
          "2nd Floor Harling House, 47-51 Great Suffolk Street, London, SE1 0BS",
        textPhone: ""
      },
      displayName: "LONDON",
      enableDiscover: true,
      inRangeDistanceKm: 804,
      includeFees: true,
      insiderHeaderImageUrl: "https://todaytix-insider.imgix.net/london.png",
      latitude: 51.5,
      locale: "en_GB",
      longitude: -0.116667,
      mapInitialRadiusKm: 3,
      name: "London",
      referralDiscount: 0,
      regionCode: "GB",
      seoCountryName: "uk",
      seoName: "london",
      tileImageUrl: "https://todaytix.imgix.net/web-location-london.jpg",
      timezone: "Europe/London",
      webBanner: null
    }
  ],
  pagination: null
};

const getLocationsRoute = (router: Router) =>
  router.get<
    "/locations",
    null,
    TodayTixAPIv2Response<TodayTixLocation[]> | TodayTixAPIv2ErrorResponse
  >("/locations", (req, res) => {
    res.json(getLocations200Response);

    // TODO: Add and test a 500 error here
  });

export default getLocationsRoute;
