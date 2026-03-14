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

export function ArticleForm(): JSX.Element {
  const addArticle = useHubStore((s) => s.addArticle);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<Category>('general');
  const [tags, setTags] = useState('');

  function handleSubmit(): void {
    if (!title.trim() || !body.trim()) return;
    addArticle({
      title: title.trim(),
      body: body.trim(),
      category,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setTitle('');
    setBody('');
    setCategory('general');
    setTags('');
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(_, d) => setOpen(d.open)}>
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="primary">Post Article</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogTitle>Post a New Article</DialogTitle>
        <DialogBody>
          <Field label="Title" required style={{ marginBottom: '1rem' }}>
            <Input
              value={title}
              onChange={(_, d) => setTitle(d.value)}
              placeholder="Article title"
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
          <Field label="Body" required style={{ marginBottom: '1rem' }}>
            <Textarea
              value={body}
              onChange={(_, d) => setBody(d.value)}
              placeholder="Write your article here…"
              rows={6}
            />
          </Field>
          <Field label="Tags (comma-separated)" style={{ marginBottom: '1rem' }}>
            <Input
              value={tags}
              onChange={(_, d) => setTags(d.value)}
              placeholder="react, patterns, …"
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
