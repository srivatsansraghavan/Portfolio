export interface PumpedGrouped {
  id: string;
  pumpedMode: string;
  pumpedSide: string;
  pumpedQuantity: number;
  pumpedStartDate: string;
  pumpedStartTime: string;
  pumpedEndDate: string;
  pumpedEndTime: string;
  pumpedTimeTaken: string;
}

export type PumpedGroupedByDate = Record<string, PumpedGrouped[]>;