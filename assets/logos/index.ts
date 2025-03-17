export const logos = {
  small: require('./logo_small.png'),
  medium: require('./logo_medium.png'),
  large: require('./logo_large.png'),
  extraLarge: require('./logo_xlarge.png'),
} as const;

// Usage example:
// import { logos } from '@/assets/logos';
// <Image source={logos.small} style={{ width: 28, height: 28 }} /> 