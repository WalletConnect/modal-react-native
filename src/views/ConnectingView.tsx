import { Linking, Platform, StyleSheet, View } from 'react-native';
import { useSnapshot } from 'valtio';

import NavHeader from '../components/NavHeader';
import CopyIcon from '../assets/CopyLarge';
import useTheme from '../hooks/useTheme';
import { ToastCtrl } from '../controllers/ToastCtrl';
import { WcConnectionCtrl } from '../controllers/WcConnectionCtrl';
import Text from '../components/Text';
import type { RouterProps } from '../types/routerTypes';
import { ConfigCtrl } from '../controllers/ConfigCtrl';
import { ExplorerUtil } from '../utils/ExplorerUtil';
import { RouterCtrl } from '../controllers/RouterCtrl';
import Touchable from '../components/Touchable';
import { UiUtil } from '../utils/UiUtil';
import RetryIcon from '../assets/Retry';
import WalletImage from '../components/WalletImage';

function ConnectingView({ onCopyClipboard }: RouterProps) {
  const Theme = useTheme();
  const { pairingUri } = useSnapshot(WcConnectionCtrl.state);
  const { recentWallet } = useSnapshot(ConfigCtrl.state);
  const walletName = UiUtil.getWalletName(recentWallet?.name ?? 'Wallet', true);
  const imageUrl = ExplorerUtil.getWalletImageUrl(recentWallet?.image_id);

  const alternateLink =
    recentWallet?.mobile.native && recentWallet.mobile.universal
      ? recentWallet.mobile.universal
      : undefined;
  const storeLink = Platform.select({
    ios: recentWallet?.app.ios,
    android: recentWallet?.app.android,
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
    ExplorerUtil.navigateDeepLink(
      recentWallet?.mobile.universal,
      recentWallet?.mobile.native,
      pairingUri
    );
  };

  const onAlternativePress = () => {
    if (alternateLink) {
      ExplorerUtil.navigateDeepLink(alternateLink, '', pairingUri);
    }
  };

  return (
    <>
      <NavHeader
        title={walletName}
        onBackPress={RouterCtrl.goBack}
        actionIcon={<CopyIcon width={22} height={22} fill={Theme.accent} />}
        onActionPress={onCopyClipboard ? onCopy : undefined}
      />

      <View
        style={[styles.walletContainer, { backgroundColor: Theme.background1 }]}
      >
        <WalletImage url={imageUrl} size={96} />
        <Text
          style={[styles.continueText, { color: Theme.foreground1 }]}
        >{`Continue in ${walletName}...`}</Text>
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
            <Text style={[styles.text, { color: Theme.foreground2 }]}>
              Still doesn't work?{' '}
              <Text
                style={{ color: Theme.accent }}
                onPress={onAlternativePress}
                onPressIn={undefined}
              >
                Try this alternate link
              </Text>
            </Text>
          )}
        </View>
        {storeLink && (
          <View style={styles.lowerFooter}>
            <View style={styles.row}>
              <WalletImage url={imageUrl} size={30} />
              <Text
                style={[styles.getText, { color: Theme.foreground1 }]}
              >{`Get ${walletName}`}</Text>
            </View>
            <Text
              style={[styles.storeText, { color: Theme.foreground2 }]}
              onPress={() => Linking.openURL(storeLink)}
            >
              {storeCaption}
            </Text>
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
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  retryIcon: {
    marginLeft: 4,
  },
  text: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
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
    paddingBottom: 12,
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
    paddingVertical: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default ConnectingView;
