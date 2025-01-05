type Banner = {
  _type: string;
  href: string | null;
  message: string;
};

type CustomerServiceInfo = {
  callPhone: string;
  email: string;
  mailingAddress: string;
  textPhone: string;
};

export type TodayTixLocation = {
  _type: string;
  id: number;
  abbr: string;
  allowPassbook: boolean;
  appBanner: Banner | null;
  appLaunchImageUrl: string | null;
  appLaunchVideoUrl: string | null;
  bannerAd: null;
  currencyCode: string;
  currencySymbol: string;
  customerServiceInfo: CustomerServiceInfo;
  displayName: string;
  enableDiscover: boolean;
  inRangeDistanceKm: number;
  includeFees: boolean;
  insiderHeaderImageUrl: string;
  latitude: number;
  locale: string;
  longitude: number;
  mapInitialRadiusKm: number;
  name: string;
  referralDiscount: number;
  regionCode: string;
  seoCountryName: string;
  seoName: string;
  tileImageUrl: string;
  timezone: string;
  webBanner: Banner | null;
};
