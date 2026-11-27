import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

type ChecklistHeaderProps = {
    title: string;
    instructions?: string;
    date: string;
    job: React.ReactNode;
    nomina: React.ReactNode;
    label?: string;
};

export function ChecklistHeader({ title, instructions, date, job, nomina, label = 'BOM CONFIRMACIÓN' }: ChecklistHeaderProps) {
    return (
        <>
            <View style={styles.header}>
                <Text style={styles.headerLabel}>{label}</Text>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
            <View style={styles.infoCard}>
                <View style={styles.infoColumn}>
                    <Text style={styles.infoLabel}>FECHA</Text>
                    <Text style={styles.infoText}>{date}</Text>
                </View>
                <View style={[styles.infoColumn, styles.infoColumnDivider]}>
                    <Text style={styles.infoLabel}>JOB</Text>
                    <Text style={styles.infoText}>{job}</Text>
                </View>
                <View style={[styles.infoColumn, styles.infoColumnDivider]}>
                    <Text style={styles.infoLabel}>NÓMINA</Text>
                    <Text style={styles.infoText}>{nomina}</Text>
                </View>
            </View>
            {instructions ? (
                <View style={styles.instructions}>
                    <Text style={styles.sectionTitle}>Instrucciones</Text>
                    <Text style={styles.instructionsText}>{instructions}</Text>
                </View>
            ) : null}
        </>
    );
}

type ChecklistItemProps = {
    title: string;
    description?: string;
    detail?: string;
    checked: boolean;
    onChange: (value: boolean) => void;
};

export function ChecklistItem({ title, description, detail, checked, onChange }: ChecklistItemProps) {
    return (
        <TouchableOpacity
            style={[styles.item, checked && styles.itemChecked]}
            onPress={() => onChange(!checked)}
            activeOpacity={0.75}
            accessibilityRole="checkbox"
            accessibilityState={{ checked }}
            accessibilityLabel={title}
        >
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{title}</Text>
                {description ? <Text style={styles.itemDescription}>{description}</Text> : null}
                {detail ? <Text style={styles.itemDetail}>{detail}</Text> : null}
            </View>
            <CheckBox
                value={checked}
                onValueChange={onChange}
                tintColors={{ true: '#2e7d32', false: '#64748b' }}
                accessible={false}
            />
        </TouchableOpacity>
    );
}

type ChecklistCommentsProps = {
    value: string;
    onChange: (value: string) => void;
    complete?: boolean;
};

export function ChecklistComments({ value, onChange, complete }: ChecklistCommentsProps) {
    return (
        <View style={styles.comments}>
            <Text style={styles.sectionTitle}>Observaciones y comentarios</Text>
            <TextInput
                style={styles.input}
                multiline
                textAlignVertical="top"
                placeholder="Escribe aquí..."
                placeholderTextColor="#718096"
                value={value}
                onChangeText={onChange}
                accessibilityLabel="Observaciones y comentarios"
            />
            {complete !== undefined && (
                <Text style={[styles.status, complete ? styles.statusComplete : styles.statusIncomplete]}>
                    {complete ? 'Estado: completo' : 'Estado: incompleto'}
                </Text>
            )}
        </View>
    );
}

export const checklistStyles = StyleSheet.create({
    background: { flex: 1, backgroundColor: '#f4f6fb' },
    scrollContent: { paddingBottom: 96 },
    sectionHeading: {
        color: '#0b2d6b',
        fontSize: 17,
        fontWeight: '700',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
    },
});

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#0b2d6b',
        paddingHorizontal: 20,
        paddingVertical: 18,
        paddingTop: 40
    },
    headerLabel: { color: '#dbe6ff', fontSize: 14, fontWeight: '600' },
    headerTitle: { color: '#fff', fontSize: 21, fontWeight: '700', marginTop: 4 },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderColor: '#e5e9f2',
        borderWidth: 1,
        borderRadius: 12,
        marginHorizontal: 16,
        marginTop: 16,
        paddingVertical: 14,
        paddingHorizontal: 10,
    },
    infoColumn: { flex: 1, paddingHorizontal: 6 },
    infoColumnDivider: { borderLeftWidth: 1, borderLeftColor: '#e5e9f2' },
    infoLabel: { color: '#000000', fontSize: 14, fontWeight: '700', marginBottom: 4 },
    infoText: { color: '#1a1a2e', fontSize: 16 },
    instructions: { marginHorizontal: 16, marginTop: 16 },
    sectionTitle: { color: '#0b2d6b', fontSize: 15, fontWeight: '700', marginBottom: 8 },
    instructionsText: { color: '#000000', fontSize: 16, lineHeight: 21 },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#e5e9f2',
        borderWidth: 1,
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 10,
        padding: 14,
    },
    itemChecked: { backgroundColor: '#e8f5e9', borderColor: '#a5d6a7' },
    itemContent: { flex: 1, paddingRight: 8 },
    itemTitle: { color: '#1a1a2e', fontSize: 15, fontWeight: '700', lineHeight: 21 },
    itemDescription: { color: '#475569', fontSize: 14, lineHeight: 20, marginTop: 5 },
    itemDetail: { color: '#64748b', fontSize: 13, lineHeight: 19, marginTop: 6 },
    comments: {
        backgroundColor: '#fff',
        borderColor: '#e5e9f2',
        borderWidth: 1,
        borderRadius: 12,
        marginHorizontal: 16,
        marginTop: 12,
        padding: 14,
    },
    input: {
        backgroundColor: '#f8f9fc',
        borderColor: '#dbe3ef',
        borderWidth: 1,
        borderRadius: 10,
        color: '#1a1a2e',
        fontSize: 14,
        minHeight: 100,
        padding: 12,
    },
    status: { fontSize: 13, fontWeight: '600', marginTop: 10 },
    statusComplete: { color: '#2e7d32' },
    statusIncomplete: { color: '#935a00' },
});
