import { useCallback } from 'react';
import { HomeDashboardUI } from './HomeDashboardUI';
import { useAIPlanner } from '../../hooks/useAIPlanner';
import { REAL_LOCATIONS } from '../../data/locations';
import type { Combo, Activity } from '../../types';

interface Props {
  weatherData: any;
  showToast: (msg: string) => void;
  setSelectedCombo: (c: Combo) => void;
  setShowPaymentModal: (v: boolean) => void;
  setRideModalLoc: (v: { name: string; lat: number; lng: number } | null) => void;
  setRealImageLoc: (v: { name: string; mapsUri: string; desc?: string; imageUrl?: string } | null) => void;
  combos: Combo[];
  setCombos: (c: Combo[]) => void;
  openChat: () => void;
  formatVND: (n: number) => string;
  location: string;
}

export function HomeView({ 
  weatherData, showToast, setSelectedCombo, setShowPaymentModal, 
  setRideModalLoc, setRealImageLoc, combos, setCombos, 
  openChat, formatVND, location 
}: Props) {
  
  const { formState, dataState, actions } = useAIPlanner({
    location,
    showToast,
    initialCombos: combos,
  });

  // Sync combos back up if necessary, but actually we should just map dataState.combos
  // Wait, if combos are generated in useAIPlanner, do we set Combos for App?
  // Our hook has its own combos state. We should probably sync it back or pass setCombos into the hook. Let's sync it.
  // Actually, useAIPlanner just uses its own internal state. To keep it compatible, we should use the useAIPlanner's combos instead or pass the prop combos down to useAIPlanner. 
  // Let's rely on dataState.combos.
  
  const categories = Array.from(new Set(REAL_LOCATIONS.map(loc => loc.category).filter(Boolean))) as string[];

  const handleSelectCombo = useCallback((combo: Combo) => {
    setSelectedCombo(combo);
    setShowPaymentModal(true);
  }, [setSelectedCombo, setShowPaymentModal]);

  const handleSelectVenue = useCallback((venue: Activity) => {
    // If venue has an image, maybe show the image modal? Or map?
    // Let's trigger the real location image view
    if (venue.imageUrl) {
      setRealImageLoc({
        name: venue.name,
        mapsUri: venue.websiteUri || '',
        desc: venue.address,
        imageUrl: venue.imageUrl
      });
    } else if (venue.lat && venue.lng) {
       setRideModalLoc({
           name: venue.name,
           lat: venue.lat,
           lng: venue.lng
       });
    }
  }, [setRealImageLoc, setRideModalLoc]);

  return (
    <HomeDashboardUI
      userName="Hưng"
      userAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuD5fQvzhgWAnCEj7ACr7c_XPwX5u48krOmZuXxBChh911zOWYQRJcnaNtoQqplogf2AXUFicP9kn3TIbu-AI1FrobzW7zy73oO1v4ehbZKCtmSt1KXQJvIubhuBTzIGi1c0kzLLvt_Ykxn2ypNtz5YplxUHttU4mqRkMU9L82XDuoouQij2ZUUSpiP13o49_TSgYHOa0ZNTSCx4Am6e1gxZ83r7nQQ9uQpArgF6iu6SjN34NGisxjWTJ-xiImchPKYVctLQsyydIUBS"
      dateMiles={1500}
      openChat={openChat}
      weatherData={weatherData}
      budget={formState.budget}
      onBudgetChange={formState.setBudget}
      companion={formState.companion}
      onCompanionChange={formState.setCompanion}
      startTime={formState.startTime}
      endTime={formState.endTime}
      onTimeChange={(start, end) => {
          formState.setStartTime(start);
          formState.setEndTime(end);
      }}
      preferences={formState.preferences}
      categories={categories}
      onPreferenceToggle={(cat) => {
          const isSelected = formState.preferences.includes(cat);
          if (isSelected) formState.setPreferences(formState.preferences.filter(p => p !== cat));
          else formState.setPreferences([...formState.preferences, cat]);
      }}
      isGenerating={dataState.isLoading}
      onGenerate={actions.generate}
      combos={dataState.combos}
      error={dataState.error}
      onSelectCombo={handleSelectCombo}
      onSelectVenue={handleSelectVenue}
      formatVND={formatVND}
    />
  );
}
