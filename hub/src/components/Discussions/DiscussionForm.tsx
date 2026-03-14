import { useState } from 'react';
import {
  Button,
  Field,
  Input,
  Textarea,
  Select,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  Dialog,
} from '@fluentui/react-components';
import { useHubStore } from '../../store/hubStore';
import type { Category } from '../../types';

export function DiscussionForm(): JSX.Element {
  const addDiscussion = useHubStore((s) => s.addDiscussion);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<Category>('general');

  function handleSubmit(): void {
    if (!title.trim() || !body.trim()) return;
    addDiscussion({ title: title.trim(), body: body.trim(), category });
    setTitle('');
    setBody('');
    setCategory('general');
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(_, d) => setOpen(d.open)}>
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="primary">Start Discussion</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogTitle>Start a New Discussion</DialogTitle>
        <DialogBody>
          <Field label="Title" required style={{ marginBottom: '1rem' }}>
            <Input
              value={title}
              onChange={(_, d) => setTitle(d.value)}
              placeholder="Discussion topic"
            />
          </Field>
          <Field label="Category" style={{ marginBottom: '1rem' }}>
            <Select value={category} onChange={(_, d) => setCategory(d.value as Category)}>
              <option value="general">General</option>
              <option value="process">Process</option>
              <option value="design-pattern">Design Pattern</option>
              <option value="tooling">Tooling</option>
            </Select>
          </Field>
          <Field label="Description" required style={{ marginBottom: '1rem' }}>
            <Textarea
              value={body}
              onChange={(_, d) => setBody(d.value)}
              placeholder="Describe what you want to discuss…"
              rows={5}
            />
          </Field>
        </DialogBody>
        <DialogActions>
          <DialogTrigger disableButtonEnhancement>
            <Button appearance="secondary">Cancel</Button>
          </DialogTrigger>
          <Button
            appearance="primary"
            onClick={handleSubmit}
            disabled={!title.trim() || !body.trim()}
          >
            Post
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}
