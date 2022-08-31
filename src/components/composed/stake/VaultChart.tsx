/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { FC, SetStateAction, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import BigNumber from 'bignumber.js';

import Txt from '@/components/based/Txt';
import { useTheme } from '@/state/application/hooks';

interface IVaultData {
  baseFee: BigNumber;
  netLoans: BigNumber;
  insuranceReserveBalance: BigNumber;
}

interface IVaultChart {
  vaultData: IVaultData | undefined;
  utilisationRate: BigNumber | 0;
  balance: BigNumber | 0;
}

const VaultChart: FC<IVaultChart> = ({
  vaultData,
  utilisationRate,
  balance,
}) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState<any>([]);
  const CHART_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
      line: {
        tension: 0.3,
        borderWidth: 1,
      },
    },
    scales: {
      xAxis: {
        display: true,
        title: {
          display: false,
        },
        grid: {
          borderColor: theme === 'dark' ? '#ffffff82' : '#00000082',
          color: theme === 'dark' ? '#ffffff13' : '#00000013',
          borderDash: [5, 5, 5],
        },
        ticks: {
          display: true,
        },
      },
      yAxis: {
        display: true,
        title: {
          display: true,
          text: 'APY',
        },
        grid: {
          borderColor: theme === 'dark' ? '#ffffff82' : '#00000082',
          color: theme === 'dark' ? '#ffffff13' : '#00000013',
          borderDash: [5, 5, 5],
        },
      },
    },
  };

  const data = {
    datasets: [
      {
        data: chartData,
        borderColor: theme === 'dark' ? '#fff' : '#000',
        borderWidth: 2,
      },
    ],
  };

  useEffect(() => {
    if (vaultData && utilisationRate !== 0 && balance !== 0) {
      if (vaultData.insuranceReserveBalance > vaultData.netLoans) {
        setChartData(vaultData.baseFee.toNumber() + utilisationRate.toNumber());
      } else {
        setChartData(
          vaultData.baseFee.toNumber() +
            (2 -
              vaultData.insuranceReserveBalance.toNumber() /
                (utilisationRate.toNumber() * balance.toNumber())) *
              utilisationRate.toNumber()
        );
      }
    }
  }, [utilisationRate, vaultData]);

  return (
    <div tw="w-full height[:auto] max-height[500px] box-content desktop:w-8/12 flex flex-col justify-between items-center rounded-xl p-5 desktop:p-10 bg-primary-100 desktop:pb-16">
      <Txt.Body1Bold>Vault Chart</Txt.Body1Bold>
      <Line options={CHART_OPTIONS} data={data} />
    </div>
  );
};

export default VaultChart;
