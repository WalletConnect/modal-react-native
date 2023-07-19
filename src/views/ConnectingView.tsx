import { useEffect } from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';
import { useSnapshot } from 'valtio';

import ModalHeader from '../components/ModalHeader';
import CopyIcon from '../assets/CopyLarge';
import useTheme from '../hooks/useTheme';
import { ToastCtrl } from '../controllers/ToastCtrl';
import { WcConnectionCtrl } from '../controllers/WcConnectionCtrl';
import Text from '../components/Text';
import type { RouterProps } from '../types/routerTypes';
import { ExplorerUtil } from '../utils/ExplorerUtil';
import { RouterCtrl } from '../controllers/RouterCtrl';
import Touchable from '../components/Touchable';
import { UiUtil } from '../utils/UiUtil';
import RetryIcon from '../assets/Retry';
import WalletImage from '../components/WalletImage';
import WalletLoadingThumbnail from '../components/WalletLoadingThumbnail';
import Chevron from '../assets/Chevron';

function ConnectingView({ onCopyClipboard }: RouterProps) {
  const Theme = useTheme();
  const { pairingUri, pairingError } = useSnapshot(WcConnectionCtrl.state);
  const { data } = useSnapshot(RouterCtrl.state);
  const walletName = UiUtil.getWalletName(data?.wallet?.name ?? 'Wallet', true);
  const imageUrl = ExplorerUtil.getWalletImageUrl(data?.wallet?.image_id);

  const alternateLink =
    data?.wallet?.mobile.native && data.wallet.mobile.universal
      ? data.wallet.mobile.universal
      : undefined;

  const storeLink = Platform.select({
    ios: data?.wallet?.app.ios,
    android: data?.wallet?.app.android,
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

  const onRetry = () => {
    WcConnectionCtrl.setPairingError(false);
    ExplorerUtil.navigateDeepLink(
      data?.wallet?.mobile.universal,
      data?.wallet?.mobile.native,
      pairingUri
    );
  };

  const onAlternativePress = () => {
    if (alternateLink) {
      WcConnectionCtrl.setPairingError(false);
      ExplorerUtil.navigateDeepLink(alternateLink, '', pairingUri);
    }
  };

  useEffect(() => {
    WcConnectionCtrl.setPairingError(false);
  }, []);

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
        <View style={[styles.upperFooter, { borderColor: Theme.foreground3 }]}>
          <Touchable
            style={[styles.retryButton, { backgroundColor: Theme.accent }]}
            onPress={onRetry}
          >
            <Text style={styles.text}>Retry</Text>
            <RetryIcon style={styles.retryIcon} />
          </Touchable>
          {alternateLink && (
            <Text
              style={[
                styles.text,
                styles.alternateText,
                { color: Theme.foreground2 },
              ]}
            >
              Still doesn't work?{' '}
              <Text
                style={{ color: Theme.accent }}
                onPress={onAlternativePress}
              >
                Try this alternate link
              </Text>
            </Text>
          )}
        </View>
        {storeLink && (
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
        )}
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
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeIcon: {
    marginLeft: 4,
  },
});

export default ConnectingView;
