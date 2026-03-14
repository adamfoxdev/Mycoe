import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { MSGraphClientV3 } from '@microsoft/sp-http';

import * as strings from 'MyWebPartWebPartStrings';
import MyWebPart from './components/MyWebPart';
import { IMyWebPartProps } from './components/IMyWebPartProps';

export interface IMyWebPartWebPartProps {
  description: string;
}

export default class MyWebPartWebPart extends BaseClientSideWebPart<IMyWebPartWebPartProps> {

  private _graphClient: MSGraphClientV3 | undefined;

  public async onInit(): Promise<void> {
    await super.onInit();
    // Obtain a Graph client once — reuse it in the component via props
    this._graphClient = await this.context.msGraphClientFactory.getClient('3');
  }

  public render(): void {
    const element: React.ReactElement<IMyWebPartProps> = React.createElement(
      MyWebPart,
      {
        description: this.properties.description,
        graphClient: this._graphClient
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
