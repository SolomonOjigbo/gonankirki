import useFetchFarmers from "./useFetchFarmers";

export function getAllFarmerIds() {
    const {registeredFarmers} = useFetchFarmers();
    return registeredFarmers.map((farmers) => {
      return {
        params: {
          id: farmers.id,
        },
      };
    });
  }


  export function getAllInputRequestIds() {
    const {inputRequestData} = useFetchFarmers();


    return inputRequestData.map((farmers) => {
      return {
        params: {
          id: farmers.id,
        },
      };
    });
  }
  export function getAllCommodityIds() {
    const {cropAvailabilityData} = useFetchFarmers();


    return cropAvailabilityData.map((farmers) => {
      return {
        params: {
          id: farmers.id,
        },
      };
    });
  }