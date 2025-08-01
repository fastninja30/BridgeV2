import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useMatches } from '../MatchesContext';
import { useTheme } from '../ThemeContext';
import { Colors } from '../constants/colors';



interface Profile {
  id: string;
  name: string;
  image: string | null;
}

// A local placeholder image is required in your project's asset folder
const placeholderImage = require('../../assets/images/adaptive-icon.png');


const HomeScreen: React.FC = () => {
  // --- State Management ---
  const [profiles] = useState<Profile[]>([
    { id: '1', name: 'Alice', image: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?q=80&w=2070&auto=format&fit=crop' },
    { id: '2', name: 'Bob',   image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop' },
    { id: '3', name: 'Carol', image: null }, // This profile will use the placeholder
    { id: '4', name: 'David', image: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop' },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [erroredMap, setErroredMap] = useState<Record<string, boolean>>({});

  // --- Hooks and Theming ---
  const { darkModeEnabled } = useTheme();
  const { addMatch } = useMatches();
  const theme = darkModeEnabled ? Colors.dark : Colors.light;

  // --- Event Handlers ---
  const handleImageError = (id: string) => () => {
    setErroredMap(m => ({ ...m, [id]: true }));
  };

  const advanceToNextProfile = () => {
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  const handleNope = () => {
    console.log('Noped:', profiles[currentIndex].name);
    advanceToNextProfile();
  };

  const handleLike = () => {
    console.log('Liked:', profiles[currentIndex].name);
    addMatch(profiles[currentIndex]);
    advanceToNextProfile();
  };

  // --- Render Functions ---
  const renderProfileCard = (card: Profile) => {
    // If the remote image failed or is null, fall back to the placeholder
    const source = !erroredMap[card.id] && card.image
      ? { uri: card.image }
      : placeholderImage;

    return (
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorder }]}>
        <Image
          style={styles.image}
          defaultSource={placeholderImage} // iOS only but doesn't hurt on Android
          source={source}
          onError={handleImageError(card.id)}
        />
        <Text style={[styles.name, { color: theme.text }]}>
          {card.name}
        </Text>
      </View>
    );
  };

  const renderEndOfProfiles = () => (
    <View style={styles.endOfDeckContainer}>
        <Text style={[styles.endOfDeckText, {color: theme.text}]}>No more profiles</Text>
        <Text style={[{color: theme.text}]}>Come back later to discover new people!</Text>
    </View>
  );

  const currentProfile = profiles[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>
        Discover Profiles
      </Text>
      <View style={styles.profileArea}>
        {currentProfile ? renderProfileCard(currentProfile) : renderEndOfProfiles()}
      </View>

      {/* We only show buttons if there is a profile to interact with */}
      {currentProfile && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.nopeButton, {backgroundColor: theme.secondary}]}
            onPress={handleNope}
          >
            <Text style={styles.buttonText}>NOPE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.likeButton, {backgroundColor: theme.primary}]}
            onPress={handleLike}
          >
            <Text style={styles.buttonText}>LIKE</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileArea: {
    flex: 1, // Takes up available space
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    height: '95%',
    borderRadius: 15,
    borderWidth: 1,
    overflow: 'hidden',
    // Shadow properties for a card-like feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '85%',
    resizeMode: 'cover', // Cover ensures the image fills the area
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 15,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    paddingBottom: 30, // Add some padding at the bottom
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  nopeButton: {
    backgroundColor: '#ff6b6b',
    // backgroundColor is now set dynamically via theme
  },
  likeButton: {
    backgroundColor: '#6bff6b',
    // backgroundColor is now set dynamically via theme
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  endOfDeckContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endOfDeckText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  }
});

export default HomeScreen;
