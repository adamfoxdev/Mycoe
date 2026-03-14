export type Category = 'process' | 'design-pattern' | 'tooling' | 'general';
export type WinType = 'win' | 'issue';
export type VoteValue = 1 | -1;

export interface Author {
  id: string;
  name: string;
  email: string;
}

export interface Article {
  id: string;
  title: string;
  body: string;
  author: Author;
  category: Category;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DiscussionReply {
  id: string;
  body: string;
  author: Author;
  createdAt: string;
}

export interface Discussion {
  id: string;
  title: string;
  body: string;
  author: Author;
  category: Category;
  replies: DiscussionReply[];
  createdAt: string;
}

export interface VoteProposal {
  id: string;
  title: string;
  description: string;
  type: 'process' | 'design-pattern';
  author: Author;
  votes: Record<string, VoteValue>;
  createdAt: string;
  status: 'open' | 'closed';
}

export interface WinEntry {
  id: string;
  type: WinType;
  title: string;
  description: string;
  author: Author;
  createdAt: string;
  resolved?: boolean;
}
