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
import type { WinType } from '../../types';

export function WinForm(): JSX.Element {
  const addWin = useHubStore((s) => s.addWin);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<WinType>('win');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function handleSubmit(): void {
    if (!title.trim() || !description.trim()) return;
    addWin({ type, title: title.trim(), description: description.trim() });
    setType('win');
    setTitle('');
    setDescription('');
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(_, d) => setOpen(d.open)}>
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="primary">Share Win / Issue</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogTitle>Share a Win or Issue</DialogTitle>
        <DialogBody>
          <Field label="Type" style={{ marginBottom: '1rem' }}>
            <Select value={type} onChange={(_, d) => setType(d.value as WinType)}>
              <option value="win">🎉 Win</option>
              <option value="issue">⚠️ Issue</option>
            </Select>
          </Field>
          <Field label="Title" required style={{ marginBottom: '1rem' }}>
            <Input
              value={title}
              onChange={(_, d) => setTitle(d.value)}
              placeholder="What happened?"
            />
          </Field>
          <Field label="Description" required style={{ marginBottom: '1rem' }}>
            <Textarea
              value={description}
              onChange={(_, d) => setDescription(d.value)}
              placeholder="Describe the win or issue in detail…"
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
            disabled={!title.trim() || !description.trim()}
          >
            Share
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}
