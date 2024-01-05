import { View } from 'react-native';
import { useSnapshot } from 'valtio';
import WalletItem, {
  WALLET_FULL_HEIGHT,
  WALLET_MARGIN,
} from '../../components/WalletItem';
import ViewAllBox from '../../components/ViewAllBox';
import QRIcon from '../../assets/QRCode';
import ModalHeader from '../../partials/wcm-modal-header';
import type { WcWallet } from '../../types/controllerTypes';
import { RouterCtrl } from '../../controllers/RouterCtrl';
import { OptionsCtrl } from '../../controllers/OptionsCtrl';
import { WcConnectionCtrl } from '../../controllers/WcConnectionCtrl';
import { ConfigCtrl } from '../../controllers/ConfigCtrl';
import type { RouterProps } from '../../types/routerTypes';
import { ApiCtrl } from '../../controllers/ApiCtrl';
import useTheme from '../../hooks/useTheme';
import { AssetUtil } from '../../utils/AssetUtil';
import { WalletItemLoader } from '../../components/WalletItemLoader';
import styles from './styles';

function ConnectView({ isPortrait }: RouterProps) {
  const Theme = useTheme();
  const { isDataLoaded } = useSnapshot(OptionsCtrl.state);
  const { pairingUri } = useSnapshot(WcConnectionCtrl.state);
  const { explorerExcludedWalletIds } = useSnapshot(ConfigCtrl.state);
  const { recentWallet } = useSnapshot(ConfigCtrl.state);
  const { recommended, installed } = useSnapshot(ApiCtrl.state);

  const loading = !isDataLoaded || !pairingUri;
  const viewHeight = isPortrait ? WALLET_FULL_HEIGHT * 2 : WALLET_FULL_HEIGHT;

  const showViewAllButton =
    installed.length + recommended.length >= 8 ||
    explorerExcludedWalletIds !== 'ALL';

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

  const loadingTemplate = (items: number) => {
    return (
      <View style={[styles.loaderContainer, { height: viewHeight }]}>
        {Array.from({ length: items }).map((_, index) => (
          <WalletItemLoader
            key={index}
            style={[
              isPortrait ? styles.portraitItem : styles.landscapeItem,
              { marginBottom: WALLET_MARGIN * 2 },
            ]}
          />
        ))}
      </View>
    );
  };

  const walletTemplate = () => {
    const list = recentWallet
      ? [recentWallet, ...filterOutRecentWallet([...installed, ...recommended])]
      : filterOutRecentWallet([...installed, ...recommended]);
    return list
      .slice(0, showViewAllButton ? 7 : 8)
      .map((item: WcWallet) => (
        <WalletItem
          name={item.name}
          id={item.id}
          imageUrl={AssetUtil.getWalletImage(item)}
          onPress={() => RouterCtrl.push('Connecting', { wallet: item })}
          key={item.id}
          isRecent={item.id === recentWallet?.id}
          style={isPortrait ? styles.portraitItem : styles.landscapeItem}
        />
      ));
  };

  return (
    <>
      <ModalHeader
        title="Connect your wallet"
        onActionPress={() => RouterCtrl.push('Qrcode')}
        actionIcon={<QRIcon width={22} height={22} fill={Theme.accent} />}
      />
      {loading ? (
        loadingTemplate(8)
      ) : (
        <View
          style={[
            styles.explorerContainer,
            { height: viewHeight, backgroundColor: Theme.background1 },
          ]}
        >
          {walletTemplate()}
          {viewAllTemplate()}
        </View>
      )}
    </>
  );
}

export default ConnectView;
