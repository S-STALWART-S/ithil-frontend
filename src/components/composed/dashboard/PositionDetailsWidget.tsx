/** @jsxImportSource @emotion/react */
import tw from 'twin.macro';
import React, { FC, useMemo } from 'react';
import BigNumber from 'bignumber.js';

import Txt from '@/components/based/Txt';
import { formatAmount, getTokenByAddress } from '@/global/utils';
import {
  useComputePairRiskFactor,
  useQuote,
} from '@/hooks/useMarginTradingStrategy';

interface IDetailItem {
  label: string;
  value: string;
  details?: string;
  valueColor?: 'black' | 'red' | 'green';
}

const DetailItem: FC<IDetailItem> = ({ label, value, details, valueColor }) => {
  return (
    <div tw="flex flex-row justify-between w-full">
      <div tw="flex gap-2 items-center">
        <Txt.Body2Regular tw="text-secondary">{label}</Txt.Body2Regular>
      </div>
      <div tw="flex flex-row gap-2">
        {details && (
          <Txt.Body2Regular tw="text-font-100">{details}</Txt.Body2Regular>
        )}
        {value && (
          <Txt.Body2Bold
            css={[
              tw`text-secondary ml-2`,
              valueColor === 'green' && tw`text-success`,
              valueColor === 'red' && tw`text-error`,
            ]}
          >
            {value}
          </Txt.Body2Bold>
        )}
      </div>
    </div>
  );
};

interface IPositionDetailsWidget {
  details: any;
}

const PositionDetailsWidget: FC<IPositionDetailsWidget> = ({ details }) => {
  const principalValue = useMemo(
    () => new BigNumber(details.principal.toString()),
    [details]
  );
  const collateralValue = useMemo(
    () => new BigNumber(details.collateral.toString()),
    [details]
  );
  const allowanceValue = useMemo(
    () => new BigNumber(details.allowance.toString()),
    [details]
  );
  const owedToken = useMemo(
    () => getTokenByAddress(details.owedToken),
    [details]
  );
  const heldToken = useMemo(
    () => getTokenByAddress(details.heldToken),
    [details]
  );
  const collateralToken = useMemo(
    () => getTokenByAddress(details.collateralToken),
    [details]
  );

  const longShortValue = useMemo(() => {
    return details.collateralToken === details.owedToken ? 'Long' : 'Short';
  }, [details]);

  const leverageValue = useMemo(() => {
    return longShortValue === 'Long'
      ? principalValue.plus(collateralValue).dividedBy(collateralValue)
      : allowanceValue.dividedBy(collateralValue);
  }, [allowanceValue, collateralValue, longShortValue, principalValue]);

  const tokenPairValue = useMemo(() => {
    return longShortValue === 'Long'
      ? `${collateralToken?.symbol}/${heldToken?.symbol}`
      : `${collateralToken?.symbol}/${owedToken?.symbol}`;
  }, [longShortValue, collateralToken, heldToken, owedToken]);

  const openPriceValue = useMemo(() => {
    if (!heldToken || !owedToken) return undefined;
    const _priceValue =
      longShortValue === 'Long'
        ? principalValue.plus(collateralValue).dividedBy(allowanceValue)
        : allowanceValue.minus(collateralValue).dividedBy(principalValue);
    return _priceValue.multipliedBy(
      new BigNumber(10).pow(heldToken.decimals - owedToken.decimals)
    );
  }, [
    allowanceValue,
    collateralValue,
    heldToken,
    longShortValue,
    owedToken,
    principalValue,
  ]);

  const positionValue = useMemo(() => {
    return `${tokenPairValue} ${leverageValue.toFixed(2)}x ${longShortValue}`;
  }, [tokenPairValue, leverageValue, longShortValue]);

  const currentPrice = useQuote(
    longShortValue === 'Long' ? details.heldToken : details.owedToken,
    longShortValue === 'Long' ? details.owedToken : details.heldToken,
    new BigNumber(1)
  );

  const currentPriceValue = useMemo(() => {
    if (!heldToken || !owedToken) return undefined;
    return currentPrice.multipliedBy(
      new BigNumber(10).pow(heldToken.decimals - owedToken.decimals)
    );
  }, [currentPrice, heldToken, owedToken]);

  const riskFactor = useComputePairRiskFactor(
    details.owedToken,
    details.heldToken
  );
  /*
(principal+- collateral* (riskFactor/10000)) * 10^heldTokenDecimals/(allowance * 10^owedTokenDecimals)
  */
  const liqPriceValue = useMemo(() => {
    if (!heldToken || !owedToken) return undefined;
    return collateralValue
      .multipliedBy(riskFactor)
      .dividedBy(100000)
      .multipliedBy(longShortValue === 'Long' ? 1 : -1)
      .plus(principalValue)
      .multipliedBy(new BigNumber(10).pow(heldToken.decimals))
      .dividedBy(
        allowanceValue.multipliedBy(new BigNumber(10).pow(owedToken.decimals))
      );
  }, [
    allowanceValue,
    collateralValue,
    heldToken,
    longShortValue,
    owedToken,
    principalValue,
    riskFactor,
  ]);

  const distFromLiquidation = useMemo(() => {
    if (!liqPriceValue || !currentPriceValue) return undefined;
    return longShortValue === 'Long'
      ? currentPriceValue.dividedBy(liqPriceValue).minus(1).multipliedBy(100)
      : liqPriceValue.dividedBy(currentPriceValue).minus(1).multipliedBy(100);
  }, [currentPriceValue, liqPriceValue, longShortValue]);

  const feesValue = useMemo(() => {
    const _feesValue = new BigNumber(details.fees.toString());
    const interestRateValue = new BigNumber(details.interestRate.toString());
    const timestamp = new BigNumber(Math.floor(new Date().getTime() / 1000));
    const createdAtValue = new BigNumber(details.createdAt.toString());
    return interestRateValue
      .multipliedBy(timestamp.minus(createdAtValue))
      .multipliedBy(principalValue)
      .dividedBy(864000000)
      .plus(_feesValue);
  }, [details, principalValue]);

  // console.log(formatAmount(feesValue, collateralToken?.decimals));
  const quoteValue = useQuote(
    longShortValue === 'Long' ? details.heldToken : details.owedToken,
    longShortValue === 'Long' ? details.owedToken : details.heldToken,
    longShortValue === 'Long' ? allowanceValue : principalValue.plus(feesValue)
  );

  const pnlValue = useMemo(() => {
    return longShortValue === 'Long'
      ? quoteValue.minus(principalValue).minus(collateralValue).minus(feesValue)
      : allowanceValue.minus(quoteValue).minus(collateralValue);
  }, [
    allowanceValue,
    collateralValue,
    feesValue,
    longShortValue,
    principalValue,
    quoteValue,
  ]);

  const pnlText = useMemo(() => {
    return `${collateralToken?.symbol} ${
      pnlValue.isLessThan(0) ? '' : '+'
    }${formatAmount(pnlValue, collateralToken?.decimals)} (${pnlValue
      .multipliedBy(100)
      .dividedBy(collateralValue)
      .toFixed(2)}%)`;
  }, [collateralToken, collateralValue, pnlValue]);

  const createdAtValue = useMemo(() => {
    return new Date(
      Number(details.createdAt.toString()) * 1000
    ).toLocaleDateString();
  }, [details]);

  return (
    <div tw="flex flex-col w-full mb-3">
      <div tw="flex flex-col justify-between items-center rounded-xl p-6 bg-primary-100 gap-2">
        <Txt.Heading2 tw="mb-4">Position details</Txt.Heading2>

        <DetailItem
          label="Position"
          value={leverageValue.toFixed(2)}
          details={positionValue}
        />
        {openPriceValue && (
          <DetailItem
            label="Open price"
            value={openPriceValue.toFixed(2)}
            details={tokenPairValue}
          />
        )}
        {currentPriceValue && (
          <DetailItem
            label="Current price"
            value={currentPriceValue.toFixed(2)}
            details={tokenPairValue}
          />
        )}
        {liqPriceValue && (
          <DetailItem
            label="Liq. price"
            value={liqPriceValue.toFixed(2)}
            details={tokenPairValue}
          />
        )}
        <DetailItem
          label="Collateral"
          value={formatAmount(
            details.collateral.toString(),
            collateralToken?.decimals
          )}
          details={tokenPairValue.split('/')[0]}
        />
        {distFromLiquidation && (
          <DetailItem
            label="Distance from liquidation"
            value={`${distFromLiquidation.toFixed(2)}%`}
          />
        )}
        <DetailItem
          label="Profit"
          value={pnlText}
          valueColor={pnlValue.isLessThan(0) ? 'red' : 'green'}
        />
        <DetailItem label="Opened" value={createdAtValue} />
      </div>
    </div>
  );
};

export default PositionDetailsWidget;
