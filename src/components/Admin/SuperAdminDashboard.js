import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  IconButton,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  AdminPanelSettings,
  Refresh,
  ChatBubbleOutline,
} from '@mui/icons-material';
import { useAuth } from '../../App';
import { admin, quizCompletions } from '../../lib/supabase';
import { getQuizDefinition } from '../../lib/quizzes';
import { labelForEventType } from '../../lib/personalEvents';
import { formatProfileLocationDetail } from '../../utils/geolocation';
import { resolveProfileLocationLabels } from '../../utils/reverseGeocode';
import ProfileLocationCell from './ProfileLocationCell';

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString();
};

const UserRow = ({ profile, email, quizResults, matchCount, likeCount, resolvedLabels, resolvingLocations }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar src={profile.photo_urls?.[0]} sx={{ width: 36, height: 36 }}>
              {(profile.display_name || '?')[0]}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {profile.display_name || 'Unnamed'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {email || profile.id}
              </Typography>
            </Box>
          </Stack>
        </TableCell>
        <TableCell>{profile.age ?? '—'}</TableCell>
        <TableCell>{profile.gender || '—'}</TableCell>
        <TableCell>
          <ProfileLocationCell
            profile={profile}
            resolvedLabels={resolvedLabels}
            resolving={resolvingLocations}
          />
        </TableCell>
        <TableCell>{matchCount}</TableCell>
        <TableCell>{likeCount}</TableCell>
        <TableCell>{quizResults.length}</TableCell>
        <TableCell>{formatDate(profile.created_at)}</TableCell>
        <TableCell align="right">
          <IconButton size="small" onClick={() => setOpen((prev) => !prev)}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={9} sx={{ py: 0, borderBottom: open ? undefined : 'none' }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Profile details
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                {profile.work && <Chip size="small" label={`Work: ${profile.work}`} />}
                {profile.education && <Chip size="small" label={`Education: ${profile.education}`} />}
                {(profile.interests || []).map((interest) => (
                  <Chip key={interest} size="small" variant="outlined" label={interest} />
                ))}
              </Stack>
              {profile.bio && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {profile.bio}
                </Typography>
              )}

              {formatProfileLocationDetail(profile) && (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                  {formatProfileLocationDetail(profile)}
                </Typography>
              )}

              <Typography variant="subtitle2" gutterBottom>
                Quiz results
              </Typography>
              {quizResults.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No quiz completions saved yet.
                </Typography>
              ) : (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {quizResults.map((result) => {
                    const quiz = getQuizDefinition(result.quiz_id);
                    return (
                      <Chip
                        key={result.id}
                        label={`${quiz?.title || result.quiz_id}: ${result.result_label}`}
                        color="primary"
                        variant="outlined"
                      />
                    );
                  })}
                </Stack>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ConversationRow = ({ conversation, emails }) => {
  const [open, setOpen] = useState(false);
  const match = conversation.match;
  const userA = match?.user_a?.display_name || match?.user_a_id || 'User A';
  const userB = match?.user_b?.display_name || match?.user_b_id || 'User B';
  const messages = conversation.messages || [];

  return (
    <>
      <TableRow hover>
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <ChatBubbleOutline fontSize="small" color="action" />
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {userA} ↔ {userB}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Match {formatDate(match?.created_at)}
              </Typography>
            </Box>
          </Stack>
        </TableCell>
        <TableCell>{messages.length}</TableCell>
        <TableCell>{formatDate(conversation.created_at)}</TableCell>
        <TableCell>
          {messages.length > 0
            ? formatDate(messages[messages.length - 1].created_at)
            : '—'}
        </TableCell>
        <TableCell align="right">
          <IconButton size="small" onClick={() => setOpen((prev) => !prev)}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={5} sx={{ py: 0, borderBottom: open ? undefined : 'none' }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 2, px: 1 }}>
              {messages.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No messages in this conversation yet.
                </Typography>
              ) : (
                <Stack spacing={1.5}>
                  {messages.map((message) => {
                    const senderName =
                      message.sender?.display_name ||
                      emails[message.sender_id] ||
                      message.sender_id;
                    const isUserA = message.sender_id === match?.user_a_id;

                    return (
                      <Box
                        key={message.id}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isUserA ? 'flex-start' : 'flex-end',
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25 }}>
                          {senderName} · {formatDate(message.created_at)}
                        </Typography>
                        <Paper
                          elevation={0}
                          sx={{
                            px: 2,
                            py: 1.25,
                            maxWidth: '85%',
                            bgcolor: isUserA ? 'grey.100' : 'primary.main',
                            color: isUserA ? 'text.primary' : 'primary.contrastText',
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant="body2">{message.text}</Typography>
                        </Paper>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const SuperAdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [emails, setEmails] = useState({});
  const [matches, setMatches] = useState([]);
  const [likes, setLikes] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [personalEvents, setPersonalEvents] = useState([]);
  const [vendorEvents, setVendorEvents] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [resolvedLabels, setResolvedLabels] = useState({});
  const [resolvingLocations, setResolvingLocations] = useState(false);
  const [accessError, setAccessError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    setAccessError('');

    try {
      const { isAdmin, error: adminCheckError } = await admin.isSuperAdmin();
      setAuthorized(isAdmin);

      if (adminCheckError) {
        setAccessError(adminCheckError);
      }

      if (!isAdmin) {
        setLoading(false);
        return;
      }

      const [
        { data: profileData, error: profilesError },
        { data: emailData, error: emailsError },
        { data: matchData, error: matchesError },
        { data: likeData, error: likesError },
        { data: quizData, error: quizError },
        { data: personalEventData, error: personalEventsError },
        { data: vendorEventData, error: vendorEventsError },
        { data: conversationData, error: conversationsError },
      ] = await Promise.all([
        admin.getAllProfiles(),
        admin.getUserEmails(),
        admin.getAllMatches(),
        admin.getAllLikes(),
        quizCompletions.getAll(),
        admin.getAllPersonalEvents(),
        admin.getAllVendorSponsoredEvents(),
        admin.getAllConversations(),
      ]);

      if (profilesError) throw profilesError;
      if (emailsError) throw emailsError;
      if (matchesError) throw matchesError;
      if (likesError) throw likesError;
      if (quizError) throw quizError;
      if (personalEventsError) throw personalEventsError;
      if (vendorEventsError) throw vendorEventsError;
      if (conversationsError) throw conversationsError;

      setProfiles(profileData || []);
      setEmails(
        Object.fromEntries((emailData || []).map((row) => [row.user_id, row.email]))
      );
      setMatches(matchData || []);
      setLikes(likeData || []);
      setQuizResults(quizData || []);
      setPersonalEvents(personalEventData || []);
      setVendorEvents(vendorEventData || []);
      setConversations(conversationData || []);

      setResolvingLocations(true);
      resolveProfileLocationLabels(profileData || [])
        .then(setResolvedLabels)
        .finally(() => setResolvingLocations(false));
    } catch (err) {
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, loadData]);

  const quizResultsByUser = useMemo(() => {
    const map = {};
    quizResults.forEach((result) => {
      if (!map[result.user_id]) map[result.user_id] = [];
      map[result.user_id].push(result);
    });
    return map;
  }, [quizResults]);

  const matchCountByUser = useMemo(() => {
    const map = {};
    matches.forEach((match) => {
      map[match.user_a_id] = (map[match.user_a_id] || 0) + 1;
      map[match.user_b_id] = (map[match.user_b_id] || 0) + 1;
    });
    return map;
  }, [matches]);

  const handleApproveVendorEvent = async (event) => {
    const nowMs = Date.now();
    const activeFromMs = event.proposed_active_from
      ? new Date(event.proposed_active_from).getTime()
      : nowMs;
    const activeFrom = new Date(Math.min(activeFromMs, nowMs)).toISOString();

    const activeUntilMs = event.proposed_active_until
      ? new Date(event.proposed_active_until).getTime()
      : event.event_ends_at
        ? new Date(event.event_ends_at).getTime()
        : nowMs + 30 * 24 * 60 * 60 * 1000;
    const activeUntil = new Date(Math.max(activeUntilMs, nowMs + 60 * 60 * 1000)).toISOString();

    const { error: updateError } = await admin.updateVendorSponsoredEvent(event.id, {
      status: 'active',
      active_from: activeFrom,
      active_until: activeUntil,
    });

    if (updateError) {
      setError(updateError.message || 'Failed to approve vendor event');
      return;
    }

    loadData();
  };

  const handleRejectVendorEvent = async (eventId) => {
    const { error: updateError } = await admin.updateVendorSponsoredEvent(eventId, {
      status: 'rejected',
    });

    if (updateError) {
      setError(updateError.message || 'Failed to reject vendor event');
      return;
    }

    loadData();
  };

  const likeCountByUser = useMemo(() => {
    const map = {};
    likes.forEach((like) => {
      map[like.from_user_id] = (map[like.from_user_id] || 0) + 1;
    });
    return map;
  }, [likes]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!authorized) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          You do not have super admin access.
          {accessError && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {accessError}
            </Typography>
          )}
        </Alert>
        <Alert severity="info">
          Run this in the Supabase SQL Editor (use your logged-in user id below):
          <Box component="pre" sx={{ mt: 1, fontSize: '0.75rem', overflow: 'auto' }}>
            {`-- 1. Apply trigger fix if you haven't yet (see 20250604_fix_super_admin_trigger.sql)
UPDATE profiles SET is_super_admin = true WHERE id = '${user?.id || '<your-user-id>'}';

-- 2. Verify it stuck
SELECT id, display_name, is_super_admin FROM profiles WHERE id = '${user?.id || '<your-user-id>'}';`}
          </Box>
          Then refresh this page. Your user id: <strong>{user?.id}</strong>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <AdminPanelSettings color="primary" />
          <Box>
            <Typography variant="h4">Super Admin Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">
              {profiles.length} users · {matches.length} matches · {conversations.length} conversations · {quizResults.length} quiz results · {personalEvents.length} personal events
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={loadData} aria-label="Refresh data">
          <Refresh />
        </IconButton>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
          <Tab label={`Users (${profiles.length})`} />
          <Tab label={`Matches (${matches.length})`} />
          <Tab label={`Likes (${likes.length})`} />
          <Tab label={`Quiz Results (${quizResults.length})`} />
          <Tab label={`Personal Events (${personalEvents.length})`} />
          <Tab label={`Vendor Events (${vendorEvents.length})`} />
          <Tab label={`Conversations (${conversations.length})`} />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>City / area</TableCell>
                <TableCell>Matches</TableCell>
                <TableCell>Likes sent</TableCell>
                <TableCell>Quizzes</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profiles.map((profile) => (
                <UserRow
                  key={profile.id}
                  profile={profile}
                  email={emails[profile.id]}
                  quizResults={quizResultsByUser[profile.id] || []}
                  matchCount={matchCountByUser[profile.id] || 0}
                  likeCount={likeCountByUser[profile.id] || 0}
                  resolvedLabels={resolvedLabels}
                  resolvingLocations={resolvingLocations}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab === 1 && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>User A</TableCell>
                <TableCell>User B</TableCell>
                <TableCell>Matched at</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match.id} hover>
                  <TableCell>{match.user_a?.display_name || match.user_a_id}</TableCell>
                  <TableCell>{match.user_b?.display_name || match.user_b_id}</TableCell>
                  <TableCell>{formatDate(match.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab === 2 && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Liked at</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {likes.map((like) => (
                <TableRow key={like.id} hover>
                  <TableCell>{like.from_user?.display_name || like.from_user_id}</TableCell>
                  <TableCell>{like.to_user?.display_name || like.to_user_id}</TableCell>
                  <TableCell>{formatDate(like.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab === 3 && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Quiz</TableCell>
                <TableCell>Result</TableCell>
                <TableCell>Completed at</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quizResults.map((result) => {
                const profile = profiles.find((p) => p.id === result.user_id);
                const quiz = getQuizDefinition(result.quiz_id);
                return (
                  <TableRow key={result.id} hover>
                    <TableCell>
                      {profile?.display_name || emails[result.user_id] || result.user_id}
                    </TableCell>
                    <TableCell>{quiz?.title || result.quiz_id}</TableCell>
                    <TableCell>
                      <Chip size="small" label={result.result_label} color="primary" variant="outlined" />
                    </TableCell>
                    <TableCell>{formatDate(result.completed_at)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab === 4 && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Host</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Event location</TableCell>
                <TableCell>Host city</TableCell>
                <TableCell>Event date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Created</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {personalEvents.map((event) => (
                <TableRow key={event.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {event.host?.display_name || event.host_name || 'Unknown'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {emails[event.host_user_id] || event.host_user_id}
                    </Typography>
                  </TableCell>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>
                    <Chip size="small" label={labelForEventType(event.event_type)} variant="outlined" />
                  </TableCell>
                  <TableCell>{event.approximate_location}</TableCell>
                  <TableCell>
                    <ProfileLocationCell
                      profile={event.host}
                      resolvedLabels={resolvedLabels}
                      resolving={resolvingLocations}
                    />
                  </TableCell>
                  <TableCell>{formatDate(event.event_datetime)}</TableCell>
                  <TableCell sx={{ maxWidth: 280 }}>
                    <Typography variant="body2" noWrap title={event.description}>
                      {event.description}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(event.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab === 5 && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Business</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Event</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Event date</TableCell>
                <TableCell>Active window</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendorEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      No vendor applications yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                vendorEvents.map((event) => (
                  <TableRow key={event.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {event.business_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{event.contact_name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {event.contact_email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 220 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {event.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap title={event.description}>
                        {event.description}
                      </Typography>
                    </TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>{formatDate(event.event_starts_at)}</TableCell>
                    <TableCell>
                      {event.active_from && event.active_until
                        ? `${formatDate(event.active_from)} → ${formatDate(event.active_until)}`
                        : event.proposed_active_from && event.proposed_active_until
                          ? `Proposed: ${formatDate(event.proposed_active_from)} → ${formatDate(event.proposed_active_until)}`
                          : '—'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={event.status}
                        color={
                          event.status === 'active'
                            ? 'success'
                            : event.status === 'pending'
                              ? 'warning'
                              : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      {event.status === 'pending' && (
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button size="small" variant="contained" onClick={() => handleApproveVendorEvent(event)}>
                            Approve
                          </Button>
                          <Button size="small" color="error" onClick={() => handleRejectVendorEvent(event.id)}>
                            Reject
                          </Button>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab === 6 && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Match</TableCell>
                <TableCell>Messages</TableCell>
                <TableCell>Started</TableCell>
                <TableCell>Last message</TableCell>
                <TableCell align="right">Transcript</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {conversations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      No conversations yet. They are created when two users match.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                conversations.map((conversation) => (
                  <ConversationRow
                    key={conversation.id}
                    conversation={conversation}
                    emails={emails}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default SuperAdminDashboard;
