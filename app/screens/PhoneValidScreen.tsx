import { RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../ThemeContext';
import { Colors } from '../constants/colors';

// STEP 1: Update the param list to expect a 'phone' parameter
type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Email: { email: string };
  Phone: { phone: string }; // Changed from 'undefined'
};

// Update the navigation prop type
type PhoneScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Phone'>;

// Update the route prop type
type PhoneScreenRouteProp = RouteProp<AuthStackParamList, 'Phone'>;


type Props = {
  navigation: PhoneScreenNavigationProp;
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8; // Made slightly larger for better fit

const PhoneValidScreen: React.FC<Props> = ({ navigation }) => {
  // STEP 2: Use the correct RouteProp type to access params
  const route = useRoute<PhoneScreenRouteProp>();
  const { darkModeEnabled } = useTheme();
  const themeColors = darkModeEnabled ? Colors.dark : Colors.light;

  // STEP 3: Get the phone number from navigation params
  // The 'phone' state is now correctly initialized and won't change.
  const [phone] = useState(route.params.phone); 
  const [code, setCode] = useState('');

  const phoneValid = async () => {
    if (code.length < 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit verification code.');
      return;
    }
    try {
      // Now 'phone' will have the correct value
      await axios.post('http://10.0.2.2:8000/phone-valid', { phone, code }); // Assumed an /api/ prefix, adjust if needed
      Alert.alert('Success', 'Phone verified successfully!');
      navigation.navigate("Login");
    } catch (error: any) {
      console.error(JSON.stringify(error.response, null, 2)); // Log the full error response for easier debugging

      // STEP 4: Implement robust error message handling
      let message = 'An unknown error occurred. Please try again.';
      const errorDetail = error.response?.data?.detail;

      if (typeof errorDetail === 'string') {
        message = errorDetail;
      } else if (Array.isArray(errorDetail)) {
        message = errorDetail.join('\n');
      } else if (error.message) {
        message = error.message;
      }

      Alert.alert('Verification Failed', message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.card, { backgroundColor: themeColors.cardBackground }]}>
        <Text style={[styles.header, { color: themeColors.text }]}>
          Phone Validation
        </Text>
        <Text style={[styles.text, { color: themeColors.text }]}>
          Enter the 6-digit code sent to your phone number: {phone}
        </Text>

        <TextInput
          style={[styles.input, { borderColor: themeColors.text, color: themeColors.text }]}
          placeholder="Verification Code"
          placeholderTextColor={themeColors.text}
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={setCode}
          autoFocus={true} // Good UX to focus the input on screen load
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: '#ff6b6b' }]}
          onPress={phoneValid}
        >
          <Text style={styles.sendButtonText}>Verify Phone</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backText, { color: themeColors.text }]}>
            ← Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles remain largely the same, but with minor adjustments for clarity
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: CARD_WIDTH,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 5, // Adds spacing between digits
  },
  sendButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 16,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backText: {
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  }
});

export default PhoneValidScreen;