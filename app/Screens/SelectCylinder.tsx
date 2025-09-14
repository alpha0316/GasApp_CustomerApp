import React, { useState } from 'react';
import { Image, StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import PrimaryButton from '@/components/PrimaryButton';
import BackButton from '@/components/BackButton';
import SecondaryButton from '@/components/SecondaryButton';
import { useNavigation, useRoute } from '@react-navigation/native';

type Cylinder = {
  id: string;
  name: string;
  price: string;
  image: any;
};

type RouteParams = {
  offerName: string;
  offerPrice: string;
  offerId: string;
  locationName: string;
  locationCoordinates: any;
  locationType: string;
  selectedLocationDetails: any;
  timestamp: string;
  cylinderName?: string;
  cylinderPrice?: string;
  cylinderId?: string;
  cylinderSize?: string;
  orderSummary?: any;
};

export default function SelectCylinder() {
  const [price, setPrice] = useState('n/a');
  const [totalCost, setTotalCost] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null); // Changed to string | null
  const navigation = useNavigation();
  const route = useRoute();

  // Extract route parameters with proper typing and default values
  const params = route.params as RouteParams;
  const {
    offerName = '',
    offerPrice = '',
    offerId = '',
    locationName = '',
    locationCoordinates = null,
    locationType = '',
    selectedLocationDetails = null,
    timestamp = '',
  } = params || {};

  const cylinders = [
    {
      id: '1',
      name: 'Small Size',
      price: '3.00',
      image: require('./../../assets/images/smallSize.png'),
    },
    {
      id: '2',
      name: 'Small Size',
      price: '3.00',
      image: require('./../../assets/images/smallSize.png'),
    },
    {
      id: '3',
      name: 'Medium Size',
      price: '3.00',
      image: require('./../../assets/images/mediumSize.png'),
    },
    {
      id: '4',
      name: 'Medium Size',
      price: '3.00',
      image: require('./../../assets/images/mediumSize.png'),
    },
  ];

  const handleContinue = () => {
    const selectedCylinder = cylinders.find(cyl => cyl.id === selectedId);
    
    // Prepare simplified data to pass to Amount page
    const navigationData = {
      // Previous data from earlier screens
      offerName,
      offerPrice,
      offerId,
      locationName,
      locationCoordinates,
      locationType,
      selectedLocationDetails,
      timestamp,
      
      // New cylinder data (simplified)
      cylinderName: selectedCylinder?.name || '',
      price: selectedCylinder?.price || '',
      
      // Cost calculations
      totalCost: totalCost,
    };

    console.log('Navigating to Amount with data:', navigationData);
    
    // Use type assertion to avoid TypeScript errors
    (navigation as any).navigate('Amount', navigationData);
  };

  const handleSelectCylinder = (item: Cylinder) => {
    // if tapped again, toggle off
    if (selectedId === item.id) {
      setSelectedId(null);
      setPrice('n/a');
      setTotalCost(0);
      console.log('Deselected:', item.id);
      return;
    }

    setSelectedId(item.id);
    setPrice(item.price);

    // More robust price parsing
    const priceMatch = item.price.match(/[\d.]+/);
    if (priceMatch) {
      const cylinderCost = parseFloat(priceMatch[0]);
      const offerPriceNum = parseFloat(offerPrice) || 0;
      setTotalCost(cylinderCost + offerPriceNum);
    }

    console.log('Selected:', item.price);
  };

  // Check if any cylinder is selected for button state
  const isButtonDisabled = selectedId === null;

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <BackButton />
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Select LPG Cylinder Size</Text>
      </View>

      <ScrollView style={styles.scrollContainer} bounces={false}>
        <View style={styles.gridContainer}>
          {cylinders.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.gridItem,
                selectedId === item.id && styles.selectedBackground,
              ]}
              onPress={() => handleSelectCylinder(item)}
            >
              <View style={styles.imgContainer}>
                <Image source={item.image} style={styles.image} />
              </View>
              <View style={styles.textContainer}>
                <Text>{item.name}</Text>
                <Text style={styles.priceText}>GHC {item.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={{ fontWeight: '700', fontSize: 18 }}>Cost Summary</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'rgba(0, 0, 0, 0.60)' }}>{offerName}</Text>
          <Text>GHC {offerPrice === 'n/a' ? 'n/a' : offerPrice}.00</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'rgba(0, 0, 0, 0.60)' }}>Cylinder Size</Text>
          <Text>GHC {price}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'rgba(0, 0, 0, 0.60)' }}>Amount You Want To Buy</Text>
          <Text>n/a</Text>
        </View>
        <View style={{ width: 'auto', height: 1, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.10)' }}></View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: 'rgba(0, 0, 0, 0.60)' }}>Total Cost</Text>
          <Text>GHC {totalCost.toFixed(2)}</Text>
        </View>
        <PrimaryButton
          title={'Continue'}
          onPress={handleContinue}
          disabled={isButtonDisabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    gap: 24,
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 46,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.20)',
    paddingBottom: 8,
    alignSelf: 'stretch',
  },
  scrollContainer: {
    maxHeight: '60%',
    overflow: 'hidden',
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  priceText: {
    color: 'rgba(0, 0, 0, 0.60)',
  },
  selectedBackground: {
    backgroundColor: '#F4F4F4',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.50)'
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderColor: 'rgba(0, 0, 0, 0.10)',
    borderWidth: 1
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
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
});