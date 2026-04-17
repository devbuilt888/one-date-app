import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import { useAuth } from '../../App';
import ReusableQuiz from './ReusableQuiz';
import { savePreferencesQuizAnswers } from '../../lib/preferencesQuiz';

const INITIAL_PREFERENCES_QUESTIONS = [
  {
    id: 'intent',
    question: 'What are you looking for right now?',
    options: [
      { value: 'romance', label: 'Romance', description: 'A meaningful romantic connection.' },
      { value: 'friends', label: 'Friends', description: 'New people, good vibes, and friendship.' },
      { value: 'both', label: 'Both', description: 'Open to friendship and romance.' },
    ],
  },
  {
    id: 'relationship_pace',
    question: 'What pace feels right for getting to know someone?',
    options: [
      { value: 'slow', label: 'Slow and steady', description: 'Take time and build trust first.' },
      { value: 'balanced', label: 'Balanced', description: 'A little chat, then meet when it feels right.' },
      { value: 'fast', label: 'Fast', description: 'I like quick chemistry and quick meetups.' },
    ],
  },
  {
    id: 'date_style',
    question: 'What is your ideal first date style?',
    options: [
      { value: 'coffee', label: 'Coffee or brunch', description: 'Simple and casual.' },
      { value: 'active', label: 'Activity date', description: 'Walks, mini golf, museums, or fun events.' },
      { value: 'dinner', label: 'Dinner vibes', description: 'A classic sit-down date.' },
    ],
  },
  {
    id: 'communication',
    question: 'How often do you like to message?',
    options: [
      { value: 'daily', label: 'Daily', description: 'I enjoy regular check-ins.' },
      { value: 'few_times_week', label: 'A few times a week', description: 'Consistent, but not constant.' },
      { value: 'flexible', label: 'Flexible', description: 'Depends on connection and schedule.' },
    ],
  },
  {
    id: 'weekend_energy',
    question: 'Pick your usual weekend energy.',
    options: [
      { value: 'outgoing', label: 'Out and social', description: 'Events, friends, nightlife, adventures.' },
      { value: 'cozy', label: 'Cozy and calm', description: 'Movies, home cooking, low-key plans.' },
      { value: 'mix', label: 'Mix of both', description: 'Some social, some recharge time.' },
    ],
  },
];

const InitialPreferencesQuiz = ({ onCompleted }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleComplete = async (answers) => {
    savePreferencesQuizAnswers(user?.id, answers);
    if (onCompleted) {
      onCompleted(answers);
      return;
    }
    navigate('/dashboard', { replace: true });
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box sx={{ minHeight: 'calc(100vh - 140px)', display: 'flex', alignItems: 'center' }}>
        <ReusableQuiz
          title="Tell us your dating preferences"
          description="Quick setup. Tap an answer to continue - no extra submit button needed."
          questions={INITIAL_PREFERENCES_QUESTIONS}
          onComplete={handleComplete}
          submitLabel="Saving your preferences..."
        />
      </Box>
    </Container>
  );
};

export default InitialPreferencesQuiz;
