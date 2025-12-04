// components/ui/collapsible.tsx
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { ReactNode, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;   // ← this is the missing prop
};

export function Collapsible({ title, children, defaultOpen = false }: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.8}>
        <IconSymbol
          name={isOpen ? 'chevron.down' : 'chevron.right'}
          size={22}
          color="#808080"
        />
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {title}
        </ThemedText>
      </TouchableOpacity>

      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(120,120,120,0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});