import { useState, useMemo } from "react";
import { Box, Card, CircularProgress, Stack, styled, useTheme } from "@mui/material";
import { nanoid } from "nanoid";
import merge from "lodash.merge";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";

import { FlexBetween } from "components/flexbox";
import { Paragraph } from "components/typography";
import { MoreButton } from "components/more-button"; // CUSTOM UTILS METHODS

import { baseChartOptions } from "utils/baseChartOptions"; // STYLED COMPONENTS
import useFetchUsers from "hooks/useFetchUsers";
import useFetchFarmers from "hooks/useFetchFarmers";

const ChartWrapper = styled(Box)({
  "& .apexcharts-tooltip-text-y-value": {
    marginLeft: 0,
  },
  "& .apexcharts-xaxistooltip": {
    display: "none !important",
  },
});

const TopContentWrapper = styled(FlexBetween)(({ theme }) => ({
  [theme.breakpoints.down(730)]: {
    flexDirection: "column",
    "& .list-item": {
      flex: 1,
    },
    "& .list": {
      width: "100%",
    },
    "& > button": {
      display: "none",
    },
  },
}));

const BoxWrapper = styled(Box)(({ theme, active }) => ({
  padding: "1.5rem",
  cursor: "pointer",
  borderRadius: "0 0 12px 12px",
  ...(active && {
    backgroundColor: theme.palette.action.selected,
  }),
}));

const ChartFilters = ({ type = "area" }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { users } = useFetchUsers();
  const { registeredFarmers, cropAvailabilityData, inputRequestData, loading, error } = useFetchFarmers();

  const groupDataByDate = (data, dateKey) => {
    const counts = {};
    data.forEach((item) => {
      const date = new Date(item[dateKey]).toLocaleDateString();
      counts[date] = (counts[date] || 0) + 1;
    });
    return counts;
  };

  const farmerCountsByDate = useMemo(() => groupDataByDate(registeredFarmers, "dateRegistered"), [registeredFarmers]);
  const userCountsByDate = useMemo(() => groupDataByDate(users, "lastUpdated"), [users]);
  const cropCountsByDate = useMemo(() => groupDataByDate(cropAvailabilityData, "dateSubmitted"), [cropAvailabilityData]);
  const inputCountsByDate = useMemo(() => groupDataByDate(inputRequestData, "dateSubmitted"), [inputRequestData]);

  const allDates = useMemo(() => {
    const dates = new Set([
      ...Object.keys(farmerCountsByDate),
      ...Object.keys(userCountsByDate),
      ...Object.keys(cropCountsByDate),
      ...Object.keys(inputCountsByDate),
    ]);
    return Array.from(dates).sort((a, b) => new Date(a) - new Date(b));
  }, [farmerCountsByDate, userCountsByDate, cropCountsByDate, inputCountsByDate]);

  const seriesData = {
    "Registered Farmers": allDates.map((date) => farmerCountsByDate[date] || 0),
    "BDSP/Users": allDates.map((date) => userCountsByDate[date] || 0),
    "Crop Availability Submissions": allDates.map((date) => cropCountsByDate[date] || 0),
    "Farm Input Requests": allDates.map((date) => inputCountsByDate[date] || 0),
  };

  const LIST = [
    {
      id: nanoid(),
      title: "BDSP/Users",
      value: users.length,
      percentage: 12.5,
    },
    {
      id: nanoid(),
      title: "Registered Farmers",
      value: registeredFarmers.length,
      percentage: 5.56,
    },
    {
      id: nanoid(),
      title: "Crop Availability Submissions",
      value: cropAvailabilityData.length,
      percentage: 21.5,
    },
    {
      id: nanoid(),
      title: "Farm Input Requests",
      value: inputRequestData.length,
      percentage: 10.5,
    },
  ];

  const [selectedItem, setSelectedItem] = useState(LIST[1].title);

  const chartSeries = [
    {
      name: selectedItem,
      data: seriesData[selectedItem],
    },
  ];

  const chartOptions = merge(baseChartOptions(theme), {
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: theme.palette.divider,
    },
    colors: [theme.palette.primary.main],
    xaxis: {
      categories: allDates,
      labels: {
        show: true,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => value.toLocaleString(),
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yyyy",
      },
    },
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card>
      <TopContentWrapper gap={4}>
        <Stack className="list" gap={1} direction={{ sm: "row", xs: "column" }}>
          {LIST.map((item) => (
            <BoxWrapper
              key={item.id}
              className="list-item"
              onClick={() => setSelectedItem(item.title)}
              active={selectedItem === item.title ? 1 : 0}
            >
              <Paragraph ellipsis lineHeight={1} fontWeight={500} color="text.secondary">
                {t(item.title)}
              </Paragraph>
              <Paragraph fontSize={22} fontWeight={600}>
                {item.value}
              </Paragraph>
              <Paragraph fontWeight={500} color={item.percentage > 0 ? "success.main" : "error.main"}>
                {item.percentage > 0 && "+"}
                {item.percentage}%
              </Paragraph>
            </BoxWrapper>
          ))}
        </Stack>
        <MoreButton sx={{ mr: 3 }} />
      </TopContentWrapper>

      <ChartWrapper p={3}>
        <Chart type={type} height={300} series={chartSeries} options={chartOptions} />
      </ChartWrapper>
    </Card>
  );
};

export default ChartFilters;
