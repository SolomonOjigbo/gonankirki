import React from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography } from '@mui/material';

// Dynamically import ReactApexChart to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const getColorForIndex = (index) => {
  const colors = ['#490101', '#FFCE56', '#FFA726', '#66BB6A', '#36A2EB'];
  return colors[index % colors.length];
};

const transformToChartData = (frequencyData) => {
  return Object.keys(frequencyData).map((key, index) => ({
    name: key,
    value: frequencyData[key],
    color: getColorForIndex(index),
  }));
};

const CropAvailabilityPieChart = ({ cropAvailabilityData, loading }) => {
  const getCropFrequency = (cropList) => {
    return cropList.reduce((acc, curr) => {
      const cropName = curr.cropProduced;
      acc[cropName] = (acc[cropName] || 0) + 1;
      return acc;
    }, {});
  };

  const cropFrequency = getCropFrequency(cropAvailabilityData);
  const chartData = transformToChartData(cropFrequency);

  const totalCrops = Object.values(cropFrequency).reduce((acc, value) => acc + value, 0);

  const chartSeries = chartData.map((data) => data.value);
  const chartLabels = chartData.map((data) => data.name);
  const chartColors = chartData.map((data) => data.color);

  const chartOptions = {
    chart: {
      type: 'donut',
    },
    labels: chartLabels,
    colors: chartColors,
    legend: {
      position: 'bottom',
    },
    dataLabels: {
      enabled: true,
    },
  };

  return (
    <Box>
      {loading ? (
        <Typography>Loading stats...</Typography>
      ) : (
        <Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <ReactApexChart
              options={chartOptions}
              series={chartSeries}
              type="donut"
              width={400}
            />
          </Box>
          <Box display="flex" justifyContent="center" marginTop={2}>
            <Typography variant="h6">Total: {totalCrops}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CropAvailabilityPieChart;
