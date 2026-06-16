import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type Step = {
  number: number;
  title: string;
};

type StepIndicatorProps = {
  steps: Step[];
  currentStep: number;
};

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <View style={styles.row}>
      {steps.map((step, index) => {
        const done = currentStep > step.number;
        const active = currentStep === step.number;
        return (
          <View key={step.number} style={styles.item}>
            <View style={styles.stepTrack}>
              <View
                style={[
                  styles.circle,
                  done && styles.circleDone,
                  active && styles.circleActive,
                ]}
              >
                <Text
                  style={[
                    styles.circleText,
                    (done || active) && styles.circleTextActive,
                  ]}
                >
                  {done ? '✓' : step.number}
                </Text>
              </View>
              {index < steps.length - 1 ? (
                <View style={[styles.line, done && styles.lineDone]} />
              ) : null}
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>{step.title}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  stepTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  circleDone: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  circleText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  circleTextActive: {
    color: colors.white,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 4,
    maxWidth: 24,
  },
  lineDone: {
    backgroundColor: colors.primary,
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.primary,
  },
});
