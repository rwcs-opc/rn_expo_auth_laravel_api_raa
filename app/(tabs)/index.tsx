import { useAuth } from '@/contexts/AuthContextMock';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

const carouselImages = [
  require('@/assets/images_safe_home/safe1.png'),
  require('@/assets/images_safe_home/safe2.png'),
  require('@/assets/images_safe_home/safe3.png'),
];

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const { user, userData } = useAuth();

  useEffect(() => {
    // If logged in and registered, redirect to dashboard
    if (user && userData?.isRegistered) {
      router.replace('/dashboard');
    }
  }, [user, userData, router]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // Auto-scroll carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % carouselImages.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  const renderCarouselItem = ({ item }: { item: any }) => (
    <View style={styles.carouselItem}>
      <Image source={item} style={styles.carouselImage} contentFit="cover" />
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {carouselImages.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === activeIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Safe Online</Text>
        <Text style={styles.headerSubtitle}>Food • Grocery • Medicine</Text>
      </View>

      {/* Carousel */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={carouselImages}
          renderItem={renderCarouselItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          keyExtractor={(_, index) => index.toString()}
        />
        {renderDots()}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to Safe Online</Text>
        <Text style={styles.descriptionText}>
          Get your food, groceries, and medicines delivered to your doorstep quickly and safely.
        </Text>
      </View>

      {/* Login Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signupButton}>
          <Text style={styles.signupButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E23744',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  carouselContainer: {
    height: 300,
    marginTop: 20,
  },
  carouselItem: {
    width: SCREEN_WIDTH,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: SCREEN_WIDTH - 40,
    height: 280,
    borderRadius: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#E23744',
    width: 24,
  },
  inactiveDot: {
    backgroundColor: '#CCCCCC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  loginButton: {
    backgroundColor: '#E23744',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#E23744',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E23744',
  },
  signupButtonText: {
    color: '#E23744',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
