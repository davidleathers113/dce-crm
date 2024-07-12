import { AnalyticsQuery } from '@/activities/reports/types/AnalyticsQuery';

export interface Chart {
  id: string;
  title: string;
  description: string;
  analyticsQueries: AnalyticsQuery[];
  __typename: string;
}