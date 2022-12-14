import React from "react";

import { useGetManagedFacilitiesQuery } from "../../../generated/graphql";

import ManageFacilities from "./ManageFacilities";

const ManageFacilitiesContainer: any = () => {
  const { data, loading, error } = useGetManagedFacilitiesQuery({
    fetchPolicy: "no-cache",
  });

  type SettingsData = {
    organization: {
      facilities: Facility[];
    };
  };

  const settingsData = data as SettingsData;

  if (loading) {
    return <p> Loading... </p>;
  }
  if (error) {
    return error;
  }
  if (!settingsData || !settingsData.organization) {
    return <p>Error: facilities not found</p>;
  }

  return <ManageFacilities facilities={settingsData.organization.facilities} />;
};

export default ManageFacilitiesContainer;
