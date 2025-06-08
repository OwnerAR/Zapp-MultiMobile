import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { CheckCircle, X } from 'lucide-react-native';
import { colors } from '../constants/colors';

interface SuccessMessageProps {
    message: string;
    onDismiss?: () => void;
}

const SuccessMessage = ({ message, onDismiss }: SuccessMessageProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.messageContainer}>
                <CheckCircle size={32} color={colors.status.success.main} strokeWidth={2} style={styles.icon} />
                <Text style={styles.message}>{message}</Text>
                {onDismiss && (
                    <TouchableOpacity 
                        style={styles.dismissButton} 
                        onPress={onDismiss}
                        accessibilityRole="button"
                        accessibilityLabel="Dismiss"
                    >
                        <X size={16} color={colors.status.success.contrastText} strokeWidth={2} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    messageContainer: {
        backgroundColor: colors.common.white,
        padding: 24,
        borderRadius: 10,
        width: '80%',
        gap: 10,
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
    },
    icon: {
        marginRight: 12,
    },
    message: {
        fontSize: 16,
        color: colors.status.success.main,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        lineHeight: 22,
        textAlign: 'center',
        marginVertical: 8,
        maxWidth: '100%',
    },
    dismissButton: {
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: colors.status.success.main,
        borderRadius: 8,
    },
    dismissIcon: {
        color: colors.status.success.contrastText,
    },
});

export default SuccessMessage;