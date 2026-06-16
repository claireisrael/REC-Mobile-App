import { RegistrationForm } from '@/components/registration/RegistrationForm';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { useAppData } from '@/context/AppDataContext';
import { getConferenceInfo } from '@/lib/conference-info';

export default function RegisterScreen() {
  const { conference: liveConference, loading, error, refresh } = useAppData();
  const conference = getConferenceInfo(liveConference);

  if (loading && !liveConference) {
    return <LoadingState />;
  }

  if (!conference) {
    return (
      <ErrorState
        title="Registration unavailable"
        message={error || 'Conference information could not be loaded.'}
        onRetry={refresh}
      />
    );
  }

  return (
    <ScreenContainer>
      <RegistrationForm conference={conference} />
    </ScreenContainer>
  );
}
