import PrimaryButton from '@/components/PrimaryButton';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook from react-navigation
import React, { useEffect, useRef, useState, } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';



export default function Onboarding() {

  const navigation = useNavigation(); 
    const [afterDelay, setAfterDelay] = useState(false);
    const [sliderValue, setSliderValue] = useState(0)
      const [amount, setAmount] = useState(''); 
        const [selectedKg, setSelectedKg] = useState(2)
        const [pricePerKg, setPricePerKg] = useState(5)

  const handleSliderChange = (value) => {
    setSliderValue(value)

    const kg = 2 + Math.round(value * 22)
    setSelectedKg(kg)

    const calculatedPrice = kg * pricePerKg
    setAmount(calculatedPrice.toFixed(2))
    // console.log(calculatedPrice.toFixed(3))
  }


   const topAnim = useRef(new Animated.Value(-200)).current; // Start at -70  
    useEffect(() => {
      Animated.timing(topAnim, {
        toValue: afterDelay ? -100 : 0,
        duration: 900,
        useNativeDriver: true, // Use native driver for better performance
      }).start();
    }, [afterDelay]);



const opacityRegular = useRef(new Animated.Value(0)).current; // Start at 0 (fully transparent)

useEffect(() => {
  Animated.timing(opacityRegular, {
    toValue: afterDelay ? 0.3 : 1, // Fade to 0.8 or 1 (fully opaque)
    duration: 100,
    useNativeDriver: true,
  }).start();
}, [afterDelay]);

const opacitySlider = useRef(new Animated.Value(0)).current; // Start at 0 (fully transparent)

useEffect(() => {
  Animated.timing(opacitySlider, {
    toValue: afterDelay ? 0.3 : 1, // Fade to 0.8 or 1 (fully opaque)
    duration: 2000,
    useNativeDriver: true,
  }).start();
}, [afterDelay]);

const Filling = useRef(new Animated.Value(0)).current; // Start at 0 (fully transparent)

useEffect(() => {
  Animated.timing(Filling, {
    toValue: afterDelay ? 0.3 : 1, // Fade to 0.8 or 1 (fully opaque)
    duration: 3000,
    useNativeDriver: true,
  }).start();
}, [afterDelay]);

const filled = useRef(new Animated.Value(0)).current; // Start at 0 (fully transparent)

useEffect(() => {
  Animated.timing(filled, {
    toValue: afterDelay ? 0.3 : 1, // Fade to 0.8 or 1 (fully opaque)
    duration: 4000,
    useNativeDriver: true,
  }).start();
}, [afterDelay]);

const H1 = useRef(new Animated.Value(0)).current; // Start at 0 (fully transparent)

useEffect(() => {
  Animated.timing(H1, {
    toValue: afterDelay ? 0.3 : 1, // Fade to 0.8 or 1 (fully opaque)
    duration: 4000,
    useNativeDriver: true,
  }).start();
}, [afterDelay]);

  return (
    <View style={styles.main}>

      <Animated.Text style={{ 
        fontSize: 20, 
        fontWeight: 'bold', 
        textAlign: 'left',  
        transform: [{ translateY: topAnim }]
      }}>
        Gas
        <Text style={{
          color : 'rgba(0,0,0,0.5)'
        }}>App</Text>
      </Animated.Text>

      <Animated.View style={{
        display : 'flex',
        gap : 24,
        padding : 16,
        alignItems : 'flex-start',
        backgroundColor : '#f4f4f4',
        borderRadius : 16,
        opacity : opacityRegular,
        // transform: [{ translateY: topAnim }]
      }}>
        <View style={{
          display : 'flex',
          flexDirection : 'row',
          alignItems : 'center',
          justifyContent : 'space-between',
          width : '100%'
        }}>
            <Svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
              <Path d="M21.56 11.24L20.2 9.66C19.94 9.36 19.73 8.8 19.73 8.4V6.7C19.73 5.64 18.86 4.77 17.8 4.77H16.1C15.71 4.77 15.14 4.56 14.84 4.3L13.26 2.94C12.57 2.35 11.44 2.35 10.74 2.94L9.17 4.31C8.87 4.56 8.3 4.77 7.91 4.77H6.18C5.12 4.77 4.25 5.64 4.25 6.7V8.41C4.25 8.8 4.04 9.36 3.79 9.66L2.44 11.25C1.86 11.94 1.86 13.06 2.44 13.75L3.79 15.34C4.04 15.64 4.25 16.2 4.25 16.59V18.3C4.25 19.36 5.12 20.23 6.18 20.23H7.91C8.3 20.23 8.87 20.44 9.17 20.7L10.75 22.06C11.44 22.65 12.57 22.65 13.27 22.06L14.85 20.7C15.15 20.44 15.71 20.23 16.11 20.23H17.81C18.87 20.23 19.74 19.36 19.74 18.3V16.6C19.74 16.21 19.95 15.64 20.21 15.34L21.57 13.76C22.15 13.07 22.15 11.93 21.56 11.24ZM16.16 10.61L11.33 15.44C11.19 15.58 11 15.66 10.8 15.66C10.6 15.66 10.41 15.58 10.27 15.44L7.85 13.02C7.56 12.73 7.56 12.25 7.85 11.96C8.14 11.67 8.62 11.67 8.91 11.96L10.8 13.85L15.1 9.55C15.39 9.26 15.87 9.26 16.16 9.55C16.45 9.84 16.45 10.32 16.16 10.61Z" fill="#52B922"/>
            </Svg>
           <Text style={{
            fontSize : 12,
            padding : 8,
            borderWidth : 1,
            borderColor : 'rgba(0,0,0,0.1)',
            borderRadius : 24,
            backgroundColor : '#fafafa',
            color : 'rgba(0,0,0,0.5)'
           }}>
            Affordable <Text style={{
              color : 'rgba(0,0,0,1)'
            }}>Refill🚀</Text>
           </Text>
        </View>

        <View style={{
          display : 'flex',
          gap : 8
        }}>
          <Text style={{
            fontSize : 18,
            fontWeight : 'bold'
          }}>Regular Offer <Text style={{
            fontSize : 14,
            fontWeight : '400',
            color : 'rgba(0,0,0,0.5)'
          }}>(2pm to 4pm)</Text></Text>

        <View style={{
          width : 240,
          height : 14,
          borderRadius : 12,
          backgroundColor : '#E2E4E9'
        }}></View>
          <View style={{
          width : 300,
          height : 14,
          borderRadius : 12,
          backgroundColor : '#E2E4E9'
        }}></View>
        </View>
      </Animated.View>

       <Animated.View style={{
        display : 'flex',
        gap : 24,
        padding : 16,
        alignItems : 'flex-start',
        backgroundColor : '#FAFAFA',
        borderRadius : 16,
        opacity : opacitySlider,
        borderWidth : 1,
        borderColor : 'rgba(0,0,0,0.1)',
        // transform: [{ translateY: topAnim }]
      }}>
        <View style={{
          display : 'flex',
          flexDirection : 'row',
          alignItems : 'center',
          justifyContent : 'space-between',
          width : '100%'
        }}>

              <Text style={{
            fontSize : 18,
            fontWeight : 'bold'
          }}>Slider</Text>

          <View style={{
            display : 'flex',
            flexDirection : 'row',
            alignItems : 'center',
            gap : 8
          }}>
            <Text style={{
            fontSize : 12,
            padding : 4,
            borderWidth : 1,
            borderColor : 'rgba(0,0,0,0.1)',
            borderRadius : 8,
            backgroundColor : '#fafafa',
            color : 'rgba(0,0,0,0.5)'
           }}>
            {selectedKg} Kg
           </Text>
           <Text style={{
            fontSize : 18,
            fontWeight : 'bold'
          }}>GHC {amount || 120}</Text>
          </View>   
        </View>



            <Slider
              style={{width: '100%', height: 0}}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor='rgba(0,0,0,0.1)'
              value={5}
              onValueChange={handleSliderChange}
              />
 
          <View style={{
          width : 240,
          height : 14,
          borderRadius : 12,
          backgroundColor : '#E2E4E9'
        }}></View>
    


      </Animated.View>

      <View style={{
        width : 1,
        height : 30,
        backgroundColor : 'rgba(0,0,0,0.2)',
        position : 'relative',
        left : 40,
        top : -24
      }}></View>

      <Animated.View style={{
        paddingHorizontal : 24,
        alignItems : 'center',
        gap : 12,
        justifyContent : 'flex-start',
        flexDirection : 'row',
        top : -40,
        opacity : Filling,
      }}>

        <View style={{
          padding : 8,
          backgroundColor : '#000000',
          borderRadius : 40
        }}>
            <Svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <Path d="M14.8933 6.22L13.56 5.55334C13.3133 5.43334 13.0067 5.52667 12.8867 5.77334C12.76 6.02667 12.86 6.32667 13.1067 6.44667L14.1667 6.97334V10.1667L11.6667 10.1733V3.33334C11.6667 2 10.7733 1.33334 9.66668 1.33334H4.33334C3.22668 1.33334 2.33334 2 2.33334 3.33334V14.1667H1.33334C1.06001 14.1667 0.833344 14.3933 0.833344 14.6667C0.833344 14.94 1.06001 15.1667 1.33334 15.1667H12.6667C12.94 15.1667 13.1667 14.94 13.1667 14.6667C13.1667 14.3933 12.94 14.1667 12.6667 14.1667H11.6667V11.1733L14.6667 11.1667C14.9467 11.1667 15.1667 10.94 15.1667 10.6667V6.66667C15.1667 6.48 15.06 6.30667 14.8933 6.22ZM4.00001 4.59334C4.00001 3.66667 4.56668 3.33334 5.26001 3.33334H8.74668C9.43334 3.33334 10 3.66667 10 4.59334V5.41334C10 6.33334 9.43334 6.66667 8.74001 6.66667H5.26001C4.56668 6.66667 4.00001 6.33334 4.00001 5.40667V4.59334ZM4.33334 8.16667H6.33334C6.60668 8.16667 6.83334 8.39334 6.83334 8.66667C6.83334 8.94 6.60668 9.16667 6.33334 9.16667H4.33334C4.06001 9.16667 3.83334 8.94 3.83334 8.66667C3.83334 8.39334 4.06001 8.16667 4.33334 8.16667Z" fill="white"/>
            </Svg>    
        </View>
        <Text>Filling Process</Text>
                  <Text style={{
            fontSize : 12,
            padding : 8,
            // borderWidth : 1,
            // borderColor : 'rgba(0,0,0,0.1)',
            borderRadius : 24,
            backgroundColor : '#fafafa',
            color : '#52B922'
           }}>
            Completed 
           </Text>
      </Animated.View>

        <View style={{
        width : 1,
        height : 30,
        // backgroundColor : 'rgba(0,0,0,0.2)',
        position : 'relative',
        left : 40,
        top : -54,
        // border : '1px dashed rgba(0,0,0,0.2)',
        borderWidth : 0.5,
        borderStyle : 'dashed',
        borderColor : '#0085FF',
        
      }}></View>

      <Animated.View style={{
        paddingHorizontal : 24,
        alignItems : 'center',
        gap : 12,
        justifyContent : 'flex-start',
        flexDirection : 'row',
        top : -70,
        left : -3,
        opacity : filled,
      }}>

        <View style={{
          padding : 10,
          // backgroundColor : '#000000',
          borderRadius : 40,
          borderWidth : 1,
          borderStyle : 'dashed',
          borderColor : 'rgba(0,0,0,0.2)'
        }}>
            <Svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <Path d="M14.3733 7.16L13.4667 6.10667C13.2933 5.90667 13.1533 5.53333 13.1533 5.26667V4.13333C13.1533 3.42667 12.5733 2.84666 11.8667 2.84666H10.7333C10.4733 2.84666 10.0933 2.70667 9.89334 2.53333L8.84 1.62667C8.38 1.23333 7.62667 1.23333 7.16 1.62667L6.11334 2.54C5.91334 2.70667 5.53334 2.84666 5.27334 2.84666H4.12C3.41334 2.84666 2.83334 3.42667 2.83334 4.13333V5.27333C2.83334 5.53333 2.69334 5.90667 2.52667 6.10667L1.62667 7.16666C1.24 7.62666 1.24 8.37333 1.62667 8.83333L2.52667 9.89333C2.69334 10.0933 2.83334 10.4667 2.83334 10.7267V11.8667C2.83334 12.5733 3.41334 13.1533 4.12 13.1533H5.27334C5.53334 13.1533 5.91334 13.2933 6.11334 13.4667L7.16667 14.3733C7.62667 14.7667 8.38 14.7667 8.84667 14.3733L9.9 13.4667C10.1 13.2933 10.4733 13.1533 10.74 13.1533H11.8733C12.58 13.1533 13.16 12.5733 13.16 11.8667V10.7333C13.16 10.4733 13.3 10.0933 13.4733 9.89333L14.38 8.84C14.7667 8.38 14.7667 7.62 14.3733 7.16ZM10.7733 6.74L7.55334 9.96C7.46 10.0533 7.33334 10.1067 7.2 10.1067C7.06667 10.1067 6.94 10.0533 6.84667 9.96L5.23334 8.34667C5.04 8.15333 5.04 7.83333 5.23334 7.64C5.42667 7.44666 5.74667 7.44666 5.94 7.64L7.2 8.9L10.0667 6.03333C10.26 5.84 10.58 5.84 10.7733 6.03333C10.9667 6.22667 10.9667 6.54666 10.7733 6.74Z" fill="black"/>
            </Svg>   
        </View>

        <View style={{
          display : 'flex',
          gap : 2
        }}>
          <Text>Refill Completed</Text>
            <Text style={{
            fontSize : 10,
            color : 'rgba(0,0,0,0.5)'
           }}>
            Rider will arrive in 5 minutes 
           </Text>
            <View style={{
          width : 240,
          height : 9,
          borderRadius : 12,
          backgroundColor : '#D0D3DA'
        }}>
              <View style={{
          width : 140,
          height : 9,
          borderRadius : 12,
          backgroundColor : '#52B922'
        }}>
        </View>
        </View>
        </View>
      </Animated.View>

      <Animated.Text style={{
        fontSize : 28,
        textAlign : 'center',
        fontWeight : '700',
        marginTop : 30,
        opacity : H1,
      }}>
        Your Hassle-Free Solution for  <Text style={{
          color : 'rgba(0,0,0,0.5)'
        }}>Convenient LPG refills</Text>
      </Animated.Text>
       
        <PrimaryButton title='Get Started' onPress={() => navigation.navigate('PhoneNumber')}/>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    position : 'relative',
    gap : 24,
    paddingHorizontal : 16,
    display : 'flex',
    width : 'auto',
    backgroundColor : 'white'
  },
  text : {
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'center',
    gap : 4
  }
});
