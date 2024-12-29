import {Router} from "express";

import {TodayTixAPIv2ErrorResponse, TodayTixAPIv2Response} from "../types/base";
import {
  AnchorPosition,
  Platform,
  ProductType,
  RewardType,
  TodayTixLocation,
  TodayTixShow,
  TodayTixShowsReqQueryParams
} from "../types/shows";

const getRushAndLotteryShowsLondon200Response: TodayTixAPIv2Response<
  TodayTixShow[]
> = {
  code: 200,
  data: [
    {
      admissionType: "TIMED",
      areLotteryTicketsAvailable: true,
      areRegularTicketsAvailable: true,
      areRushTicketsAvailable: false,
      areaTags: ["West End"],
      avgRating: 4.83754,
      carouselMedia: [
        {
          dominantColor: null,
          imageUrl:
            "https://todaytix.imgix.net/prod_1580719598474_HAM_TodayTix_1600x1200_2.jpg",
          _type: "Image",
          id: 2252504,
          anchorPosition: AnchorPosition.Center
        }
      ],
      category: {
        _type: "Category",
        name: "Musicals",
        id: 8,
        slug: "musicals"
      },
      description:
        "Be in the room where it happens and catch Lin-Manuel Miranda's multi-award-winning show in the West End. *Hamilton* revolutionises the stage with a dynamic retelling of the ten-dollar founding father, Alexander Hamilton, through a catchy cross-genre score that blends various musical styles.",
      displayName: "Hamilton",
      endDate: "2024-09-28",
      genreTags: ["Musical"],
      hasPromotion: false,
      heroImageUrl:
        "https://images.ctfassets.net/6pezt69ih962/3fHQ41gqlpwWBHcawW3OIZ/33c9b17158e0cfa84cb2971d74ed7583/Hamilton_-_Hero",
      id: 20561,
      images: {
        productMedia: {
          headerImage: {
            file: {
              fileName:
                "Reuben Joseph as Hamilton, Waylon Jacobs, Jake Halsey-Jones and Emile Ruddock and Company. Photo by Danny Kaan.jpg",
              details: {
                image: {
                  width: 1600,
                  height: 1200
                },
                size: 788364
              },
              contentType: "image/jpeg",
              url: "//images.ctfassets.net/6pezt69ih962/7tdRGOQ5P7KD6qz6sIrI05/a6369f18a5edb12426bdeb7b1f3039d7/Reuben_Joseph_as_Hamilton__Waylon_Jacobs__Jake_Halsey-Jones_and_Emile_Ruddock_and_Company._Photo_by_Danny_Kaan.jpg"
            },
            description: "",
            title:
              "Reuben Joseph as Hamilton, Waylon Jacobs, Jake Halsey-Jones and Emile Ruddock and Company. Photo by Danny Kaan"
          },
          imagesAndVideos: [
            {
              videoCoverImage: {
                file: {
                  fileName: "HamiltonPS1.png",
                  details: {
                    image: {
                      width: 1600,
                      height: 1200
                    },
                    size: 3431636
                  },
                  contentType: "image/png",
                  url: "//images.ctfassets.net/6pezt69ih962/31zEqyFmPBiBJG2Ee7IL2z/5ed3e5eb8859712293df4191283b3c45/HamiltonPS1.png"
                },
                description: "",
                title: "Ham1"
              },
              media: {
                file: {
                  fileName: "53b040ff-b302-4b88-9c02-d12d8e458380.mp4",
                  details: {
                    size: 9129281
                  },
                  contentType: "video/mp4",
                  url: "//videos.ctfassets.net/6pezt69ih962/7nl22wfhn7h36FW81Bwi41/36f08cd3d3acb658ec3f36451c6e04b0/53b040ff-b302-4b88-9c02-d12d8e458380.mp4"
                },
                description: "",
                title: "53b040ff-b302-4b88-9c02-d12d8e458380"
              },
              entryTitle: "Hamilton 15 second trailer",
              contentModelType: "media",
              entryId: "6XWHEZGGkIRpTZNOZvQya9",
              updatedAt: "2024-02-16T09:56:36.246Z"
            },
            {
              altText:
                "Production shot of Hamilton in London, with Shan Ako as Eliza Hamilton, Allyson Ava Brown as Angelica Schuyler and Roshani Abbey as Peggy Schuyler.",
              media: {
                file: {
                  fileName: "HamiltonPS5.png",
                  details: {
                    image: {
                      width: 1600,
                      height: 1200
                    },
                    size: 3363899
                  },
                  contentType: "image/png",
                  url: "//images.ctfassets.net/6pezt69ih962/2ryFyaGKLooaSFtquDcMhW/2d26457f71dae37cb8b31b557b536989/HamiltonPS5.png"
                },
                description: "",
                title:
                  "Shan Ako as Eliza Hamilton, Allyson Ava Brown as Angelica Schuyler, Roshani Abbey as Peggy Schuyler. Photo by Danny Kaan"
              },
              entryTitle: "HAM2",
              contentModelType: "media",
              entryId: "7uvmqHvLE8gzB9Y3tBydcf",
              updatedAt: "2024-02-14T21:38:24.166Z"
            }
          ],
          posterImage: {
            file: {
              fileName: "prod_1580719924849_HamPoster.jpg",
              details: {
                image: {
                  width: 480,
                  height: 720
                },
                size: 61779
              },
              contentType: "image/jpeg",
              url: "//images.ctfassets.net/6pezt69ih962/1LDjWFwIBcfRSEXA4BkL8T/860fedcfedf0a467703e9afa4caa67b0/prod_1580719924849_HamPoster.jpg"
            },
            title: "Hamilton Poster - LON"
          },
          posterImageSquare: {
            file: {
              fileName: "5388-1573115024-hamiltonsq071119.jpg",
              details: {
                image: {
                  width: 280,
                  height: 280
                },
                size: 22110
              },
              contentType: "image/jpeg",
              url: "//images.ctfassets.net/6pezt69ih962/66D2qh7F7c31dzfuJo1G3l/9428cd3abee7d347f5777cfbd58a9c01/5388-1573115024-hamiltonsq071119.jpg"
            },
            description: "Poster of Hamilton in London",
            title: "5388-1573115024-hamiltonsq071119"
          },
          entryTitle: "Hamilton [20561] - LON  Product Media",
          appHeroImage: {
            file: {
              fileName: "Hamilton - Hero",
              details: {
                image: {
                  width: 1440,
                  height: 580
                },
                size: 142189
              },
              contentType: "image/jpeg",
              url: "//images.ctfassets.net/6pezt69ih962/3fHQ41gqlpwWBHcawW3OIZ/33c9b17158e0cfa84cb2971d74ed7583/Hamilton_-_Hero"
            },
            description: "Hamilton - Hero",
            title: "Hamilton - Hero"
          },
          contentModelType: "productMedia",
          entryId: "909572963",
          updatedAt: "2024-02-16T10:00:05.340Z"
        },
        posterImageLandscape: null,
        heroImage: {
          file: {
            fileName:
              "Reuben Joseph as Hamilton, Waylon Jacobs, Jake Halsey-Jones and Emile Ruddock and Company. Photo by Danny Kaan.jpg",
            details: {
              image: {
                width: 1600,
                height: 1200
              },
              size: 788364
            },
            contentType: "image/jpeg",
            url: "//images.ctfassets.net/6pezt69ih962/7tdRGOQ5P7KD6qz6sIrI05/a6369f18a5edb12426bdeb7b1f3039d7/Reuben_Joseph_as_Hamilton__Waylon_Jacobs__Jake_Halsey-Jones_and_Emile_Ruddock_and_Company._Photo_by_Danny_Kaan.jpg"
          },
          description: "",
          title:
            "Reuben Joseph as Hamilton, Waylon Jacobs, Jake Halsey-Jones and Emile Ruddock and Company. Photo by Danny Kaan"
        },
        imagesAndVideos: [
          {
            videoCoverImage: {
              file: {
                fileName: "HamiltonPS1.png",
                details: {
                  image: {
                    width: 1600,
                    height: 1200
                  },
                  size: 3431636
                },
                contentType: "image/png",
                url: "//images.ctfassets.net/6pezt69ih962/31zEqyFmPBiBJG2Ee7IL2z/5ed3e5eb8859712293df4191283b3c45/HamiltonPS1.png"
              },
              description: "",
              title: "Ham1"
            },
            media: {
              file: {
                fileName: "53b040ff-b302-4b88-9c02-d12d8e458380.mp4",
                details: {
                  size: 9129281
                },
                contentType: "video/mp4",
                url: "//videos.ctfassets.net/6pezt69ih962/7nl22wfhn7h36FW81Bwi41/36f08cd3d3acb658ec3f36451c6e04b0/53b040ff-b302-4b88-9c02-d12d8e458380.mp4"
              },
              description: "",
              title: "53b040ff-b302-4b88-9c02-d12d8e458380"
            },
            entryTitle: "Hamilton 15 second trailer",
            contentModelType: "media",
            entryId: "6XWHEZGGkIRpTZNOZvQya9",
            updatedAt: "2024-02-16T09:56:36.246Z"
          },
          {
            altText:
              "Production shot of Hamilton in London, with Shan Ako as Eliza Hamilton, Allyson Ava Brown as Angelica Schuyler and Roshani Abbey as Peggy Schuyler.",
            media: {
              file: {
                fileName: "HamiltonPS5.png",
                details: {
                  image: {
                    width: 1600,
                    height: 1200
                  },
                  size: 3363899
                },
                contentType: "image/png",
                url: "//images.ctfassets.net/6pezt69ih962/2ryFyaGKLooaSFtquDcMhW/2d26457f71dae37cb8b31b557b536989/HamiltonPS5.png"
              },
              description: "",
              title:
                "Shan Ako as Eliza Hamilton, Allyson Ava Brown as Angelica Schuyler, Roshani Abbey as Peggy Schuyler. Photo by Danny Kaan"
            },
            entryTitle: "HAM2",
            contentModelType: "media",
            entryId: "7uvmqHvLE8gzB9Y3tBydcf",
            updatedAt: "2024-02-14T21:38:24.166Z"
          }
        ],
        posterImage: {
          file: {
            fileName: "prod_1580719924849_HamPoster.jpg",
            details: {
              image: {
                width: 480,
                height: 720
              },
              size: 61779
            },
            contentType: "image/jpeg",
            url: "//images.ctfassets.net/6pezt69ih962/1LDjWFwIBcfRSEXA4BkL8T/860fedcfedf0a467703e9afa4caa67b0/prod_1580719924849_HamPoster.jpg"
          },
          title: "Hamilton Poster - LON"
        },
        posterImageSquare: {
          file: {
            fileName: "5388-1573115024-hamiltonsq071119.jpg",
            details: {
              image: {
                width: 280,
                height: 280
              },
              size: 22110
            },
            contentType: "image/jpeg",
            url: "//images.ctfassets.net/6pezt69ih962/66D2qh7F7c31dzfuJo1G3l/9428cd3abee7d347f5777cfbd58a9c01/5388-1573115024-hamiltonsq071119.jpg"
          },
          description: "Poster of Hamilton in London",
          title: "5388-1573115024-hamiltonsq071119"
        }
      },
      isLotteryActive: true,
      isRushActive: false,
      locationId: TodayTixLocation.London,
      locationSeoName: "london",
      lotteryBannerText: "£10 Lottery tickets",
      lowPriceForLotteryTickets: {
        display: "£10",
        currency: "GBP",
        displayRounded: "£10",
        value: 10
      },
      lowPriceForRegularTickets: {
        display: "£23",
        currency: "GBP",
        displayRounded: "£23",
        value: 23.0
      },
      lowPriceForRushTickets: null,
      marketableLocationIds: [TodayTixLocation.London],
      maxDiscountPercentage: 0,
      name: "Hamilton",
      posterImageUrl:
        "https://images.ctfassets.net/6pezt69ih962/1LDjWFwIBcfRSEXA4BkL8T/860fedcfedf0a467703e9afa4caa67b0/prod_1580719924849_HamPoster.jpg",
      productType: ProductType.Show,
      promotion: null,
      ratingCount: 1648,
      relatedShows: [],
      rewards: {
        _type: "Rewards",
        maxAmount: 2,
        type: RewardType.Default
      },
      rushBannerText: null,
      savingsMessage: null,
      salesMessage:
        "A history lesson for both heart & head, it's the hottest show in the world for a reason. ",
      shouldShowPromotionsOnCards: true,
      showId: 20561,
      showName: "Hamilton",
      slug: "hamilton",
      startDate: "2021-08-19",
      subcategories: [
        {
          _type: "Category",
          name: "Award winners",
          id: 25,
          slug: "award-winners"
        }
      ],
      venue: "Victoria Palace Theatre",
      venueId: "172",
      venueUrl: "victoria-palace-theatre"
    },
    {
      admissionType: "TIMED",
      areLotteryTicketsAvailable: false,
      areRegularTicketsAvailable: true,
      areRushTicketsAvailable: false,
      areaTags: ["West End"],
      avgRating: 4.7783,
      carouselMedia: [],
      category: {
        _type: "Category",
        name: "Musicals",
        id: 8,
        slug: "musicals"
      },
      description:
        "Divorced, beheaded, live on stage! This award-winning musical brings the six wives of Henry VIII to life in a sensational pop concert. These fierce and feisty queens reclaim their stories, with catchy tunes and empowering lyrics, it's a historical remix that reigns supreme.",
      displayName: "SIX the Musical",
      endDate: "2024-11-03",
      genreTags: ["Musical"],
      hasPromotion: false,
      heroImageUrl:
        "https://images.ctfassets.net/6pezt69ih962/1mPlDr0V2bIsB45NBXiC8r/348ae0ae326e2a6b5b767537cf091879/SIX23042_TodayTix_1440x580pxls.jpg",
      id: 1,
      images: {
        productMedia: {
          headerImage: {
            file: {
              fileName: "SIX Header 2.jpg",
              details: {
                image: {
                  width: 1600,
                  height: 989
                },
                size: 2092608
              },
              contentType: "image/jpeg",
              url: "//images.ctfassets.net/6pezt69ih962/62nYHrfpgwsWFXWAvhn8CF/b0672177b384cc4c4d68aea2b2ed6457/SIX_Header_2.jpg"
            },
            description: "",
            title: "359 96A0697 SIX 2021 Pamela Raith Photography RT"
          },
          imagesAndVideos: [],
          posterImage: {
            file: {
              fileName: "SIX23042_TodayTix_480x720pxls.jpg",
              details: {
                image: {
                  width: 480,
                  height: 720
                },
                size: 397100
              },
              contentType: "image/jpeg",
              url: "//images.ctfassets.net/6pezt69ih962/4jU6Lh9ema4Q91naj8BH6s/150c98ef0d8f02b3de658090102dc1d2/SIX23042_TodayTix_480x720pxls.jpg"
            }
          },
          posterImageSquare: {
            file: {
              fileName: "SIX23042_TodayTix_1080x1080pxls.jpg",
              details: {
                image: {
                  width: 1080,
                  height: 1080
                },
                size: 1442283
              },
              contentType: "image/jpeg",
              url: "//images.ctfassets.net/6pezt69ih962/6urBQXG4aXijlc6UdnJdke/10333ad13639ba222573241ca3e76640/SIX23042_TodayTix_1080x1080pxls.jpg"
            }
          },
          entryTitle: "SIX - LON [1] Product Media",
          appHeroImage: {
            file: {
              fileName: "SIX23042_TodayTix_1440x580pxls.jpg",
              details: {
                image: {
                  width: 1440,
                  height: 580
                },
                size: 938692
              },
              contentType: "image/jpeg",
              url: "//images.ctfassets.net/6pezt69ih962/1mPlDr0V2bIsB45NBXiC8r/348ae0ae326e2a6b5b767537cf091879/SIX23042_TodayTix_1440x580pxls.jpg"
            }
          },
          contentModelType: "productMedia",
          entryId: "1246891700",
          updatedAt: "2023-12-08T14:40:25.009Z"
        },
        posterImageLandscape: null,
        heroImage: null,
        imagesAndVideos: [],
        posterImage: {
          file: {
            fileName: "SIX23042_TodayTix_480x720pxls.jpg",
            details: {
              image: {
                width: 480,
                height: 720
              },
              size: 397100
            },
            contentType: "image/jpeg",
            url: "//images.ctfassets.net/6pezt69ih962/4jU6Lh9ema4Q91naj8BH6s/150c98ef0d8f02b3de658090102dc1d2/SIX23042_TodayTix_480x720pxls.jpg"
          }
        },
        posterImageSquare: {
          file: {
            fileName: "SIX23042_TodayTix_1080x1080pxls.jpg",
            details: {
              image: {
                width: 1080,
                height: 1080
              },
              size: 1442283
            },
            contentType: "image/jpeg",
            url: "//images.ctfassets.net/6pezt69ih962/6urBQXG4aXijlc6UdnJdke/10333ad13639ba222573241ca3e76640/SIX23042_TodayTix_1080x1080pxls.jpg"
          }
        }
      },
      isLotteryActive: false,
      isRushActive: true,
      locationId: TodayTixLocation.London,
      locationSeoName: "london",
      lotteryBannerText: null,
      lowPriceForLotteryTickets: null,
      lowPriceForRegularTickets: {
        display: "£36",
        currency: "GBP",
        displayRounded: "£36",
        value: 36.0
      },
      lowPriceForRushTickets: {
        display: "£25",
        currency: "GBP",
        displayRounded: "£25",
        value: 25
      },
      marketableLocationIds: [TodayTixLocation.London],
      maxDiscountPercentage: 0,
      name: "SIX",
      posterImageUrl:
        "https://images.ctfassets.net/6pezt69ih962/4jU6Lh9ema4Q91naj8BH6s/150c98ef0d8f02b3de658090102dc1d2/SIX23042_TodayTix_480x720pxls.jpg",
      productType: ProductType.Show,
      promotion: null,
      ratingCount: 4878,
      relatedShows: [],
      rewards: {
        _type: "Rewards",
        maxAmount: 2,
        type: RewardType.Default
      },
      rushBannerText: "£25 Rush tickets",
      savingsMessage: null,
      salesMessage:
        "Henry's six wives take to the mic to reclaim their stories.",
      shouldShowPromotionsOnCards: true,
      showId: 1,
      showName: "SIX the Musical",
      slug: "six-the-musical",
      startDate: "2021-09-29",
      subcategories: [],
      venue: "Vaudeville Theatre",
      venueId: "185",
      venueUrl: "vaudeville-theatre"
    },
    {
      admissionType: "TIMED",
      areLotteryTicketsAvailable: false,
      areRegularTicketsAvailable: true,
      areRushTicketsAvailable: false,
      areaTags: ["West End"],
      avgRating: 4.62491,
      carouselMedia: [],
      category: {
        _type: "Category",
        name: "Musicals",
        id: 8,
        slug: "musicals"
      },
      description:
        'How did the Wicked Witch of the West get that name? Find out at this prequel to *The Wizard of Oz*, which has defied gravity in London since 2006. Hear songs like "Popular" and "Defying Gravity" at the story of how Elphaba and Glinda started out as friends before their lives changed for good.',
      displayName: "Wicked",
      endDate: "2024-12-15",
      genreTags: ["Family", "Musical"],
      hasPromotion: true,
      heroImageUrl:
        "https://images.ctfassets.net/6pezt69ih962/3JrWwn0D2c2B1FRPJ0rIN3/0e896294647e9316218515b7db3489ac/Wicked_-_Hero",
      id: 2,
      images: {
        productMedia: {
          imagesAndVideos: [],
          posterImage: {
            file: {
              fileName: "Wicked_480x720.jpg",
              details: {
                image: {
                  width: 480,
                  height: 720
                },
                size: 135747
              },
              contentType: "image/jpeg",
              url: "//images.ctfassets.net/6pezt69ih962/7AkVwNyOeUOYeoYOgxNxah/316f175bad5d73d0c66995cce15f7a1a/Wicked_480x720.jpg"
            }
          },
          posterImageSquare: {
            file: {
              fileName: "Wicked_TTG_1080x1080.jpg",
              details: {
                image: {
                  width: 1080,
                  height: 1080
                },
                size: 337303
              },
              contentType: "image/jpeg",
              url: "//images.ctfassets.net/6pezt69ih962/4OqVkgpspztv7qhwfSWswZ/fb1171b17ff499cce80240b129e5fc93/Wicked_TTG_1080x1080.jpg"
            }
          },
          entryTitle: "Wicked - LON [2]  Product Media",
          appHeroImage: {
            file: {
              fileName: "Wicked - Hero",
              details: {
                image: {
                  width: 1440,
                  height: 580
                },
                size: 94276
              },
              contentType: "image/jpeg",
              url: "//images.ctfassets.net/6pezt69ih962/3JrWwn0D2c2B1FRPJ0rIN3/0e896294647e9316218515b7db3489ac/Wicked_-_Hero"
            }
          },
          contentModelType: "productMedia",
          entryId: "1968706734",
          updatedAt: "2024-02-12T17:19:50.802Z"
        },
        posterImageLandscape: null,
        heroImage: {
          file: {
            fileName: "Wicked_header1.jpg",
            details: {
              image: {
                width: 1440,
                height: 1080
              },
              size: 1733389
            },
            contentType: "image/jpeg",
            url: "//images.ctfassets.net/6pezt69ih962/1GrTAOs1JWzVNKcssVutNa/957a17295cc579d4b7645b0543192850/Wicked_header1.jpg"
          }
        },
        imagesAndVideos: [],
        posterImage: {
          file: {
            fileName: "Wicked_480x720.jpg",
            details: {
              image: {
                width: 480,
                height: 720
              },
              size: 135747
            },
            contentType: "image/jpeg",
            url: "//images.ctfassets.net/6pezt69ih962/7AkVwNyOeUOYeoYOgxNxah/316f175bad5d73d0c66995cce15f7a1a/Wicked_480x720.jpg"
          }
        },
        posterImageSquare: {
          file: {
            fileName: "Wicked_TTG_1080x1080.jpg",
            details: {
              image: {
                width: 1080,
                height: 1080
              },
              size: 337303
            },
            contentType: "image/jpeg",
            url: "//images.ctfassets.net/6pezt69ih962/4OqVkgpspztv7qhwfSWswZ/fb1171b17ff499cce80240b129e5fc93/Wicked_TTG_1080x1080.jpg"
          }
        }
      },
      isLotteryActive: false,
      isRushActive: true,
      locationId: TodayTixLocation.London,
      locationSeoName: "london",
      lotteryBannerText: null,
      lowPriceForLotteryTickets: null,
      lowPriceForRegularTickets: {
        display: "£25",
        currency: "GBP",
        displayRounded: "£25",
        value: 25.0
      },
      lowPriceForRushTickets: {
        display: "£29.50",
        currency: "GBP",
        displayRounded: "£29.50",
        value: 29.5
      },
      marketableLocationIds: [TodayTixLocation.London],
      maxDiscountPercentage: 0,
      name: "Wicked",
      posterImageUrl:
        "https://images.ctfassets.net/6pezt69ih962/7AkVwNyOeUOYeoYOgxNxah/316f175bad5d73d0c66995cce15f7a1a/Wicked_480x720.jpg",
      productType: ProductType.Show,
      promotion: {
        _type: "Promotion",
        description: "London Theatre Week",
        voucherRestrictionsMessage: null,
        id: 266,
        label: "London Theatre Week",
        title: "LTW London Theatre Week",
        voucherCode: null,
        platforms: [Platform.IOS, Platform.Android, Platform.Web]
      },
      ratingCount: 16326,
      relatedShows: [],
      rewards: {
        _type: "Rewards",
        maxAmount: 2,
        type: RewardType.Default
      },
      rushBannerText: "The Daily Dozen",
      savingsMessage: null,
      salesMessage:
        "This bewitching and thrilling Oz musical has heart, brains, and courage.",
      shouldShowPromotionsOnCards: true,
      showId: 2,
      showName: "Wicked",
      slug: "wicked",
      startDate: "2021-09-15",
      subcategories: [],
      venue: "Apollo Victoria Theatre",
      venueId: "138",
      venueUrl: "apollo-victoria-theatre"
    },
    {
      admissionType: "TIMED",
      areLotteryTicketsAvailable: false,
      areRegularTicketsAvailable: true,
      areRushTicketsAvailable: false,
      areaTags: ["Off-West End"],
      avgRating: 4.61111,
      carouselMedia: [],
      category: {
        _type: "Category",
        name: "Musicals",
        id: 8,
        slug: "musicals"
      },
      description:
        "Luck be a show tonight! Starring Marisha Wallace and Celinde Schoenmaker, book your tickets to see this vibrant tale of gamblers, showgirls, and unlikely romances in 1950s New York City. Frank Loesser's sweeping score continues to delight audiences over seventy years later.",
      displayName: "Guys & Dolls",
      endDate: "2024-08-31",
      genreTags: ["Musical"],
      hasPromotion: true,
      heroImageUrl:
        "https://images.ctfassets.net/6pezt69ih962/3krB1LYKHogMKqYwuBEftq/a412f5f4e4a2b110569bd85af206444b/BT_G_D_TTG_1440x580.png",
      id: 3,
      images: {
        productMedia: {
          headerImage: {
            file: {
              fileName:
                "41. Cast of Guys _ Dolls at The Bridge Theatre, photo by Manuel Harlan.jpg",
              details: {
                image: {
                  width: 1600,
                  height: 1200
                },
                size: 1527572
              },
              contentType: "image/jpeg",
              url: "//images.ctfassets.net/6pezt69ih962/7pCxFFeZ8WIsA8iWrmpXg6/f5f0dc907c98958be4464569e07ce658/41._Cast_of_Guys___Dolls_at_The_Bridge_Theatre__photo_by_Manuel_Harlan.jpg"
            },
            description: "",
            title:
              "41. Cast of Guys Dolls at The Bridge Theatre, photo by Manuel Harlan"
          },
          imagesAndVideos: [],
          posterImage: {
            file: {
              fileName: "BT_G_D_TTG_480x720.png",
              details: {
                image: {
                  width: 480,
                  height: 720
                },
                size: 1086992
              },
              contentType: "image/png",
              url: "//images.ctfassets.net/6pezt69ih962/5EiIwnxRjHGl4uaEFtfM6q/d250f150d866bba3d5e8a95d68a28bd7/BT_G_D_TTG_480x720.png"
            }
          },
          posterImageSquare: {
            file: {
              fileName: "BT_G_D_TTG_1080x1080.png",
              details: {
                image: {
                  width: 1080,
                  height: 1080
                },
                size: 2350867
              },
              contentType: "image/png",
              url: "//images.ctfassets.net/6pezt69ih962/6D8x7fosmyKxlDgCALCBoy/0469eaa98f086bd904042632f963ff5a/BT_G_D_TTG_1080x1080.png"
            }
          },
          entryTitle: "Guys & Dolls - Seated - LON  Product Media",
          appHeroImage: {
            file: {
              fileName: "BT_G_D_TTG_1440x580.png",
              details: {
                image: {
                  width: 1440,
                  height: 580
                },
                size: 2261365
              },
              contentType: "image/png",
              url: "//images.ctfassets.net/6pezt69ih962/3krB1LYKHogMKqYwuBEftq/a412f5f4e4a2b110569bd85af206444b/BT_G_D_TTG_1440x580.png"
            }
          },
          contentModelType: "productMedia",
          entryId: "4089685023",
          updatedAt: "2024-01-16T11:03:57.848Z"
        },
        posterImageLandscape: null,
        heroImage: {
          file: {
            fileName:
              "41. Cast of Guys _ Dolls at The Bridge Theatre, photo by Manuel Harlan.jpg",
            details: {
              image: {
                width: 1600,
                height: 1200
              },
              size: 1527572
            },
            contentType: "image/jpeg",
            url: "//images.ctfassets.net/6pezt69ih962/7pCxFFeZ8WIsA8iWrmpXg6/f5f0dc907c98958be4464569e07ce658/41._Cast_of_Guys___Dolls_at_The_Bridge_Theatre__photo_by_Manuel_Harlan.jpg"
          }
        },
        imagesAndVideos: [],
        posterImage: {
          file: {
            fileName: "BT_G_D_TTG_480x720.png",
            details: {
              image: {
                width: 480,
                height: 720
              },
              size: 1086992
            },
            contentType: "image/png",
            url: "//images.ctfassets.net/6pezt69ih962/5EiIwnxRjHGl4uaEFtfM6q/d250f150d866bba3d5e8a95d68a28bd7/BT_G_D_TTG_480x720.png"
          }
        },
        posterImageSquare: {
          file: {
            fileName: "BT_G_D_TTG_1080x1080.png",
            details: {
              image: {
                width: 1080,
                height: 1080
              },
              size: 2350867
            },
            contentType: "image/png",
            url: "//images.ctfassets.net/6pezt69ih962/6D8x7fosmyKxlDgCALCBoy/0469eaa98f086bd904042632f963ff5a/BT_G_D_TTG_1080x1080.png"
          }
        }
      },
      isLotteryActive: false,
      isRushActive: true,
      locationId: TodayTixLocation.London,
      locationSeoName: "london",
      lotteryBannerText: null,
      lowPriceForLotteryTickets: null,
      lowPriceForRegularTickets: {
        display: "£22.50",
        currency: "GBP",
        displayRounded: "£22.50",
        value: 22.5
      },
      lowPriceForRushTickets: {
        value: 25,
        currency: "GBP",
        display: "£25",
        displayRounded: "£25"
      },
      marketableLocationIds: [TodayTixLocation.London],
      maxDiscountPercentage: 50,
      name: "Guys & Dolls",
      posterImageUrl:
        "https://images.ctfassets.net/6pezt69ih962/5EiIwnxRjHGl4uaEFtfM6q/d250f150d866bba3d5e8a95d68a28bd7/BT_G_D_TTG_480x720.png",
      productType: ProductType.Show,
      promotion: null,
      ratingCount: 18,
      relatedShows: [],
      rewards: {
        _type: "Rewards",
        maxAmount: 2,
        type: RewardType.Default
      },
      rushBannerText: "£25 Standing Rush tickets",
      savingsMessage: "Save 50%",
      salesMessage:
        "Nicholas Hytner directs The Bridge's new immersive production of the Broadway sensation.",
      shouldShowPromotionsOnCards: true,
      showId: 3,
      showName: "Guys & Dolls",
      slug: "guys-and-dolls",
      startDate: "2023-02-27",
      subcategories: [],
      venue: "Bridge Theatre",
      venueId: "76",
      venueUrl: "the-bridge-theatre"
    },
    {
      admissionType: "TIMED",
      areLotteryTicketsAvailable: false,
      areRegularTicketsAvailable: true,
      areRushTicketsAvailable: true,
      areaTags: ["West End"],
      avgRating: 4.6289,
      carouselMedia: [],
      category: {
        _type: "Category",
        name: "Musicals",
        id: 8,
        slug: "musicals"
      },
      description:
        "Simply the best musical in the West End! Journey through Tina Turner's chart-topping hits, from \"Proud Mary\" to \"What's Love Got to Do with It.\" Discover the inspiring story of her early struggles and rise to stardom, and witness how this rock 'n' roll legend defied boundaries.",
      displayName: "Tina",
      endDate: "2025-05-31",
      genreTags: ["Musical"],
      hasPromotion: true,
      heroImageUrl:
        "https://images.ctfassets.net/6pezt69ih962/4UVgHm95bydvrhFYCvnugV/4070ae37d6405150df6f916cf8566bc1/Tina_-_The_Tina_Turner_Musical_-_Hero",
      id: 4,
      images: {
        productMedia: {
          imagesAndVideos: [],
          posterImage: {
            file: {
              fileName: "TINA 4x7.jpg",
              details: {
                image: {
                  width: 480,
                  height: 720
                },
                size: 54986
              },
              contentType: "image/jpeg",
              url: "//images.ctfassets.net/6pezt69ih962/7DHW1Gn7FTIniFg8pK3svw/abe07c3d7cbf08cdca0607fd8177be2e/TINA_4x7.jpg"
            }
          },
          posterImageSquare: {
            file: {
              fileName: "TINA_1080x1080px.jpg",
              details: {
                image: {
                  width: 1080,
                  height: 1080
                },
                size: 608964
              },
              contentType: "image/jpeg",
              url: "//images.ctfassets.net/6pezt69ih962/1HnacTo35egiFx0Qf2BUGd/1b9497bb544ba1563bd95e1d2e70bf62/TINA_1080x1080px.jpg"
            }
          },
          entryTitle: "Tina - The Tina Turner Musical [4] - LON Product Media",
          appHeroImage: {
            file: {
              fileName: "Tina - The Tina Turner Musical - Hero",
              details: {
                image: {
                  width: 1440,
                  height: 580
                },
                size: 112451
              },
              contentType: "image/jpeg",
              url: "//images.ctfassets.net/6pezt69ih962/4UVgHm95bydvrhFYCvnugV/4070ae37d6405150df6f916cf8566bc1/Tina_-_The_Tina_Turner_Musical_-_Hero"
            }
          },
          contentModelType: "productMedia",
          entryId: "523425897",
          updatedAt: "2023-12-08T07:38:58.892Z"
        },
        posterImageLandscape: null,
        heroImage: null,
        imagesAndVideos: [],
        posterImage: {
          file: {
            fileName: "TINA 4x7.jpg",
            details: {
              image: {
                width: 480,
                height: 720
              },
              size: 54986
            },
            contentType: "image/jpeg",
            url: "//images.ctfassets.net/6pezt69ih962/7DHW1Gn7FTIniFg8pK3svw/abe07c3d7cbf08cdca0607fd8177be2e/TINA_4x7.jpg"
          }
        },
        posterImageSquare: {
          file: {
            fileName: "TINA_1080x1080px.jpg",
            details: {
              image: {
                width: 1080,
                height: 1080
              },
              size: 608964
            },
            contentType: "image/jpeg",
            url: "//images.ctfassets.net/6pezt69ih962/1HnacTo35egiFx0Qf2BUGd/1b9497bb544ba1563bd95e1d2e70bf62/TINA_1080x1080px.jpg"
          }
        }
      },
      isLotteryActive: false,
      isRushActive: true,
      locationId: TodayTixLocation.London,
      locationSeoName: "london",
      lotteryBannerText: null,
      lowPriceForLotteryTickets: null,
      lowPriceForRegularTickets: {
        display: "£13",
        currency: "GBP",
        displayRounded: "£13",
        value: 13.0
      },
      lowPriceForRushTickets: {
        display: "£25",
        currency: "GBP",
        displayRounded: "£25",
        value: 25
      },
      marketableLocationIds: [TodayTixLocation.London],
      maxDiscountPercentage: 0,
      name: "Tina - The Tina Turner Musical",
      posterImageUrl:
        "https://images.ctfassets.net/6pezt69ih962/7DHW1Gn7FTIniFg8pK3svw/abe07c3d7cbf08cdca0607fd8177be2e/TINA_4x7.jpg",
      productType: ProductType.Show,
      promotion: null,
      ratingCount: 5188,
      relatedShows: [],
      rewards: {
        _type: "Rewards",
        maxAmount: 2,
        type: RewardType.Default
      },
      rushBannerText: "£25 Rush tickets",
      savingsMessage: null,
      salesMessage:
        "A jubilant celebration of the iconic and unstoppable Tina Turner",
      shouldShowPromotionsOnCards: true,
      showId: 4,
      showName: "Tina",
      slug: "tina",
      startDate: "2021-08-05",
      subcategories: [],
      venue: "Aldwych Theatre",
      venueId: "112",
      venueUrl: "aldwych-theatre"
    }
  ]
};

const getShows400Response: TodayTixAPIv2ErrorResponse = {
  code: 400,
  error: "InvalidParameter",
  context: {
    parameterName: null,
    internalMessage:
      "Missing parameter location, discover, query, genres, date, maxPrice, or id"
  },
  title: "Error",
  message:
    "Missing parameter location, discover, query, genres, date, maxPrice, or id"
};

const getRushAndLotteryShowsNewYork200Response: TodayTixAPIv2Response<
  TodayTixShow[]
> = {
  code: 200,
  data: [
    {
      admissionType: "TIMED",
      areLotteryTicketsAvailable: false,
      areRegularTicketsAvailable: true,
      areRushTicketsAvailable: true,
      areaTags: [],
      avgRating: 4.6922199999999998,
      category: {
        _type: "Category",
        name: "Musicals",
        id: 8,
        slug: "musicals"
      },
      displayName: "Little Shop of Horrors",
      endDate: "2025-05-31",
      genreTags: ["Musical"],
      heroImageUrl:
        "https://images.ctfassets.net/6pezt69ih962/3BWDIxnmh6kpSFXh0389KR/0ab26a9af6a0ba1b7184e7618c79a329/Little_Shop_of_Horrors_-_Hero",
      id: 24608,
      images: {
        productMedia: {
          imagesAndVideos: [],
          posterImage: {
            file: {
              fileName: "",
              details: {
                image: {
                  width: 480,
                  height: 720
                },
                size: 54986
              },
              contentType: "image/jpeg",
              url: "//images.ctfassets.net/6pezt69ih962/rWG80L9TlvNF6YOPusY6Z/da81589ce57294e706ee681cb0dd50e9/359768039-lsh-1146w-todaytix-480x720-v1.jpg"
            }
          },
          posterImageSquare: {
            file: {
              fileName: "LITTLE_SHOP_1080x1080px.jpg",
              details: {
                image: {
                  width: 1080,
                  height: 1080
                },
                size: 608964
              },
              contentType: "image/jpeg",
              url: "//images.ctfassets.net/6pezt69ih962/rWG80L9TlvNF6YOPusY6Z/da81589ce57294e706ee681cb0dd50e9/359768039-lsh-1146w-todaytix-480x720-v1.jpg"
            }
          },
          entryTitle: "Little Shop of Horrors Product Media",
          appHeroImage: {
            file: {
              fileName: "Little Shop of Horrors - Hero",
              details: {
                image: {
                  width: 1440,
                  height: 580
                },
                size: 112451
              },
              contentType: "image/jpeg",
              url: "//images.ctfassets.net/6pezt69ih962/3BWDIxnmh6kpSFXh0389KR/0ab26a9af6a0ba1b7184e7618c79a329/Little_Shop_of_Horrors_-_Hero"
            }
          },
          contentModelType: "productMedia",
          entryId: "523425898",
          updatedAt: "2023-12-08T07:38:58.892Z"
        },
        posterImageLandscape: null,
        heroImage: null,
        imagesAndVideos: [],
        posterImage: {
          file: {
            fileName: "",
            details: {
              image: {
                width: 480,
                height: 720
              },
              size: 54986
            },
            contentType: "image/jpeg",
            url: "//images.ctfassets.net/6pezt69ih962/rWG80L9TlvNF6YOPusY6Z/da81589ce57294e706ee681cb0dd50e9/359768039-lsh-1146w-todaytix-480x720-v1.jpg"
          }
        },
        posterImageSquare: {
          file: {
            fileName: "LITTLE_SHOP_1080x1080px.jpg",
            details: {
              image: {
                width: 1080,
                height: 1080
              },
              size: 608964
            },
            contentType: "image/jpeg",
            url: "//images.ctfassets.net/6pezt69ih962/rWG80L9TlvNF6YOPusY6Z/da81589ce57294e706ee681cb0dd50e9/359768039-lsh-1146w-todaytix-480x720-v1.jpg"
          }
        }
      },
      isLotteryActive: false,
      isRushActive: true,
      locationId: TodayTixLocation.NewYork,
      lowPriceForRegularTickets: {
        value: 112,
        currency: "USD",
        display: "$112",
        displayRounded: "$112"
      },
      lowPriceForRushTickets: {
        value: 50,
        currency: "USD",
        display: "$50",
        displayRounded: "$50"
      },
      marketableLocationIds: [TodayTixLocation.NewYork],
      name: "Little Shop of Horrors",
      productType: ProductType.Show,
      ratingCount: 9111,
      rushBannerText: "$50 Rush tickets",
      showId: 24608
    }
  ]
};

const getShowsRoute = (router: Router) =>
  router.get<
    "/shows",
    null,
    TodayTixAPIv2Response<TodayTixShow[]> | TodayTixAPIv2ErrorResponse,
    null,
    TodayTixShowsReqQueryParams
  >("/shows", (req, res) => {
    if (req.query.areAccessProgramsActive) {
      res.json(
        Number(req.query.location) === TodayTixLocation.NewYork
          ? getRushAndLotteryShowsNewYork200Response
          : getRushAndLotteryShowsLondon200Response
      );
      return;
    }

    res.status(400).json(getShows400Response);
  });

export default getShowsRoute;
