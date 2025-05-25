export type RowLayout = 'single' | 'double';

export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  collapsible?: boolean;
  initiallyExpanded?: boolean;
  titleClassName?: string;
  contentClassName?: string;
}

export interface Row {
  id: string;
  layout: RowLayout;
  articleIds: string[];
  className?: string; // Added for specific row styling
}