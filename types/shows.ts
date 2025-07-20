export enum TodayTixFieldset {
  Summary = "SHOW_SUMMARY"
}

export enum AnchorPosition {
  Top = "TOP",
  Center = "CENTER"
}

type Category = {
  _type: string;
  name: string;
  id: number;
  slug: string;
};

type FileImageDimensions = {
  width: number;
  height: number;
};

type FileDetails = {
  image?: FileImageDimensions;
  size: number;
};

type File = {
  fileName: string;
  details: FileDetails;
  contentType: string;
  url: string;
};

type Image = {
  dominantColor?: string | null;
  imageUrl: string;
  videoUrl?: string;
  _type: string;
  id: number;
  anchorPosition: AnchorPosition | null;
};

type Images = {
  productMedia: ProductMedia;
  posterImageLandscape: unknown | null;
  heroImage: Media | null;
  imagesAndVideos: ImageAndVideo[];
  posterImage: Media;
  posterImageSquare: Media;
};

type ImageAndVideo = {
  altText?: string;
  anchor?: string;
  media: Media;
  entryTitle: string;
  contentModelType: string;
  entryId: string;
  updatedAt: string;
  videoCoverImage?: Media;
};

type Media = {
  file: File;
  description?: string;
  title?: string;
};

type ProductMedia = {
  headerImage?: Media;
  imagesAndVideos: ImageAndVideo[];
  posterImage: Media;
  posterImageSquare: Media;
  entryTitle: string;
  appHeroImage: Media;
  contentModelType: string;
  entryId: string;
  updatedAt: string;
};

export type Money = {
  display: string;
  currency: string;
  displayRounded: string;
  value: number;
};

export enum ProductType {
  Show = "SHOW"
}

export enum Platform {
  IOS = "ios",
  Android = "android",
  Web = "web"
}

type Promotion = {
  _type: string;
  description: string;
  voucherRestrictionsMessage: unknown | null;
  id: number;
  label: string;
  title: string;
  voucherCode: unknown | null;
  platforms: Platform[];
};

export enum RewardType {
  Default = "DEFAULT"
}

export type Rewards = { _type: string; maxAmount: number; type: RewardType };

type Account = {
  _type: string;
  id: number;
  name: string;
};

type Location = {
  _type: string;
  id: number;
  abbr: string;
  country: string;
  currency: string;
  currencySymbol: string;
  includeFees: boolean;
  language: string;
  locale: string;
  name: string;
  seoName: string;
  timezone: string;
};

export type TodayTixShow = {
  _type?: string;
  account?: Account;
  admissionType: string;
  areLotteryTicketsAvailable?: boolean;
  areRegularTicketsAvailable?: boolean;
  areRushTicketsAvailable?: boolean;
  areaTags: string[];
  avgRating: number;
  carouselMedia?: Image[];
  category: Category;
  description?: string;
  displayName: string;
  endDate?: string;
  genreTags: string[];
  hasPromotion?: boolean;
  heroImageUrl?: string;
  id: number;
  images?: Images;
  isLotteryActive?: boolean;
  isRushActive?: boolean;
  location?: Location;
  locationId?: number;
  locationSeoName?: string;
  lotteryBannerText?: string | null;
  lowPriceForLotteryTickets?: Money | null;
  lowPriceForRegularTickets?: Money;
  lowPriceForRushTickets?: Money | null;
  marketableLocationIds?: number[];
  maxDiscountPercentage?: number;
  name: string;
  numRatings?: number;
  posterImageUrl?: string;
  productType: ProductType;
  promotion?: Promotion | null;
  ratingCount?: number;
  relatedShows?: unknown[];
  rewards?: Rewards;
  rushBannerText?: string | null;
  savingsMessage?: string | null;
  salesMessage?: string;
  shouldShowPromotionsOnCards?: boolean;
  showId?: number;
  showName?: string;
  slug?: string | null;
  startDate?: string;
  subcategories?: Category[];
  venue?: string;
  venueId?: string;
  venueUrl?: string;
};

export type TodayTixShowsReqQueryParams = {
  areAccessProgramsActive?: boolean;
  fieldset?: TodayTixFieldset;
  limit?: number;
  location?: number;
  offset?: number;
};
