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

export function VoteForm(): JSX.Element {
  const addProposal = useHubStore((s) => s.addProposal);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'process' | 'design-pattern'>('process');

  function handleSubmit(): void {
    if (!title.trim() || !description.trim()) return;
    addProposal({ title: title.trim(), description: description.trim(), type });
    setTitle('');
    setDescription('');
    setType('process');
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(_, d) => setOpen(d.open)}>
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="primary">New Proposal</Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogTitle>Submit a New Proposal</DialogTitle>
        <DialogBody>
          <Field label="Title" required style={{ marginBottom: '1rem' }}>
            <Input
              value={title}
              onChange={(_, d) => setTitle(d.value)}
              placeholder="Proposal title"
            />
          </Field>
          <Field label="Type" style={{ marginBottom: '1rem' }}>
            <Select
              value={type}
              onChange={(_, d) => setType(d.value as 'process' | 'design-pattern')}
            >
              <option value="process">Process</option>
              <option value="design-pattern">Design Pattern</option>
            </Select>
          </Field>
          <Field label="Description" required style={{ marginBottom: '1rem' }}>
            <Textarea
              value={description}
              onChange={(_, d) => setDescription(d.value)}
              placeholder="Describe the proposal and why it should be adopted…"
              rows={6}
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
            Submit
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}
