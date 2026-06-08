import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon, Path, Circle } from 'react-native-svg';
import { COLORS, FONTS } from '../../constants/theme';

// Custom SVG Tab Icons
function HomeIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9.5L12 2L21 9.5V20C21 20.55 20.78 21.02 20.34 21.41C19.9 21.8 19.38 22 18.8 22H5.2C4.62 22 4.1 21.8 3.66 21.41C3.22 21.02 3 20.55 3 20V9.5Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round"/>
      <Path d="M9 22V12H15V22" stroke={color} strokeWidth={1.8} strokeLinejoin="round"/>
    </Svg>
  );
}

function ServicesIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L21.5 7.5V16.5L12 22L2.5 16.5V7.5L12 2Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round"/>
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.8}/>
    </Svg>
  );
}

function ProcessIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx={5} cy={6} r={2.5} stroke={color} strokeWidth={1.8}/>
      <Circle cx={5} cy={14} r={2.5} stroke={color} strokeWidth={1.8}/>
      <Circle cx={5} cy={22} r={2} stroke={color} strokeWidth={1.8}/>
      <Path d="M7.5 6H19M7.5 14H19M7 22H19" stroke={color} strokeWidth={1.8} strokeLinecap="round"/>
      <Path d="M5 8.5V11.5" stroke={color} strokeWidth={1.8} strokeLinecap="round"/>
      <Path d="M5 16.5V19.5" stroke={color} strokeWidth={1.8} strokeLinecap="round"/>
    </Svg>
  );
}

function ResultsIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M2 20L7 14L11 17L16 11L22 15" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/>
      <Path d="M22 9V15H16" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

function ContactIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M21 5H3C2.45 5 2 5.45 2 6V18C2 18.55 2.45 19 3 19H21C21.55 19 22 18.55 22 18V6C22 5.45 21.55 5 21 5Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round"/>
      <Path d="M2 6L12 13L22 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.forge,
        tabBarInactiveTintColor: COLORS.steel + '80',
        tabBarLabelStyle: styles.tabLabel,
        tabBarBackground: () => (
          <View style={styles.tabBackground} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color }) => <ServicesIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="process"
        options={{
          title: 'Process',
          tabBarIcon: ({ color }) => <ProcessIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="testimonials"
        options={{
          title: 'Results',
          tabBarIcon: ({ color }) => <ResultsIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: 'Contact',
          tabBarIcon: ({ color }) => <ContactIcon color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'transparent',
    borderTopColor: COLORS.forge + '30',
    borderTopWidth: 1,
    height: 75,
    paddingBottom: 12,
    paddingTop: 8,
    elevation: 0,
  },
  tabBackground: {
    flex: 1,
    backgroundColor: '#111111',
  },
  tabLabel: {
    fontFamily: FONTS.body,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
