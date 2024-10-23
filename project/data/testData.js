// testData.js

export const testProperties = {
    data: {
        homes: [
            {
                streetLine: {
                    value: "123 Investment Ave",
                },
                city: "Austin",
                state: "TX",
                zip: "78701",
                price: {
                    value: 450000,
                },
                beds: 3,
                baths: 2,
                sqFt: {
                    value: 1800,
                },
                yearBuilt: {
                    value: 2015,
                },
                propertyType: "House",
                listingRemarks:
                    "Beautiful modern home in downtown Austin with recent updates throughout. Features include hardwood floors, granite countertops, and a spacious backyard.",
                location: {
                    value: "Downtown",
                },
                latLong: {
                    value: {
                        latitude: 30.2672,
                        longitude: -97.7431,
                    },
                },
            },
            {
                streetLine: {
                    value: "456 Growth Street",
                },
                city: "Austin",
                state: "TX",
                zip: "78704",
                price: {
                    value: 325000,
                },
                beds: 2,
                baths: 2,
                sqFt: {
                    value: 1200,
                },
                yearBuilt: {
                    value: 2010,
                },
                propertyType: "Condo",
                listingRemarks:
                    "Charming condo in the heart of South Austin. Perfect for investors looking for rental income. Close to restaurants and shopping.",
                location: {
                    value: "South Austin",
                },
                latLong: {
                    value: {
                        latitude: 30.25,
                        longitude: -97.75,
                    },
                },
            },
            {
                streetLine: {
                    value: "789 Rental Row",
                },
                city: "Austin",
                state: "TX",
                zip: "78702",
                price: {
                    value: 550000,
                },
                beds: 4,
                baths: 3,
                sqFt: {
                    value: 2200,
                },
                yearBuilt: {
                    value: 2018,
                },
                propertyType: "House",
                listingRemarks:
                    "Newly built investment property with high rental potential. Features include smart home technology and energy-efficient appliances.",
                location: {
                    value: "East Austin",
                },
                latLong: {
                    value: {
                        latitude: 30.26,
                        longitude: -97.72,
                    },
                },
            },
            {
                streetLine: {
                    value: "321 Townhome Terrace",
                },
                city: "Austin",
                state: "TX",
                zip: "78705",
                price: {
                    value: 425000,
                },
                beds: 3,
                baths: 2.5,
                sqFt: {
                    value: 1600,
                },
                yearBuilt: {
                    value: 2016,
                },
                propertyType: "Townhouse",
                listingRemarks:
                    "Modern townhouse near UT Austin. Excellent for student housing investment. Includes attached garage and private courtyard.",
                location: {
                    value: "University Area",
                },
                latLong: {
                    value: {
                        latitude: 30.28,
                        longitude: -97.74,
                    },
                },
            },
            {
                streetLine: {
                    value: "555 Luxury Lane",
                },
                city: "Austin",
                state: "TX",
                zip: "78703",
                price: {
                    value: 875000,
                },
                beds: 5,
                baths: 4,
                sqFt: {
                    value: 3500,
                },
                yearBuilt: {
                    value: 2020,
                },
                propertyType: "House",
                listingRemarks:
                    "Luxury investment property in prime location. High-end finishes throughout, resort-style backyard with pool.",
                location: {
                    value: "West Austin",
                },
                latLong: {
                    value: {
                        latitude: 30.29,
                        longitude: -97.76,
                    },
                },
            },
            {
                streetLine: {
                    value: "777 Condo Court",
                },
                city: "Austin",
                state: "TX",
                zip: "78701",
                price: {
                    value: 299000,
                },
                beds: 1,
                baths: 1,
                sqFt: {
                    value: 750,
                },
                yearBuilt: {
                    value: 2012,
                },
                propertyType: "Condo",
                listingRemarks:
                    "Downtown studio condo perfect for short-term rental investment. Building includes pool, gym, and concierge service.",
                location: {
                    value: "Downtown",
                },
                latLong: {
                    value: {
                        latitude: 30.266,
                        longitude: -97.742,
                    },
                },
            },
        ],
    },
    message: "Success",
    resultsPerPage: 6,
    totalResultCount: 6,
    status: true,
};

// Helper function to filter properties based on search criteria
export function filterProperties(
    properties,
    { location, propertyType, minPrice, maxPrice }
) {
    return properties.data.homes.filter((property) => {
        const matchesLocation = location
            ? property.city.toLowerCase().includes(location.toLowerCase()) ||
              property.zip.includes(location) ||
              property.location.value
                  .toLowerCase()
                  .includes(location.toLowerCase())
            : true;

        const matchesType = propertyType
            ? property.propertyType === propertyType
            : true;

        const matchesMinPrice = minPrice
            ? property.price.value >= parseInt(minPrice)
            : true;

        const matchesMaxPrice = maxPrice
            ? property.price.value <= parseInt(maxPrice)
            : true;

        return (
            matchesLocation && matchesType && matchesMinPrice && matchesMaxPrice
        );
    });
}

// Example usage:
/*
  import { testProperties, filterProperties } from './testData.js';
  
  // Replace the API call in your search function with:
  function searchProperties(location, propertyType, minPrice, maxPrice) {
    const searchCriteria = {
      location,
      propertyType,
      minPrice,
      maxPrice
    };
    
    return filterProperties(testProperties, searchCriteria);
  }
  */
