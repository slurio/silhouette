export interface TrendItem {
  id: string;
  title: string;
  query: string;
  score: number;
  heat: number;
  lastDate: string | null;
  link: string;
  clusterId: number;
  clusterLabel: string;
}

export interface RegionTrends {
  code: string;
  label: string;
  searches: TrendItem[];
}

export interface TrendsResponse {
  updatedAt: string;
  regions: RegionTrends[];
}
