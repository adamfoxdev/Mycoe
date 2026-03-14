declare interface IMyWebPartWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'MyWebPartWebPartStrings' {
  const strings: IMyWebPartWebPartStrings;
  export = strings;
}
