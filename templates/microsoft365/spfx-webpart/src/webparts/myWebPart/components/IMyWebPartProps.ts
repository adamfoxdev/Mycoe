import { MSGraphClientV3 } from '@microsoft/sp-http';

export interface IMyWebPartProps {
  description: string;
  graphClient: MSGraphClientV3 | undefined;
}
