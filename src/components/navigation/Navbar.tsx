/** @jsxImportSource @emotion/react */
import 'twin.macro';
import React, { useEffect, useState } from 'react';
import { useEthers } from '@usedapp/core';
import { Web3Provider } from '@ethersproject/providers';

import WalletConnectionModal from './WalletConnectionModal';
import { WalletIndicator } from './WalletIndicator';
import NetworkMenu from './NetworkMenu';
import AccountModal from './AccountModal';
import NetworkAlertBar from './NetworkAlertBar';

import { useTheme } from '@/state/application/hooks';
import Button from '@/components/based/Button';
import NavigationMenu from '@/components/navigation/NavigationMenu';
import ThemeSwitch from '@/components/navigation/ThemeSwitch';
import KebabMenu from '@/components/navigation/KebabMenu';
import { ReactComponent as LogoFullLight } from '@/assets/images/logoFullLight.svg';
import { ReactComponent as LogoFullDark } from '@/assets/images/logoFullDark.svg';

const Navbar = () => {
  const { account, chainId } = useEthers();
  const theme = useTheme();
  const [walletModalOpened, setWalletModalOpened] = useState(false);
  const [accountModalOpened, setAccountModalOpened] = useState(false);

  return (
    <div tw="flex flex-col">
      {!chainId && (
        <NetworkAlertBar content="Wrong network - Support only Goerli testnet." />
      )}
      <div tw="w-full px-5 desktop:w-[calc(100% - 9rem)] my-6 tablet:mx-auto flex flex-row items-center justify-between">
        <span tw="flex flex-row items-center">
          {theme === 'dark' ? <LogoFullDark /> : <LogoFullLight />}
          <span tw="ml-24 flex flex-row items-center" id="navigation">
            <NavigationMenu />
            <ThemeSwitch />
          </span>
        </span>
        <span tw="flex flex-row items-center gap-2" id="connector">
          <NetworkMenu />
          {account ? (
            <WalletIndicator onClick={() => setAccountModalOpened(true)} />
          ) : (
            <Button
              text="Connect wallet"
              action
              onClick={() => setWalletModalOpened(true)}
            />
          )}
          <KebabMenu />
        </span>
        <WalletConnectionModal
          id="connect-modal"
          open={walletModalOpened}
          onClose={() => setWalletModalOpened(false)}
        />
        <AccountModal
          open={accountModalOpened}
          onClose={() => setAccountModalOpened(false)}
        />
      </div>
    </div>
  );
};

export default Navbar;
