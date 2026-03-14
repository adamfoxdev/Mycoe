import { create } from 'zustand';
import type {
  Article,
  Discussion,
  DiscussionReply,
  VoteProposal,
  WinEntry,
  VoteValue,
} from '../types';

const CURRENT_USER = {
  id: 'user-1',
  name: 'Developer',
  email: 'developer@example.com',
};

const seedArticles: Article[] = [
  {
    id: 'a1',
    title: 'Getting Started with the CoE Standards',
    body: 'This article walks through the key standards every developer should know when starting with the Mycoe Centre of Excellence. We cover TypeScript conventions, React patterns, and testing practices.',
    author: { id: 'user-0', name: 'CoE Team', email: 'coe@example.com' },
    category: 'general',
    tags: ['standards', 'getting-started'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
  },
  {
    id: 'a2',
    title: 'React Component Design Patterns',
    body: 'An overview of the recommended component design patterns used across our React applications. Covers compound components, render props, and custom hooks.',
    author: { id: 'user-0', name: 'CoE Team', email: 'coe@example.com' },
    category: 'design-pattern',
    tags: ['react', 'patterns'],
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
  },
];

const seedDiscussions: Discussion[] = [
  {
    id: 'd1',
    title: 'How should we handle API error states?',
    body: 'I have been thinking about a consistent way to surface API errors in the UI. Should we use toast notifications or inline error messages?',
    author: { id: 'user-0', name: 'CoE Team', email: 'coe@example.com' },
    category: 'process',
    replies: [
      {
        id: 'r1',
        body: 'I prefer inline errors for form validation and toasts for background operations.',
        author: { id: 'user-2', name: 'Alice', email: 'alice@example.com' },
        createdAt: '2024-01-16T10:00:00Z',
      },
    ],
    createdAt: '2024-01-15T14:00:00Z',
  },
];

const seedProposals: VoteProposal[] = [
  {
    id: 'v1',
    title: 'Adopt Conventional Commits as our commit message standard',
    description:
      'Proposing we adopt the Conventional Commits specification (https://www.conventionalcommits.org) across all repositories to improve changelog generation and release management.',
    type: 'process',
    author: { id: 'user-0', name: 'CoE Team', email: 'coe@example.com' },
    votes: { 'user-2': 1, 'user-3': 1 },
    createdAt: '2024-01-12T09:00:00Z',
    status: 'open',
  },
  {
    id: 'v2',
    title: 'Use the Repository Pattern for all data-access layers',
    description:
      'Proposing we standardise on the Repository Pattern for all data-access code to improve testability and separation of concerns.',
    type: 'design-pattern',
    author: { id: 'user-0', name: 'CoE Team', email: 'coe@example.com' },
    votes: { 'user-2': 1, 'user-3': -1 },
    createdAt: '2024-01-14T10:00:00Z',
    status: 'open',
  },
];

const seedWins: WinEntry[] = [
  {
    id: 'w1',
    type: 'win',
    title: 'Reduced build times by 40%',
    description:
      'Switched from Webpack to Vite across our three main React apps. Build times dropped from ~90s to ~12s.',
    author: { id: 'user-0', name: 'CoE Team', email: 'coe@example.com' },
    createdAt: '2024-01-18T08:00:00Z',
  },
  {
    id: 'w2',
    type: 'issue',
    title: 'Inconsistent error handling across services',
    description:
      'Several teams are handling errors differently. We need a standard approach for API error responses and client-side error handling.',
    author: { id: 'user-0', name: 'CoE Team', email: 'coe@example.com' },
    createdAt: '2024-01-17T14:00:00Z',
    resolved: false,
  },
];

interface HubState {
  currentUser: typeof CURRENT_USER;
  articles: Article[];
  discussions: Discussion[];
  proposals: VoteProposal[];
  wins: WinEntry[];
  addArticle: (data: Omit<Article, 'id' | 'author' | 'createdAt' | 'updatedAt'>) => void;
  addDiscussion: (data: Omit<Discussion, 'id' | 'author' | 'replies' | 'createdAt'>) => void;
  addReply: (discussionId: string, body: string) => void;
  addProposal: (
    data: Omit<VoteProposal, 'id' | 'author' | 'votes' | 'createdAt' | 'status'>,
  ) => void;
  castVote: (proposalId: string, value: VoteValue) => void;
  addWin: (data: Omit<WinEntry, 'id' | 'author' | 'createdAt'>) => void;
  resolveIssue: (id: string) => void;
}

function uid(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

export const useHubStore = create<HubState>((set, get) => ({
  currentUser: CURRENT_USER,
  articles: seedArticles,
  discussions: seedDiscussions,
  proposals: seedProposals,
  wins: seedWins,

  addArticle(data) {
    const article: Article = {
      ...data,
      id: uid(),
      author: get().currentUser,
      createdAt: now(),
      updatedAt: now(),
    };
    set((s) => ({ articles: [article, ...s.articles] }));
  },

  addDiscussion(data) {
    const discussion: Discussion = {
      ...data,
      id: uid(),
      author: get().currentUser,
      replies: [],
      createdAt: now(),
    };
    set((s) => ({ discussions: [discussion, ...s.discussions] }));
  },

  addReply(discussionId, body) {
    const reply: DiscussionReply = {
      id: uid(),
      body,
      author: get().currentUser,
      createdAt: now(),
    };
    set((s) => ({
      discussions: s.discussions.map((d) =>
        d.id === discussionId ? { ...d, replies: [...d.replies, reply] } : d,
      ),
    }));
  },

  addProposal(data) {
    const proposal: VoteProposal = {
      ...data,
      id: uid(),
      author: get().currentUser,
      votes: {},
      createdAt: now(),
      status: 'open',
    };
    set((s) => ({ proposals: [proposal, ...s.proposals] }));
  },

  castVote(proposalId, value) {
    const userId = get().currentUser.id;
    set((s) => ({
      proposals: s.proposals.map((p) => {
        if (p.id !== proposalId) return p;
        const currentVote = p.votes[userId];
        const updatedVotes = { ...p.votes };
        if (currentVote === value) {
          delete updatedVotes[userId];
        } else {
          updatedVotes[userId] = value;
        }
        return { ...p, votes: updatedVotes };
      }),
    }));
  },

  addWin(data) {
    const entry: WinEntry = {
      ...data,
      id: uid(),
      author: get().currentUser,
      createdAt: now(),
    };
    set((s) => ({ wins: [entry, ...s.wins] }));
  },

  resolveIssue(id) {
    set((s) => ({
      wins: s.wins.map((w) => (w.id === id ? { ...w, resolved: true } : w)),
    }));
  },
}));
