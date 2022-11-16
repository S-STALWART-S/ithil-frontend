/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { BigNumber as BN } from '@ethersproject/bignumber';

import { useQuoter } from './useQuoter';
import { useComputePairRiskFactor } from './useComputePairRiskFactor';
import { useChainId } from '.';

import { OpenedPositionType, StrategyContractType } from 'src/global/types';
import { formatAmount, getTokenByAddress } from 'src/global/utils';

export default function usePositionDetails(
  details: OpenedPositionType,
  strategy?: StrategyContractType
) {
  const chainId = useChainId();
  const principalValue = useMemo(
    () => new BigNumber(BN.from(details.principal).toString()),
    [details]
  );
  const collateralValue = useMemo(
    () => new BigNumber(BN.from(details.collateral).toString()),
    [details]
  );
  const allowanceValue = useMemo(
    () => new BigNumber(BN.from(details.allowance).toString()),
    [details]
  );
  const owedToken = useMemo(
    () => getTokenByAddress(details.owedToken, chainId),
    [chainId, details.owedToken]
  );
  const heldToken = useMemo(
    () =>
      getTokenByAddress(details.heldToken, chainId) ||
      (owedToken && {
        name: `${strategy?.type} ${owedToken.name}`,
        address: details.heldToken,
        symbol: `y${owedToken.symbol}`,
        decimals: owedToken.decimals,
        logoURI: owedToken.logoURI,
      }),
    [chainId, details.heldToken, owedToken, strategy?.type]
  );
  const collateralToken = useMemo(
    () => getTokenByAddress(details.collateralToken, chainId),
    [chainId, details.collateralToken]
  );

  const longShortValue = useMemo(() => {
    return details.collateralToken === details.owedToken ? 'Long' : 'Short';
  }, [details]);

  const leverageValue = useMemo(() => {
    return longShortValue === 'Long'
      ? principalValue.plus(collateralValue).dividedBy(collateralValue)
      : allowanceValue.minus(collateralValue).dividedBy(collateralValue);
  }, [longShortValue, principalValue, collateralValue, allowanceValue]);

  const tokenPairValue = useMemo(() => {
    return longShortValue === 'Long'
      ? `${heldToken?.symbol}/${collateralToken?.symbol}`
      : `${owedToken?.symbol}/${collateralToken?.symbol}`;
  }, [longShortValue, collateralToken, heldToken, owedToken]);

  const openPriceValue = useMemo(() => {
    if (!heldToken || !owedToken) return undefined;
    const _priceValue =
      longShortValue === 'Long'
        ? principalValue.plus(collateralValue).dividedBy(allowanceValue)
        : allowanceValue.minus(collateralValue).dividedBy(principalValue);
    return _priceValue.multipliedBy(
      new BigNumber(10).pow(
        longShortValue === 'Long'
          ? heldToken.decimals - owedToken.decimals
          : owedToken.decimals - heldToken.decimals
      )
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
    return `${strategy?.label} ${
      strategy?.type === 'margin' ? `${longShortValue}` : ''
    }`;
  }, [strategy, longShortValue, tokenPairValue]);

  const currentPrice = useQuoter(
    longShortValue === 'Long' ? details.heldToken : details.owedToken,
    longShortValue === 'Long' ? details.owedToken : details.heldToken,
    longShortValue === 'Long' ? allowanceValue : principalValue,
    strategy
  );

  const currentPriceValue = useMemo(() => {
    if (!heldToken || !owedToken || !currentPrice) return undefined;
    return currentPrice
      .dividedBy(longShortValue === 'Long' ? allowanceValue : principalValue)
      .multipliedBy(
        new BigNumber(10).pow(
          longShortValue === 'Long'
            ? heldToken.decimals - owedToken.decimals
            : owedToken.decimals - heldToken.decimals
        )
      );
  }, [currentPrice, heldToken, owedToken]);

  const riskFactor = useComputePairRiskFactor(
    details.owedToken,
    details.heldToken,
    strategy
  );

  const feesValue = useMemo(() => {
    const _feesValue = new BigNumber(BN.from(details.fees).toString());
    const interestRateValue = new BigNumber(
      BN.from(details.interestRate).toString()
    );
    const createdAtValue = new BigNumber(BN.from(details.createdAt).toString());

    const now = new BigNumber(Math.floor(new Date().getTime() / 1000));
    return interestRateValue
      .multipliedBy(now.minus(createdAtValue))
      .multipliedBy(principalValue)
      .dividedBy(864000000)
      .plus(_feesValue);
  }, [details, principalValue]);

  const liqPriceValue = useMemo(() => {
    if (!heldToken || !owedToken) return undefined;
    if (longShortValue === 'Long')
      return collateralValue
        .multipliedBy(riskFactor)
        .dividedBy(10000)
        .plus(principalValue.plus(feesValue))
        .multipliedBy(new BigNumber(10).pow(heldToken.decimals))
        .dividedBy(
          allowanceValue.multipliedBy(new BigNumber(10).pow(owedToken.decimals))
        );
    else
      return allowanceValue
        .minus(collateralValue.multipliedBy(riskFactor).dividedBy(10000))
        .multipliedBy(new BigNumber(10).pow(owedToken.decimals))
        .dividedBy(
          principalValue
            .plus(feesValue)
            .multipliedBy(new BigNumber(10).pow(heldToken.decimals))
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

  const quoteValue = useQuoter(
    longShortValue === 'Long' ? details.heldToken : details.owedToken,
    longShortValue === 'Long' ? details.owedToken : details.heldToken,
    longShortValue === 'Long' ? allowanceValue : principalValue.plus(feesValue),
    strategy
  );

  const pnlValue = useMemo(() => {
    if (!quoteValue) return BigNumber(0);
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
      !pnlValue.isGreaterThan(0) ? '' : '+'
    }${formatAmount(pnlValue, collateralToken?.decimals)} (${pnlValue
      .multipliedBy(100)
      .dividedBy(collateralValue)
      .toFixed(2)}%)`;
  }, [collateralToken, collateralValue, pnlValue]);

  const createdAtValue = useMemo(() => {
    return new Date(
      Number(BN.from(details.createdAt).toString()) * 1000
    ).toLocaleString();
  }, [details]);

  return {
    longShortValue,
    leverageValue,
    positionValue,
    openPriceValue,
    tokenPairValue,
    allowanceValue,
    principalValue,
    currentPriceValue,
    liqPriceValue,
    collateralToken,
    collateralValue,
    heldToken,
    owedToken,
    distFromLiquidation,
    pnlText,
    pnlValue,
    createdAtValue,
    feesValue,
    quoteValue,
  };
}
