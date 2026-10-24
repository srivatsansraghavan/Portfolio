import { z } from 'zod';
const careTakenofSchema = z.object({
    name: z.string().describe('Care Taken of Name'),
    id: z.string().describe('Care Taken of Id'),
});
export const feedSchema = z.object({
    feedTaker: careTakenofSchema,
    feedType: z.string().describe('Feed type'),
    feedMode: z.string().describe('Feed mode'),
    feedSide: z.string().describe('Feed side'),
    feedQuantity: z.coerce.number().describe('Feed quantity'),
    feedTime: z.coerce.number().describe('Feed time'),
    pumpedFeedId: z.string().describe('Pumped Feed id'),
});
export const updateFeedSchema = z.object({
    feedId: z.string().describe('Feed Id'),
    feedQuantity: z.coerce.number().describe('Feed Quantity'),
    feedStart: z.string().describe('Feed Start time'),
    feedEnd: z.string().describe('Feed End time'),
});
export const medicationSchema = z.object({
    careTakenOf: careTakenofSchema,
    medicineQuantity: z.string(),
    medicineId: z.string(),
});
//# sourceMappingURL=requests.dto.js.map