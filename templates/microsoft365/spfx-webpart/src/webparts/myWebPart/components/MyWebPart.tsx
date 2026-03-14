import * as React from 'react';
import { Text } from '@fluentui/react/lib/Text';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { IMyWebPartProps } from './IMyWebPartProps';

interface IMyWebPartState {
  displayName: string;
  isLoading: boolean;
  error: string | undefined;
}

export default class MyWebPart extends React.Component<IMyWebPartProps, IMyWebPartState> {

  constructor(props: IMyWebPartProps) {
    super(props);
    this.state = {
      displayName: '',
      isLoading: true,
      error: undefined
    };
  }

  public async componentDidMount(): Promise<void> {
    if (!this.props.graphClient) {
      this.setState({ isLoading: false, error: 'Graph client is not available.' });
      return;
    }

    try {
      // Example: read the signed-in user's display name via Graph (scope: User.Read)
      const user = await this.props.graphClient
        .api('/me')
        .select('displayName')
        .get();

      this.setState({ displayName: user.displayName, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.setState({ isLoading: false, error: `Failed to load user: ${message}` });
    }
  }

  public render(): React.ReactElement<IMyWebPartProps> {
    const { description } = this.props;
    const { displayName, isLoading, error } = this.state;

    if (isLoading) {
      return <Spinner size={SpinnerSize.large} label="Loading…" />;
    }

    if (error) {
      return (
        <MessageBar messageBarType={MessageBarType.error}>
          {error}
        </MessageBar>
      );
    }

    return (
      <section>
        <Text variant="xLarge">{description}</Text>
        <Text variant="large">Hello, {displayName}!</Text>
      </section>
    );
  }
}
