import { useCallback, useEffect } from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';
import { useSnapshot } from 'valtio';

import ModalHeader from '../components/ModalHeader';
import CopyIcon from '../assets/CopyLarge';
import useTheme from '../hooks/useTheme';
import { ToastCtrl } from '../controllers/ToastCtrl';
import { WcConnectionCtrl } from '../controllers/WcConnectionCtrl';
import Text from '../components/Text';
import type { RouterProps } from '../types/routerTypes';
import { RouterCtrl } from '../controllers/RouterCtrl';
import Touchable from '../components/Touchable';
import { UiUtil } from '../utils/UiUtil';
import RetryIcon from '../assets/Retry';
import WalletImage from '../components/WalletImage';
import WalletLoadingThumbnail from '../components/WalletLoadingThumbnail';
import Chevron from '../assets/Chevron';
import { CoreHelperUtil } from '../utils/CoreHelperUtil';
import { StorageUtil } from '../utils/StorageUtil';
import { AssetUtil } from '../utils/AssetUtil';
import { ConfigCtrl } from '../controllers/ConfigCtrl';
import { ApiCtrl } from '../controllers/ApiCtrl';

function ConnectingView({ onCopyClipboard }: RouterProps) {
  const Theme = useTheme();
  const { pairingUri, pairingError } = useSnapshot(WcConnectionCtrl.state);
  const { data } = useSnapshot(RouterCtrl.state);
  const { installed } = useSnapshot(ApiCtrl.state);
  const walletName = UiUtil.getWalletName(data?.wallet?.name ?? 'Wallet', true);
  const imageUrl = AssetUtil.getWalletImage(data?.wallet);
  const isInstalled = !!installed.find((item) => item.id === data?.wallet?.id);

  const storeLink = Platform.select({
    ios: data?.wallet?.app_store,
    android: data?.wallet?.play_store,
  });

  const storeCaption = Platform.select({
    ios: 'App Store',
    android: 'Play Store',
  });

  const onCopy = async () => {
    if (onCopyClipboard) {
      onCopyClipboard(pairingUri);
      ToastCtrl.openToast('Link copied', 'success');
    }
  };

  const onRetry = async () => {
    WcConnectionCtrl.setPairingError(false);
    onConnect();
  };

  const onConnect = useCallback(async () => {
    try {
      if (!data?.wallet?.mobile_link) return;

      const mobileLink = CoreHelperUtil.formatNativeUrl(
        data?.wallet?.mobile_link,
        pairingUri
      );
      await CoreHelperUtil.openLink(mobileLink);
      ConfigCtrl.setRecentWallet(data?.wallet);
      StorageUtil.setRecentWallet(data?.wallet);
      StorageUtil.setDeepLinkWallet(data?.wallet?.mobile_link);
    } catch (error) {
      StorageUtil.removeDeepLinkWallet();
      ToastCtrl.openToast('Unable to open the wallet', 'error');
    }
  }, [data?.wallet, pairingUri]);

  const retryButtonTemplate = () => {
    return (
      <View style={[styles.upperFooter, { borderColor: Theme.foreground3 }]}>
        <Touchable
          style={[styles.retryButton, { backgroundColor: Theme.accent }]}
          onPress={onRetry}
        >
          <Text style={styles.text}>Retry</Text>
          <RetryIcon style={styles.retryIcon} />
        </Touchable>
      </View>
    );
  };

  const storeButtonTemplate = () => {
    if (!storeLink || isInstalled) return null;

    return (
      <View style={styles.lowerFooter}>
        <View style={styles.row}>
          <WalletImage url={imageUrl} size="sm" />
          <Text
            style={[styles.getText, { color: Theme.foreground1 }]}
          >{`Get ${walletName}`}</Text>
        </View>
        <Touchable
          style={styles.row}
          onPress={() => Linking.openURL(storeLink)}
        >
          <Text style={[styles.storeText, { color: Theme.foreground2 }]}>
            {storeCaption}
          </Text>
          <Chevron
            fill={Theme.foreground2}
            width={6}
            style={styles.storeIcon}
          />
        </Touchable>
      </View>
    );
  };

  useEffect(() => {
    WcConnectionCtrl.setPairingError(false);
    onConnect();
  }, [onConnect]);

  return (
    <>
      <ModalHeader
        title={walletName}
        actionIcon={<CopyIcon width={22} height={22} fill={Theme.accent} />}
        onActionPress={onCopyClipboard ? onCopy : undefined}
      />
      <View
        style={[styles.walletContainer, { backgroundColor: Theme.background1 }]}
      >
        <WalletLoadingThumbnail showError={pairingError}>
          <WalletImage url={imageUrl} size="lg" />
        </WalletLoadingThumbnail>
        <Text
          style={[
            styles.continueText,
            { color: pairingError ? Theme.negative : Theme.foreground1 },
          ]}
        >
          {pairingError
            ? 'Connection declined'
            : `Continue in ${walletName}...`}
        </Text>
      </View>
      <View
        style={[
          styles.footer,
          {
            backgroundColor: Theme.background2,
          },
        ]}
      >
        {retryButtonTemplate()}
        {storeButtonTemplate()}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  walletContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  image: {
    height: 96,
    width: 96,
    borderRadius: 28,
  },
  continueText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  retryIcon: {
    marginLeft: 4,
  },
  text: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  alternateText: {
    marginTop: 16,
  },
  getText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  storeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upperFooter: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lowerFooter: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeIcon: {
    marginLeft: 4,
  },
});

export default ConnectingView;
