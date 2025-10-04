#Planta App API schema’s

`/v1/addedPlants/`

##Example Value Schema

```
{
  "status": 200,
  "data": [
    {
      "id": "string",
      "names": {
        "localizedName": "string",
        "variety": "string",
        "custom": "string",
        "scientific": "string"
      },
      "site": {
        "id": "string",
        "name": "string",
        "hasGrowLight": true,
        "activeGrowLightHours": 0
      },
      "image": {
        "url": "string",
        "lastUpdated": "string"
      },
      "plantCare": {
        "customWatering": {
          "enabled": true,
          "intervalWarmPeriod": 0,
          "intervalColdPeriod": 0
        },
        "customFertilizing": {
          "enabled": true,
          "intervalWarmPeriod": 0,
          "intervalColdPeriod": 0
        }
      },
      "size": 0,
      "health": "poor",
      "environment": {
        "isNearAc": true,
        "isNearHeater": true,
        "light": {
          "distanceFromWindow": 0,
          "hasGrowLight": true,
          "activeGrowLightHours": 0
        },
        "pot": {
          "type": "potOriginalPlastic",
          "size": 0,
          "soil": "allPurposePottingMix",
          "hasDrainage": true
        }
      },
      "actions": {
        "watering": {
          "next": {
            "date": "string"
          },
          "completed": {
            "date": "string"
          }
        },
        "fertilizing": {
          "next": {
            "date": "string",
            "type": "liquid"
          },
          "completed": {
            "date": "string",
            "type": "liquid"
          }
        },
        "repotting": {
          "next": {
            "date": "string"
          },
          "completed": {
            "date": "string"
          }
        },
        "cleaning": {
          "next": {
            "date": "string"
          },
          "completed": {
            "date": "string"
          }
        },
        "progressUpdate": {
          "next": {
            "date": "string"
          },
          "completed": {
            "date": "string"
          }
        },
        "misting": {
          "next": {
            "date": "string"
          },
          "completed": {
            "date": "string"
          }
        }
      }
    }
  ],
  "pagination": {
    "nextPage": "8Acyb9VZTdGUJALpTbekjA"
  }
}
```

`/v1/addedPlants/{id}`

##Example Value Schema

```
{
  "status": 200,
  "data": {
    "id": "string",
    "names": {
      "localizedName": "string",
      "variety": "string",
      "custom": "string",
      "scientific": "string"
    },
    "site": {
      "id": "string",
      "name": "string",
      "hasGrowLight": true,
      "activeGrowLightHours": 0
    },
    "image": {
      "url": "string",
      "lastUpdated": "string"
    },
    "plantCare": {
      "customWatering": {
        "enabled": true,
        "intervalWarmPeriod": 0,
        "intervalColdPeriod": 0
      },
      "customFertilizing": {
        "enabled": true,
        "intervalWarmPeriod": 0,
        "intervalColdPeriod": 0
      }
    },
    "size": 0,
    "health": "poor",
    "environment": {
      "isNearAc": true,
      "isNearHeater": true,
      "light": {
        "distanceFromWindow": 0,
        "hasGrowLight": true,
        "activeGrowLightHours": 0
      },
      "pot": {
        "type": "potOriginalPlastic",
        "size": 0,
        "soil": "allPurposePottingMix",
        "hasDrainage": true
      }
    },
    "actions": {
      "watering": {
        "next": {
          "date": "string"
        },
        "completed": {
          "date": "string"
        }
      },
      "fertilizing": {
        "next": {
          "date": "string",
          "type": "liquid"
        },
        "completed": {
          "date": "string",
          "type": "liquid"
        }
      },
      "repotting": {
        "next": {
          "date": "string"
        },
        "completed": {
          "date": "string"
        }
      },
      "cleaning": {
        "next": {
          "date": "string"
        },
        "completed": {
          "date": "string"
        }
      },
      "progressUpdate": {
        "next": {
          "date": "string"
        },
        "completed": {
          "date": "string"
        }
      },
      "misting": {
        "next": {
          "date": "string"
        },
        "completed": {
          "date": "string"
        }
      }
    }
  }
}
```
