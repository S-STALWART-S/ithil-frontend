import {
  UseContractEventConfig,
  UseContractReadConfig,
  UseContractWriteConfig,
  UsePrepareContractWriteConfig,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  PrepareWriteContractResult,
  ReadContractResult,
  WriteContractMode,
} from "wagmi/actions";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Vault
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const vaultABI = [
  {
    stateMutability: "nonpayable",
    type: "constructor",
    inputs: [
      {
        name: "_token",
        internalType: "contract IERC20Metadata",
        type: "address",
      },
    ],
  },
  { type: "error", inputs: [], name: "FeeUnlockTimeOutOfRange" },
  { type: "error", inputs: [], name: "InsufficientFreeLiquidity" },
  { type: "error", inputs: [], name: "InsufficientLiquidity" },
  { type: "error", inputs: [], name: "LoanHigherThanAssetsInBorrow" },
  { type: "error", inputs: [], name: "Locked" },
  { type: "error", inputs: [], name: "RestrictedToOwner" },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "spender",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Approval",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "receiver",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "assets",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Borrowed",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "degradationCoefficient",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "DegradationCoefficientWasUpdated",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "sender",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "assets",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "shares",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Deposit",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "isLocked", internalType: "bool", type: "bool", indexed: false },
    ],
    name: "LockToggled",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "repayer",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "amount",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "debt",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Repaid",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "from", internalType: "address", type: "address", indexed: true },
      { name: "to", internalType: "address", type: "address", indexed: true },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Transfer",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "sender",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "receiver",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "assets",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
      {
        name: "shares",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Withdraw",
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "asset",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "assets", internalType: "uint256", type: "uint256" },
      { name: "loan", internalType: "uint256", type: "uint256" },
      { name: "receiver", internalType: "address", type: "address" },
    ],
    name: "borrow",
    outputs: [
      { name: "", internalType: "uint256", type: "uint256" },
      { name: "", internalType: "uint256", type: "uint256" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "shares", internalType: "uint256", type: "uint256" }],
    name: "convertToAssets",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "assets", internalType: "uint256", type: "uint256" }],
    name: "convertToShares",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "creationTime",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "currentLosses",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "currentProfits",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "subtractedValue", internalType: "uint256", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "_assets", internalType: "uint256", type: "uint256" },
      { name: "receiver", internalType: "address", type: "address" },
    ],
    name: "deposit",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "assets", internalType: "uint256", type: "uint256" },
      { name: "receiver", internalType: "address", type: "address" },
      { name: "deadline", internalType: "uint256", type: "uint256" },
      { name: "v", internalType: "uint8", type: "uint8" },
      { name: "r", internalType: "bytes32", type: "bytes32" },
      { name: "s", internalType: "bytes32", type: "bytes32" },
    ],
    name: "depositWithPermit",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "feeUnlockTime",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "freeLiquidity",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "getFeeStatus",
    outputs: [
      { name: "", internalType: "uint256", type: "uint256" },
      { name: "", internalType: "uint256", type: "uint256" },
      { name: "", internalType: "uint256", type: "uint256" },
      { name: "", internalType: "uint256", type: "uint256" },
    ],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "getLoansAndLiquidity",
    outputs: [
      { name: "", internalType: "uint256", type: "uint256" },
      { name: "", internalType: "uint256", type: "uint256" },
    ],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "addedValue", internalType: "uint256", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "isLocked",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "latestRepay",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "manager",
    outputs: [{ name: "", internalType: "address", type: "address" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "maxDeposit",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "", internalType: "address", type: "address" }],
    name: "maxMint",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "owner", internalType: "address", type: "address" }],
    name: "maxRedeem",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "owner", internalType: "address", type: "address" }],
    name: "maxWithdraw",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "shares", internalType: "uint256", type: "uint256" },
      { name: "receiver", internalType: "address", type: "address" },
    ],
    name: "mint",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "netLoans",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "owner", internalType: "address", type: "address" }],
    name: "nonces",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
      { name: "deadline", internalType: "uint256", type: "uint256" },
      { name: "v", internalType: "uint8", type: "uint8" },
      { name: "r", internalType: "bytes32", type: "bytes32" },
      { name: "s", internalType: "bytes32", type: "bytes32" },
    ],
    name: "permit",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "assets", internalType: "uint256", type: "uint256" }],
    name: "previewDeposit",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "shares", internalType: "uint256", type: "uint256" }],
    name: "previewMint",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "shares", internalType: "uint256", type: "uint256" }],
    name: "previewRedeem",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [{ name: "assets", internalType: "uint256", type: "uint256" }],
    name: "previewWithdraw",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "shares", internalType: "uint256", type: "uint256" },
      { name: "receiver", internalType: "address", type: "address" },
      { name: "owner", internalType: "address", type: "address" },
    ],
    name: "redeem",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "assets", internalType: "uint256", type: "uint256" },
      { name: "debt", internalType: "uint256", type: "uint256" },
      { name: "repayer", internalType: "address", type: "address" },
    ],
    name: "repay",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "_feeUnlockTime", internalType: "uint256", type: "uint256" },
    ],
    name: "setFeeUnlockTime",
    outputs: [],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "to", internalType: "address", type: "address" },
      { name: "token", internalType: "address", type: "address" },
    ],
    name: "sweep",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [],
    name: "toggleLock",
    outputs: [],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "totalAssets",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "view",
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "to", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
  },
  {
    stateMutability: "nonpayable",
    type: "function",
    inputs: [
      { name: "assets", internalType: "uint256", type: "uint256" },
      { name: "receiver", internalType: "address", type: "address" },
      { name: "owner", internalType: "address", type: "address" },
    ],
    name: "withdraw",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__.
 */
export function useVaultRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi"
  > = {} as any
) {
  return useContractRead({ abi: vaultABI, ...config } as UseContractReadConfig<
    typeof vaultABI,
    TFunctionName,
    TSelectData
  >);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"DOMAIN_SEPARATOR"`.
 */
export function useVaultDomainSeparator<
  TFunctionName extends "DOMAIN_SEPARATOR",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "DOMAIN_SEPARATOR",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"allowance"`.
 */
export function useVaultAllowance<
  TFunctionName extends "allowance",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "allowance",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"asset"`.
 */
export function useVaultAsset<
  TFunctionName extends "asset",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "asset",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useVaultBalanceOf<
  TFunctionName extends "balanceOf",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "balanceOf",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"convertToAssets"`.
 */
export function useVaultConvertToAssets<
  TFunctionName extends "convertToAssets",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "convertToAssets",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"convertToShares"`.
 */
export function useVaultConvertToShares<
  TFunctionName extends "convertToShares",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "convertToShares",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"creationTime"`.
 */
export function useVaultCreationTime<
  TFunctionName extends "creationTime",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "creationTime",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"currentLosses"`.
 */
export function useVaultCurrentLosses<
  TFunctionName extends "currentLosses",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "currentLosses",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"currentProfits"`.
 */
export function useVaultCurrentProfits<
  TFunctionName extends "currentProfits",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "currentProfits",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"decimals"`.
 */
export function useVaultDecimals<
  TFunctionName extends "decimals",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "decimals",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"feeUnlockTime"`.
 */
export function useVaultFeeUnlockTime<
  TFunctionName extends "feeUnlockTime",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "feeUnlockTime",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"freeLiquidity"`.
 */
export function useVaultFreeLiquidity<
  TFunctionName extends "freeLiquidity",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "freeLiquidity",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getFeeStatus"`.
 */
export function useVaultGetFeeStatus<
  TFunctionName extends "getFeeStatus",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "getFeeStatus",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"getLoansAndLiquidity"`.
 */
export function useVaultGetLoansAndLiquidity<
  TFunctionName extends "getLoansAndLiquidity",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "getLoansAndLiquidity",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"isLocked"`.
 */
export function useVaultIsLocked<
  TFunctionName extends "isLocked",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "isLocked",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"latestRepay"`.
 */
export function useVaultLatestRepay<
  TFunctionName extends "latestRepay",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "latestRepay",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"manager"`.
 */
export function useVaultManager<
  TFunctionName extends "manager",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "manager",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"maxDeposit"`.
 */
export function useVaultMaxDeposit<
  TFunctionName extends "maxDeposit",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "maxDeposit",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"maxMint"`.
 */
export function useVaultMaxMint<
  TFunctionName extends "maxMint",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "maxMint",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"maxRedeem"`.
 */
export function useVaultMaxRedeem<
  TFunctionName extends "maxRedeem",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "maxRedeem",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"maxWithdraw"`.
 */
export function useVaultMaxWithdraw<
  TFunctionName extends "maxWithdraw",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "maxWithdraw",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"name"`.
 */
export function useVaultName<
  TFunctionName extends "name",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "name",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"netLoans"`.
 */
export function useVaultNetLoans<
  TFunctionName extends "netLoans",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "netLoans",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"nonces"`.
 */
export function useVaultNonces<
  TFunctionName extends "nonces",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "nonces",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"previewDeposit"`.
 */
export function useVaultPreviewDeposit<
  TFunctionName extends "previewDeposit",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "previewDeposit",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"previewMint"`.
 */
export function useVaultPreviewMint<
  TFunctionName extends "previewMint",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "previewMint",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"previewRedeem"`.
 */
export function useVaultPreviewRedeem<
  TFunctionName extends "previewRedeem",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "previewRedeem",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"previewWithdraw"`.
 */
export function useVaultPreviewWithdraw<
  TFunctionName extends "previewWithdraw",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "previewWithdraw",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"symbol"`.
 */
export function useVaultSymbol<
  TFunctionName extends "symbol",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "symbol",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"totalAssets"`.
 */
export function useVaultTotalAssets<
  TFunctionName extends "totalAssets",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "totalAssets",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useVaultTotalSupply<
  TFunctionName extends "totalSupply",
  TSelectData = ReadContractResult<typeof vaultABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>,
    "abi" | "functionName"
  > = {} as any
) {
  return useContractRead({
    abi: vaultABI,
    functionName: "totalSupply",
    ...config,
  } as UseContractReadConfig<typeof vaultABI, TFunctionName, TSelectData>);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__.
 */
export function useVaultWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, string>["request"]["abi"],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof vaultABI, TFunctionName, TMode> & {
        abi?: never;
      } = {} as any
) {
  return useContractWrite<typeof vaultABI, TFunctionName, TMode>({
    abi: vaultABI,
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"approve"`.
 */
export function useVaultApprove<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          "approve"
        >["request"]["abi"],
        "approve",
        TMode
      > & { functionName?: "approve" }
    : UseContractWriteConfig<typeof vaultABI, "approve", TMode> & {
        abi?: never;
        functionName?: "approve";
      } = {} as any
) {
  return useContractWrite<typeof vaultABI, "approve", TMode>({
    abi: vaultABI,
    functionName: "approve",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"borrow"`.
 */
export function useVaultBorrow<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, "borrow">["request"]["abi"],
        "borrow",
        TMode
      > & { functionName?: "borrow" }
    : UseContractWriteConfig<typeof vaultABI, "borrow", TMode> & {
        abi?: never;
        functionName?: "borrow";
      } = {} as any
) {
  return useContractWrite<typeof vaultABI, "borrow", TMode>({
    abi: vaultABI,
    functionName: "borrow",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function useVaultDecreaseAllowance<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          "decreaseAllowance"
        >["request"]["abi"],
        "decreaseAllowance",
        TMode
      > & { functionName?: "decreaseAllowance" }
    : UseContractWriteConfig<typeof vaultABI, "decreaseAllowance", TMode> & {
        abi?: never;
        functionName?: "decreaseAllowance";
      } = {} as any
) {
  return useContractWrite<typeof vaultABI, "decreaseAllowance", TMode>({
    abi: vaultABI,
    functionName: "decreaseAllowance",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"deposit"`.
 */
export function useVaultDeposit<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          "deposit"
        >["request"]["abi"],
        "deposit",
        TMode
      > & { functionName?: "deposit" }
    : UseContractWriteConfig<typeof vaultABI, "deposit", TMode> & {
        abi?: never;
        functionName?: "deposit";
      } = {} as any
) {
  return useContractWrite<typeof vaultABI, "deposit", TMode>({
    abi: vaultABI,
    functionName: "deposit",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"depositWithPermit"`.
 */
export function useVaultDepositWithPermit<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          "depositWithPermit"
        >["request"]["abi"],
        "depositWithPermit",
        TMode
      > & { functionName?: "depositWithPermit" }
    : UseContractWriteConfig<typeof vaultABI, "depositWithPermit", TMode> & {
        abi?: never;
        functionName?: "depositWithPermit";
      } = {} as any
) {
  return useContractWrite<typeof vaultABI, "depositWithPermit", TMode>({
    abi: vaultABI,
    functionName: "depositWithPermit",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function useVaultIncreaseAllowance<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          "increaseAllowance"
        >["request"]["abi"],
        "increaseAllowance",
        TMode
      > & { functionName?: "increaseAllowance" }
    : UseContractWriteConfig<typeof vaultABI, "increaseAllowance", TMode> & {
        abi?: never;
        functionName?: "increaseAllowance";
      } = {} as any
) {
  return useContractWrite<typeof vaultABI, "increaseAllowance", TMode>({
    abi: vaultABI,
    functionName: "increaseAllowance",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"mint"`.
 */
export function useVaultMint<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, "mint">["request"]["abi"],
        "mint",
        TMode
      > & { functionName?: "mint" }
    : UseContractWriteConfig<typeof vaultABI, "mint", TMode> & {
        abi?: never;
        functionName?: "mint";
      } = {} as any
) {
  return useContractWrite<typeof vaultABI, "mint", TMode>({
    abi: vaultABI,
    functionName: "mint",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"permit"`.
 */
export function useVaultPermit<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, "permit">["request"]["abi"],
        "permit",
        TMode
      > & { functionName?: "permit" }
    : UseContractWriteConfig<typeof vaultABI, "permit", TMode> & {
        abi?: never;
        functionName?: "permit";
      } = {} as any
) {
  return useContractWrite<typeof vaultABI, "permit", TMode>({
    abi: vaultABI,
    functionName: "permit",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"redeem"`.
 */
export function useVaultRedeem<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, "redeem">["request"]["abi"],
        "redeem",
        TMode
      > & { functionName?: "redeem" }
    : UseContractWriteConfig<typeof vaultABI, "redeem", TMode> & {
        abi?: never;
        functionName?: "redeem";
      } = {} as any
) {
  return useContractWrite<typeof vaultABI, "redeem", TMode>({
    abi: vaultABI,
    functionName: "redeem",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"repay"`.
 */
export function useVaultRepay<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, "repay">["request"]["abi"],
        "repay",
        TMode
      > & { functionName?: "repay" }
    : UseContractWriteConfig<typeof vaultABI, "repay", TMode> & {
        abi?: never;
        functionName?: "repay";
      } = {} as any
) {
  return useContractWrite<typeof vaultABI, "repay", TMode>({
    abi: vaultABI,
    functionName: "repay",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"setFeeUnlockTime"`.
 */
export function useVaultSetFeeUnlockTime<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          "setFeeUnlockTime"
        >["request"]["abi"],
        "setFeeUnlockTime",
        TMode
      > & { functionName?: "setFeeUnlockTime" }
    : UseContractWriteConfig<typeof vaultABI, "setFeeUnlockTime", TMode> & {
        abi?: never;
        functionName?: "setFeeUnlockTime";
      } = {} as any
) {
  return useContractWrite<typeof vaultABI, "setFeeUnlockTime", TMode>({
    abi: vaultABI,
    functionName: "setFeeUnlockTime",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"sweep"`.
 */
export function useVaultSweep<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof vaultABI, "sweep">["request"]["abi"],
        "sweep",
        TMode
      > & { functionName?: "sweep" }
    : UseContractWriteConfig<typeof vaultABI, "sweep", TMode> & {
        abi?: never;
        functionName?: "sweep";
      } = {} as any
) {
  return useContractWrite<typeof vaultABI, "sweep", TMode>({
    abi: vaultABI,
    functionName: "sweep",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"toggleLock"`.
 */
export function useVaultToggleLock<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          "toggleLock"
        >["request"]["abi"],
        "toggleLock",
        TMode
      > & { functionName?: "toggleLock" }
    : UseContractWriteConfig<typeof vaultABI, "toggleLock", TMode> & {
        abi?: never;
        functionName?: "toggleLock";
      } = {} as any
) {
  return useContractWrite<typeof vaultABI, "toggleLock", TMode>({
    abi: vaultABI,
    functionName: "toggleLock",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"transfer"`.
 */
export function useVaultTransfer<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          "transfer"
        >["request"]["abi"],
        "transfer",
        TMode
      > & { functionName?: "transfer" }
    : UseContractWriteConfig<typeof vaultABI, "transfer", TMode> & {
        abi?: never;
        functionName?: "transfer";
      } = {} as any
) {
  return useContractWrite<typeof vaultABI, "transfer", TMode>({
    abi: vaultABI,
    functionName: "transfer",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useVaultTransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          "transferFrom"
        >["request"]["abi"],
        "transferFrom",
        TMode
      > & { functionName?: "transferFrom" }
    : UseContractWriteConfig<typeof vaultABI, "transferFrom", TMode> & {
        abi?: never;
        functionName?: "transferFrom";
      } = {} as any
) {
  return useContractWrite<typeof vaultABI, "transferFrom", TMode>({
    abi: vaultABI,
    functionName: "transferFrom",
    ...config,
  } as any);
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"withdraw"`.
 */
export function useVaultWithdraw<TMode extends WriteContractMode = undefined>(
  config: TMode extends "prepared"
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof vaultABI,
          "withdraw"
        >["request"]["abi"],
        "withdraw",
        TMode
      > & { functionName?: "withdraw" }
    : UseContractWriteConfig<typeof vaultABI, "withdraw", TMode> & {
        abi?: never;
        functionName?: "withdraw";
      } = {} as any
) {
  return useContractWrite<typeof vaultABI, "withdraw", TMode>({
    abi: vaultABI,
    functionName: "withdraw",
    ...config,
  } as any);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__.
 */
export function usePrepareVaultWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, TFunctionName>,
    "abi"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, TFunctionName>);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareVaultApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, "approve">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: "approve",
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, "approve">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"borrow"`.
 */
export function usePrepareVaultBorrow(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, "borrow">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: "borrow",
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, "borrow">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"decreaseAllowance"`.
 */
export function usePrepareVaultDecreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, "decreaseAllowance">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: "decreaseAllowance",
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, "decreaseAllowance">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"deposit"`.
 */
export function usePrepareVaultDeposit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, "deposit">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: "deposit",
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, "deposit">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"depositWithPermit"`.
 */
export function usePrepareVaultDepositWithPermit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, "depositWithPermit">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: "depositWithPermit",
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, "depositWithPermit">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"increaseAllowance"`.
 */
export function usePrepareVaultIncreaseAllowance(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, "increaseAllowance">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: "increaseAllowance",
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, "increaseAllowance">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"mint"`.
 */
export function usePrepareVaultMint(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, "mint">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: "mint",
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, "mint">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"permit"`.
 */
export function usePrepareVaultPermit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, "permit">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: "permit",
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, "permit">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"redeem"`.
 */
export function usePrepareVaultRedeem(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, "redeem">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: "redeem",
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, "redeem">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"repay"`.
 */
export function usePrepareVaultRepay(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, "repay">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: "repay",
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, "repay">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"setFeeUnlockTime"`.
 */
export function usePrepareVaultSetFeeUnlockTime(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, "setFeeUnlockTime">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: "setFeeUnlockTime",
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, "setFeeUnlockTime">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"sweep"`.
 */
export function usePrepareVaultSweep(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, "sweep">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: "sweep",
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, "sweep">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"toggleLock"`.
 */
export function usePrepareVaultToggleLock(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, "toggleLock">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: "toggleLock",
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, "toggleLock">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareVaultTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, "transfer">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: "transfer",
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, "transfer">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareVaultTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, "transferFrom">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: "transferFrom",
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, "transferFrom">);
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link vaultABI}__ and `functionName` set to `"withdraw"`.
 */
export function usePrepareVaultWithdraw(
  config: Omit<
    UsePrepareContractWriteConfig<typeof vaultABI, "withdraw">,
    "abi" | "functionName"
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: vaultABI,
    functionName: "withdraw",
    ...config,
  } as UsePrepareContractWriteConfig<typeof vaultABI, "withdraw">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__.
 */
export function useVaultEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, TEventName>,
    "abi"
  > = {} as any
) {
  return useContractEvent({
    abi: vaultABI,
    ...config,
  } as UseContractEventConfig<typeof vaultABI, TEventName>);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"Approval"`.
 */
export function useVaultApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, "Approval">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: vaultABI,
    eventName: "Approval",
    ...config,
  } as UseContractEventConfig<typeof vaultABI, "Approval">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"Borrowed"`.
 */
export function useVaultBorrowedEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, "Borrowed">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: vaultABI,
    eventName: "Borrowed",
    ...config,
  } as UseContractEventConfig<typeof vaultABI, "Borrowed">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"DegradationCoefficientWasUpdated"`.
 */
export function useVaultDegradationCoefficientWasUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, "DegradationCoefficientWasUpdated">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: vaultABI,
    eventName: "DegradationCoefficientWasUpdated",
    ...config,
  } as UseContractEventConfig<typeof vaultABI, "DegradationCoefficientWasUpdated">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"Deposit"`.
 */
export function useVaultDepositEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, "Deposit">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: vaultABI,
    eventName: "Deposit",
    ...config,
  } as UseContractEventConfig<typeof vaultABI, "Deposit">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"LockToggled"`.
 */
export function useVaultLockToggledEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, "LockToggled">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: vaultABI,
    eventName: "LockToggled",
    ...config,
  } as UseContractEventConfig<typeof vaultABI, "LockToggled">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"Repaid"`.
 */
export function useVaultRepaidEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, "Repaid">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: vaultABI,
    eventName: "Repaid",
    ...config,
  } as UseContractEventConfig<typeof vaultABI, "Repaid">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"Transfer"`.
 */
export function useVaultTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, "Transfer">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: vaultABI,
    eventName: "Transfer",
    ...config,
  } as UseContractEventConfig<typeof vaultABI, "Transfer">);
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link vaultABI}__ and `eventName` set to `"Withdraw"`.
 */
export function useVaultWithdrawEvent(
  config: Omit<
    UseContractEventConfig<typeof vaultABI, "Withdraw">,
    "abi" | "eventName"
  > = {} as any
) {
  return useContractEvent({
    abi: vaultABI,
    eventName: "Withdraw",
    ...config,
  } as UseContractEventConfig<typeof vaultABI, "Withdraw">);
}
