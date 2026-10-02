import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Favorite } from '@mui/icons-material';
import LoginPage from '../Auth/LoginPage';
import SignupPage from '../Auth/SignupPage';
import BusinessSignupPage from '../Vendors/BusinessSignupPage';
import CreateProfilePrompt from '../Profile/CreateProfilePrompt';
import ProfilePage from '../Profile/ProfilePage';
import Navbar from '../Navigation/Navbar';
import Dashboard from '../Dashboard/Dashboard';
import FunQuizCard from '../Quiz/FunQuizCard';
import ReusableQuiz from '../Quiz/ReusableQuiz';
import { quizDefinitions } from '../../lib/quizzes';
import PersonalEventsSection from '../Dashboard/PersonalEventsSection';
import PersonalEventProfilePicker from '../PersonalEvents/PersonalEventProfilePicker';
import SponsoredEventsSection from '../Events/SponsoredEventsSection';
import VendorEventsPage from '../Vendors/VendorEventsPage';
import MatchingPage from '../Matching/MatchingPage';
import ChatsPage from '../Chat/ChatsPage';

const toc = [
  ['start', 'How to read this'],
  ['login', 'Sign in'],
  ['signup', 'User sign up'],
  ['business-signup', 'Business sign up'],
  ['profile', 'Profile'],
  ['nav', 'Moving around'],
  ['dashboard', 'Dashboard'],
  ['quizzes', 'Quizzes'],
  ['personal-events', 'Personal events'],
  ['sponsored', 'Sponsored events'],
  ['matching', 'Matching'],
  ['chat', 'Chat after a match'],
];

const Preview = ({ children, tall = false }) => (
  <Box
    sx={{
      mt: 2,
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'grey.200',
      bgcolor: 'background.default',
      pointerEvents: 'none',
      userSelect: 'none',
      maxHeight: tall ? 920 : 'none',
      overflowX: 'hidden',
      overflowY: tall ? 'auto' : 'visible',
    }}
  >
    {children}
  </Box>
);

const Section = ({ id, kicker, title, children }) => (
  <Box component="section" id={id} sx={{ scrollMarginTop: 24, mb: 8 }}>
    <Typography variant="overline" color="secondary.main" fontWeight={800} letterSpacing={1.2}>
      {kicker}
    </Typography>
    <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5, mb: 1.5, fontSize: { xs: '1.6rem', sm: '2rem' } }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const Prose = ({ children }) => (
  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760, lineHeight: 1.75 }}>
    {children}
  </Typography>
);

const SAMPLE_SPONSORED = [
  {
    id: 'tour-sponsored',
    business_name: 'Cafe Lumen',
    title: 'Sunset mixer on the patio',
    description: 'A small sponsored dating social. The business proposes it, an admin approves it, then it appears on the dashboard.',
    location: '120 Uptown Ave',
    event_starts_at: '2026-07-12T22:00:00.000Z',
    business_website: 'https://cafelumen.example',
  },
];

const PICKER_PROFILES = [
  {
    id: 'host',
    displayName: 'Elton Tito',
    age: 26,
    bio: 'Been drinking coffee and looking for a partner in crime.',
    photoUrl: '/images/users/emmaWilson.jpeg',
  },
  {
    id: 'decoy-a',
    displayName: 'Jamie',
    age: 31,
    bio: 'Live music, long walks, and spontaneous day trips.',
    photoUrl: '/images/users/sarahJohnson.jpeg',
  },
  {
    id: 'decoy-b',
    displayName: 'Riley',
    age: 27,
    bio: 'Foodie, weekend hikes, and good playlists.',
    photoUrl: '/images/users/avaDavis.jpeg',
  },
];

const sampleQuiz = quizDefinitions[0];

const TourPage = () => (
  <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
    <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'grey.200' }}>
      <Container maxWidth="lg" sx={{ py: 1.5, px: { xs: 2, sm: 3 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              borderRadius: '50%',
              p: 1,
              display: 'flex',
            }}
          >
            <Favorite sx={{ fontSize: 20, color: '#fff' }} />
          </Box>
          <Typography variant="h5" fontWeight={800}>OneDate tour</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button component={RouterLink} to="/login" size="small">Sign in</Button>
          <Button component={RouterLink} to="/signup" variant="contained" size="small">Sign up</Button>
        </Stack>
      </Container>
    </Box>

    <Container maxWidth="lg" sx={{ pt: 4, px: { xs: 2, sm: 3 } }}>
      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, mb: 4, border: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="overline" color="secondary.main" fontWeight={800}>Product guide</Typography>
        <Typography variant="h3" fontWeight={800} sx={{ mt: 1, mb: 1.5, fontSize: { xs: '2rem', md: '2.75rem' } }}>
          How OneDate works
        </Typography>
        <Prose>
          This page walks through the product in the same order a person would experience it: account creation,
          a profile, the home dashboard, quizzes, personal events, sponsored business events, matching, and the
          chat that opens after a match. The screens below are the real components, locked so nothing is submitted.
        </Prose>
        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1} sx={{ mt: 3 }}>
          {toc.map(([id, label]) => (
            <Button key={id} component="a" href={`#${id}`} size="small" variant="outlined" sx={{ fontWeight: 700 }}>
              {label}
            </Button>
          ))}
        </Stack>
      </Paper>

      <Section id="start" kicker="01" title="Two kinds of accounts">
        <Prose>
          A person signs up to date. A business signs up to sponsor a dating event. Both use the same light
          layout as the rest of the app: a paper card on the off-white background, indigo accents, and a short form.
        </Prose>
      </Section>

      <Section id="login" kicker="02" title="Sign in">
        <Prose>
          Returning members sign in with email and password, then land on the dashboard if they already finished
          the opening preferences quiz. The same card is used on the live sign-in page.
        </Prose>
        <Preview>
          <LoginPage preview embedded />
        </Preview>
      </Section>

      <Section id="signup" kicker="03" title="User sign up">
        <Prose>
          A new member completes three steps. Account info creates the login. Personal details capture name, age,
          gender, and who they want to meet. About you stores a bio and city. The last step offers a separate path
          for businesses that want to sponsor an event instead.
        </Prose>
        <Preview tall>
          <SignupPage preview embedded />
        </Preview>
      </Section>

      <Section id="business-signup" kicker="04" title="Business sign up">
        <Prose>
          A sponsor account asks for a contact name, the business name, a street address, and a login. That name
          and address have to exist before the business can propose an event. After sign up, the business portal
          is where events are submitted for approval.
        </Prose>
        <Preview>
          <BusinessSignupPage preview embedded />
        </Preview>
      </Section>

      <Section id="profile" kicker="05" title="Creating a profile">
        <Prose>
          If a member has no profile yet, the app shows a short welcome that lists what is needed: basics, dating
          preferences, photos, and a location. Once those are saved, the profile page becomes a bento layout:
          photos, details, about, and quiz results. Members can edit later. The preview below is a filled profile,
          then the empty-state prompt that appears before one exists.
        </Prose>
        <Preview tall>
          <ProfilePage preview />
        </Preview>
        <Box sx={{ mt: 2 }}>
          <Preview>
            <Box sx={{ p: 2 }}>
              <CreateProfilePrompt onCreateProfile={() => {}} />
            </Box>
          </Preview>
        </Box>
      </Section>

      <Section id="nav" kicker="06" title="The app frame">
        <Prose>
          Signed-in pages share a top bar with the OneDate mark, notifications, the member avatar, and sign out.
          A bottom bar jumps between Home, Chats, and Profile. Home is the dashboard.
        </Prose>
        <Preview>
          <Navbar embedded />
        </Preview>
      </Section>

      <Section id="dashboard" kicker="07" title="Dashboard">
        <Prose>
          Home opens with the door block: the season clock, remaining swipes, and the quizzes required before
          more swipes unlock. Under that, sponsored events appear only when a business event is live. Then a grid
          of personality quizzes, then personal events the member can post or apply to.
        </Prose>
        <Preview tall>
          <Dashboard />
        </Preview>
      </Section>

      <Section id="quizzes" kicker="08" title="A quiz">
        <Prose>
          Each quiz is a colored card on the dashboard. Opening one asks a short set of questions, one choice at
          a time. Finishing saves a result and can add a swipe. The card row and the first question below are the
          same quiz components, with answers locked.
        </Prose>
        <Preview>
          <Box sx={{ p: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            {quizDefinitions.slice(0, 4).map((quiz) => (
              <FunQuizCard key={quiz.id} quiz={quiz} statusVariant="not_started" />
            ))}
          </Box>
        </Preview>
        <Box sx={{ mt: 2 }}>
          <Preview>
            <Box sx={{ p: 2 }}>
              <ReusableQuiz
                title={sampleQuiz.title}
                description={sampleQuiz.subtitle}
                questions={sampleQuiz.questions}
                readOnly
              />
            </Box>
          </Preview>
        </Box>
      </Section>

      <Section id="personal-events" kicker="09" title="Personal events">
        <Prose>
          A member gets one post per month. The form asks for a title, an approximate area, a date type, a
          description, and a calendar date with a time. Other people apply by picking the real host out of three
          profiles. The other two are decoys. A wrong pick returns home and hides that event for the applicant.
          When someone applies, the host sees a notification on their post and picks the real applicant the same way.
        </Prose>
        <Preview tall>
          <Box sx={{ p: 2 }}>
            <PersonalEventsSection previewComposer displayName="You" />
          </Box>
        </Preview>
        <Box sx={{ mt: 2 }}>
          <Preview>
            <Box sx={{ p: 2 }}>
              <PersonalEventProfilePicker
                title="Who do you want to go on this date with?"
                subtitle="One of these three is the real event host."
                profiles={PICKER_PROFILES}
                onSelect={() => {}}
                disabled
              />
            </Box>
          </Preview>
        </Box>
      </Section>

      <Section id="sponsored" kicker="10" title="Business event flow">
        <Prose>
          After the business profile is saved, the sponsor portal is where an event is written up: title,
          description, location, category, and start time. Submissions stay pending until they are approved.
          Approved events show on the dashboard as sponsored cards, with the business name and a live window.
        </Prose>
        <Preview>
          <Box sx={{ p: 2 }}>
            <SponsoredEventsSection events={SAMPLE_SPONSORED} />
          </Box>
        </Preview>
        <Box sx={{ mt: 2 }}>
          <Preview tall>
            <VendorEventsPage preview />
          </Preview>
        </Box>
      </Section>

      <Section id="matching" kicker="11" title="Matching with someone">
        <Prose>
          Discover shows one profile at a time. A pass moves on. A like is stored, and if the other person already
          liked back, it becomes a match. A match can include a quiz comparison, then both people can open a chat.
          Swipes are limited and refill on a timer shown on the card.
        </Prose>
        <Preview tall>
          <MatchingPage preview />
        </Preview>
      </Section>

      <Section id="chat" kicker="12" title="Chat after a match">
        <Prose>
          Matches become conversations. The left list is everyone you matched with. The right pane is the thread:
          their messages, yours, and a composer that stays empty until you send something. This preview is a
          finished match thread, with sending turned off.
        </Prose>
        <Preview tall>
          <ChatsPage preview />
        </Preview>
      </Section>
    </Container>
  </Box>
);

export default TourPage;
