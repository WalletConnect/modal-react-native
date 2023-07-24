// import '../../expo-crypto-shim.js'; --> Only for Expo 48
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  WalletConnectModal,
  useWalletConnectModal,
} from '@walletconnect/modal-react-native';
import { setStringAsync } from 'expo-clipboard';
import { sessionParams, providerMetadata } from '../constants/Config';
import { BlockchainActions } from '../components/BlockchainActions';

export default function App() {
  const { isConnected, open, provider } = useWalletConnectModal();

  const handleButtonPress = async () => {
    if (isConnected) {
      return provider?.disconnect();
    }
    return open();
  };

  const onCopyClipboard = async (value: string) => {
    setStringAsync(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isConnected ? (
        <BlockchainActions onButtonPress={handleButtonPress} />
      ) : (
        <View style={styles.connectContainer}>
          <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
            <Text style={styles.text}>
              {isConnected ? 'Disconnect' : 'Connect Wallet'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <WalletConnectModal
        projectId={process.env.EXPO_PUBLIC_PROJECT_ID!}
        onCopyClipboard={onCopyClipboard}
        providerMetadata={providerMetadata}
        sessionParams={sessionParams}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  connectContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3396FF',
    borderRadius: 20,
    width: 200,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 4,
  },
  text: {
    color: 'white',
    fontWeight: '700',
  },
});
