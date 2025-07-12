import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PrimaryButton from '@/components/PrimaryButton';
import BackButton from '@/components/BackButton';
import SecondaryButton from '@/components/SecondaryButton';
import PrimaryButtonSwipe from '@/components/PrimaryButtonSwipe';
import { useNavigation, useRoute } from '@react-navigation/native';




export default function Payment() {
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
//   const { offerName, offerPrice, price, totalCost, amount } = route.params;

  const handleNetworkSelection = (network : any) => {
    setSelectedNetwork(network);
  };



  return (
    <View style={styles.main}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: 16,
      }}>
        <View style={{ position: 'absolute', left: 0 }}>
          <BackButton />
        </View>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Mobile Money Number</Text>
      </View>
    
      <View style={{ gap: 16 }}>
        <Text style={{ fontSize: 16 }}>Select Mobile Money Network</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <SecondaryButton 
            title={'MTN'} 
            width={100} 
            onPress={() => handleNetworkSelection('MTN')} 
            selected={selectedNetwork === 'MTN'}
          />
          <SecondaryButton 
            title={'Vodafone'} 
            onPress={() => handleNetworkSelection('Vodafone')} 
            selected={selectedNetwork === 'Vodafone'}
          />
          <SecondaryButton 
            title={'Airtel/Tigo'} 
            onPress={() => handleNetworkSelection('Airtel/Tigo')} 
            selected={selectedNetwork === 'Airtel/Tigo'}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={{ fontWeight: '700', fontSize: 18 }}>Cost Summary</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'rgba(0, 0, 0, 0.60)' }}>{}</Text>
          <Text style={styles.price}>GHC {}.00</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'rgba(0, 0, 0, 0.60)' }}>Cylinder Size</Text>
          <Text>{}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'rgba(0, 0, 0, 0.60)' }}>Amount You Want To Buy</Text>
          {/* <Text>{amount ? `GHC $.00` : 'n/a'}</Text> */}
        </View>
        <View style={{ width: 'auto', height: 1, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.10)' }}></View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'rgba(0, 0, 0, 0.60)' }}>Total Cost</Text>
          <Text>GHC .00</Text>
        </View>
        <PrimaryButtonSwipe title={'Swipe To Pay'} onPress={() => navigation.navigate('Tracker')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    gap: 20,
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: "70%",
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.20)',
    paddingBottom: 8,
    alignSelf: 'stretch',
    marginBottom: 12
  },
  scrollContainer: {
    maxHeight: '55%',
    overflow: 'hidden',
  },
  MainContainer: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    gap: 12,
    marginBottom: 12,
  },
  cylinderContainer: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.10)',
    padding: 12,
    gap: 8,
    overflow: 'hidden',
  },
  imgContainer: {
    alignSelf: 'stretch',
    height: 198,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 200,
  },
  footer: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.10)',
    backgroundColor: '#F5F5F5',
    alignSelf: 'stretch',
    position: 'absolute',
    bottom: -40,
    width: '109%',
    gap: 16,
    paddingBottom: 44,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceText: {
    color: 'rgba(0, 0, 0, 0.60)',
  },
  selectedBackground: {
    backgroundColor: '#F6F6F6', // Replace with your desired color
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.50)'
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.80)',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: 'rgba(0, 0, 0, 0.20)',
    borderWidth: 1,
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
  }
});
