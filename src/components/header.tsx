import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { useTheme } from '@/hooks/use-theme';

interface HeaderProps {
  title?: string;
}

export function Header({ title = 'Mowho' }: HeaderProps) {
  const colors = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <ThemedText 
        type="title" 
        style={[styles.title, { color: '#000000' }]}
      >
        {title}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 0,
    textAlign: 'center',
  },
});
