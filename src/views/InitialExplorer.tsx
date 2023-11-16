import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useSnapshot } from 'valtio';

import WalletItem, { WALLET_FULL_HEIGHT } from '../components/WalletItem';
import ViewAllBox from '../components/ViewAllBox';
import QRIcon from '../assets/QRCode';
import ModalHeader from '../components/ModalHeader';
import type { WcWallet } from '../types/controllerTypes';
import { RouterCtrl } from '../controllers/RouterCtrl';
import { OptionsCtrl } from '../controllers/OptionsCtrl';
import { WcConnectionCtrl } from '../controllers/WcConnectionCtrl';
import { ConfigCtrl } from '../controllers/ConfigCtrl';
import type { RouterProps } from '../types/routerTypes';
import { ApiCtrl } from '../controllers/ApiCtrl';
import useTheme from '../hooks/useTheme';

function InitialExplorer({ isPortrait }: RouterProps) {
  const Theme = useTheme();
  const { isDataLoaded } = useSnapshot(OptionsCtrl.state);
  const { pairingUri } = useSnapshot(WcConnectionCtrl.state);
  const { explorerExcludedWalletIds } = useSnapshot(ConfigCtrl.state);
  const { recentWallet } = useSnapshot(ConfigCtrl.state);
  const { recommended, installed } = useSnapshot(ApiCtrl.state);

  const loading = !isDataLoaded || !pairingUri;
  const viewHeight = isPortrait ? WALLET_FULL_HEIGHT * 2 : WALLET_FULL_HEIGHT;

  const showViewAllButton =
    recommended.length > 8 || explorerExcludedWalletIds !== 'ALL';

  const recentTemplate = () => {
    if (!recentWallet) return null;

    return (
      <WalletItem
        walletInfo={recentWallet}
        isRecent
        currentWCURI={pairingUri}
        style={isPortrait ? styles.portraitItem : styles.landscapeItem}
      />
    );
  };

  const installedTemplate = () => {
    if (!installed) return null;

    const list = filterOutRecentWallet(installed as WcWallet[]);
    return list.map((item: WcWallet) => (
      <WalletItem
        walletInfo={item}
        key={item.id}
        isRecent={item.id === recentWallet?.id}
        currentWCURI={pairingUri}
        style={isPortrait ? styles.portraitItem : styles.landscapeItem}
      />
    ));
  };

  const recommendedTemplate = () => {
    const list = filterOutRecentWallet(recommended as WcWallet[]);
    return list
      .slice(0, showViewAllButton ? 6 : 7)
      .map((item: WcWallet) => (
        <WalletItem
          walletInfo={item}
          key={item.id}
          isRecent={item.id === recentWallet?.id}
          currentWCURI={pairingUri}
          style={isPortrait ? styles.portraitItem : styles.landscapeItem}
        />
      ));
  };

  const viewAllTemplate = () => {
    if (!showViewAllButton) return null;

    return (
      <ViewAllBox
        onPress={() => RouterCtrl.push('WalletExplorer')}
        wallets={recommended.slice(-4)}
        style={isPortrait ? styles.portraitItem : styles.landscapeItem}
      />
    );
  };

  const filterOutRecentWallet = (wallets: WcWallet[]): WcWallet[] => {
    if (!recentWallet) return wallets;

    const filtered = wallets.filter((wallet) => wallet.id !== recentWallet.id);

    return filtered;
  };

  return (
    <>
      <ModalHeader
        title="Connect your wallet"
        onActionPress={() => RouterCtrl.push('Qrcode')}
        actionIcon={<QRIcon width={22} height={22} fill={Theme.accent} />}
      />
      {loading ? (
        <ActivityIndicator
          style={{ height: viewHeight }}
          color={Theme.accent}
        />
      ) : (
        <View
          style={[
            styles.explorerContainer,
            { height: viewHeight, backgroundColor: Theme.background1 },
          ]}
        >
          {recentTemplate()}
          {installedTemplate()}
          {recommendedTemplate()}
          {viewAllTemplate()}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  explorerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  portraitItem: {
    width: '25%',
  },
  landscapeItem: {
    width: '12.5%',
  },
});

export default InitialExplorer;
