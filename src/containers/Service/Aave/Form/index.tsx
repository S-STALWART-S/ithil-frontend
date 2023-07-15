import {
  HStack,
  Input,
  InputRightElement,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Box, Button, InputGroup, useColorMode } from "@chakra-ui/react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { aaveABI } from "@/abi";
import TokenIcon from "@/components/TokenIcon";
import TokenModal from "@/components/TokenModal";
import { EstimatedValue } from "@/components/estimated-value";
import { Loading } from "@/components/loading";
import { getDecimalRegex } from "@/data/regex";
import { aaveAddress } from "@/hooks/generated/aave";
import { useToken } from "@/hooks/use-token.hook";
import { useTransactionFeedback } from "@/hooks/use-transaction.hook";
import { useBaseApy } from "@/hooks/useBaseApy";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useNotificationDialog } from "@/hooks/useNotificationDialog";
import { usePrepareOrder } from "@/hooks/usePrepareOrder";
import { palette } from "@/styles/theme/palette";
import { AaveAsset } from "@/types/onchain.types";
import {
  abbreviateBigNumber,
  stringInputToBigNumber,
} from "@/utils/input.utils";
import { mode, pickColor } from "@/utils/theme";

import AdvanceSection from "../../AdvanceSection";
// import AdvancedFormLabel from "./AdvancedFormLabel";
import FormDescriptionItem from "../../FormDescriptionItem";

// import DepositForm from "./DepositForm"

const Form = ({ asset }: { asset: AaveAsset }) => {
  const {
    query: { asset: token },
  } = useRouter();

  const { address, isConnected } = useAccount();
  const chainId = useChainId() as 98745;
  const [inputAmount, setInputAmount] = useState<string>("0");
  const inputBigNumber = asset?.decimals
    ? stringInputToBigNumber(inputAmount, asset?.decimals)
    : 0n;
  const [leverage, setLeverage] = useState("1.5");
  const [slippage, setSlippage] = useState("0.1");
  const notificationDialog = useNotificationDialog();

  // web3 hooks
  const { trackTransaction, reportException } = useTransactionFeedback();

  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address,
    token: asset?.tokenAddress,
    cacheTime: 5_000,
    watch: true,
  });
  const { useAllowance, useApprove } = useToken(asset?.tokenAddress);
  const { data: allowance, refetch: refetchAllowance } = useAllowance(
    address,
    aaveAddress[chainId]
  );
  const {
    data: approveData,
    isLoading: isApproveLoading,
    writeAsync: approve,
  } = useApprove(aaveAddress[chainId], inputBigNumber);
  const { isLoading: isApproveWaiting } = useWaitForTransaction({
    hash: approveData?.hash,
  });

  const { order, displayInterestAndSpreadInPercent } = usePrepareOrder(
    asset?.tokenAddress,
    asset?.aTokenAddress,
    inputBigNumber,
    +leverage
  );

  const { address: accountAddress } = useAccount();
  const {
    data: openData,
    isLoading: isOpenLoading,
    writeAsync: open,
  } = useContractWrite({
    abi: aaveABI,
    address: aaveAddress[98745],
    functionName: "open",
    args: [order],
    account: accountAddress,
  });

  const { isLoading: isOpenWaiting } = useWaitForTransaction({
    hash: openData?.hash,
  });

  // computed properties
  const isApproved = allowance ? allowance >= inputBigNumber : false;
  const isButtonLoading =
    isApproveLoading || isApproveWaiting || isOpenLoading || isOpenWaiting;
  const isInconsistent = inputBigNumber > (balance?.value ?? 0);
  const isButtonDisabled =
    isButtonLoading || isInconsistent || inputBigNumber === BigInt(0);
  const isMaxDisabled = inputBigNumber === (balance?.value ?? 0);

  const onInputChange = (value: string) => {
    if (!asset?.decimals) return;
    if (getDecimalRegex(asset?.decimals).test(value) || value === "")
      setInputAmount(value);
  };
  const onActionClick = async () => {
    try {
      if (!isApproved) {
        const result = await approve?.();
        await trackTransaction(result, `Approve ${inputAmount} ${asset?.name}`);
        await refetchAllowance();
        return;
      }

      const result = await open?.();
      await trackTransaction(result, `Deposit ${inputAmount} ${asset?.name}`);
      await refetchAllowance();
      setInputAmount("0");
    } catch (error) {
      notificationDialog.openDialog({
        title: (error as { shortMessage: string }).shortMessage,
        status: "error",
      });
    }
  };
  const onMaxClick = () => {
    setInputAmount(balance?.formatted ?? "0");
  };

  const { openConnectModal } = useConnectModal();
  const { isOpen, onOpen, onClose } = useDisclosure({});
  const isMounted = useIsMounted();

  const { colorMode } = useColorMode();
  const [isAdvancedOptionsOpen, setIsAdvancedOptionsOpen] = useState(false);

  const { baseApy, isLoading: apyLoading } = useBaseApy(token as string);
  const finalLeverage = isAdvancedOptionsOpen ? leverage : 1.5;
  const finalApy = baseApy
    ? (+baseApy * +finalLeverage - displayInterestAndSpreadInPercent).toFixed(2)
    : "";

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-2 p-3 bg-primary-100 rounded-xl">
      <div className="flex flex-row justify-between w-full">
        <Text textStyle="lg">Deposit</Text>
        <div className="flex flex-row items-center justify-end gap-2">
          {isBalanceLoading ? (
            <>
              <Loading />
            </>
          ) : (
            <>
              <Text textStyle="slender-sm2">
                {abbreviateBigNumber(
                  balance?.value ?? BigInt(0),
                  asset.decimals
                )}
              </Text>
              <HStack textStyle="slender-sm2">
                <EstimatedValue
                  value={balance?.value ?? BigInt(0)}
                  token={asset!}
                />
              </HStack>
            </>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        <div className="flex gap-2">
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={onOpen}
            className="flex items-center gap-1 justify-center px-2 rounded-md bg-primary-200 min-w-[92px]"
          >
            {asset == null ? (
              <Loading />
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span>
                  <TokenIcon
                    className="w-6 h-6"
                    name={asset?.name}
                    height={24}
                    width={24}
                  />
                </span>
                <Text textStyle="sm">{asset?.name}</Text>
              </div>
            )}
          </div>

          <InputGroup size="md">
            <Input
              type="number"
              step="0.1"
              variant="filled"
              value={inputAmount}
              onChange={(event) => onInputChange(event.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={onMaxClick}
                isDisabled={isMaxDisabled}
                variant="insideInput"
              >
                Max
              </Button>
            </InputRightElement>
          </InputGroup>
        </div>

        <Box width="full" gap="30px">
          <Box
            marginTop={5}
            bg={mode(colorMode, "primary.100", "primary.100.dark")}
            borderRadius="5px"
            border={`2px dashed ${pickColor(
              colorMode,
              palette.colors.primary,
              "400"
            )}`}
          >
            <FormDescriptionItem
              extension="%"
              leftPart="Base APY:"
              rightPart={baseApy?.toFixed(2)}
              isLoading={apyLoading}
            />
            <FormDescriptionItem
              extension="x"
              leftPart="Best Leverage:"
              rightPart={finalLeverage}
            />
            <FormDescriptionItem
              extension="%"
              leftPart="Borrow Interest:"
              rightPart={displayInterestAndSpreadInPercent}
              // isLoading={isLoading}
            />
            <FormDescriptionItem
              extension="%"
              leftPart="Final APY:"
              rightPart={finalApy}
            />
          </Box>

          <AdvanceSection
            isAdvancedOptionsOpen={isAdvancedOptionsOpen}
            setIsAdvancedOptionsOpen={setIsAdvancedOptionsOpen}
            leverage={leverage}
            setLeverage={setLeverage}
            setSlippage={setSlippage}
            slippage={slippage}
          />
        </Box>
      </div>

      <>
        {isConnected ? (
          <Button
            mt="20px"
            onClick={() => {
              void onActionClick();
            }}
            isDisabled={isButtonDisabled}
            isLoading={isButtonLoading}
            loadingText={isButtonLoading ? "Waiting" : undefined}
          >
            {!asset
              ? "Loading..."
              : isApproved
              ? "Open position"
              : `Approve ${asset?.name}`}
          </Button>
        ) : (
          <Button mt="20px" onClick={openConnectModal}>
            Connect Wallet
          </Button>
        )}
      </>
      <TokenModal onSelectToken={onClose} isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default Form;
