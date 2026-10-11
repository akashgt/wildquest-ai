import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppProvider } from '../context/AppContext';
import { AdventureProvider } from '../context/AdventureContext';
import { LandingView } from '../components/landing/LandingView';
import { OnboardingWizard } from '../components/onboarding/OnboardingWizard';
import { AchievementsView } from '../components/achievements/AchievementsView';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AppProvider>
      <AdventureProvider>
        {ui}
      </AdventureProvider>
    </AppProvider>
  );
};

describe('Component Rendering & UI Flows', () => {
  it('Landing page displays required hero heading, subtitle, and exploration buttons', () => {
    renderWithProviders(<LandingView />);

    // Required exact hero copy
    expect(
      screen.getByRole('heading', { name: /Your next adventure is closer than you think/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Discover the extraordinary in the ordinary with your personal AI nature companion/i)
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Start Exploring/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /See How It Works/i })).toBeInTheDocument();
  });

  it('Onboarding wizard displays interests and allows advancing steps', async () => {
    renderWithProviders(<OnboardingWizard />);

    expect(screen.getByText(/What sparks your curiosity outdoors\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Wild Plants/i)).toBeInTheDocument();
    expect(screen.getByText(/Birds & Songs/i)).toBeInTheDocument();

    const continueBtn = screen.getByRole('button', { name: /Continue/i });
    expect(continueBtn).toBeInTheDocument();

    fireEvent.click(continueBtn);

    // Step 2 should display surroundings
    await waitFor(() => {
      expect(screen.getByText(/Where & for how long will you explore\?/i)).toBeInTheDocument();
    });
  });

  it('Achievements view displays genuine milestone badges without manipulative streaks', () => {
    renderWithProviders(<AchievementsView />);

    expect(screen.getByRole('heading', { name: /Outdoor Badges/i })).toBeInTheDocument();
    expect(screen.getByText(/First Steps/i)).toBeInTheDocument();
    expect(screen.getByText(/Curious Eyes/i)).toBeInTheDocument();
    expect(screen.getByText(/No manipulative gamification/i)).toBeInTheDocument();
  });
});
