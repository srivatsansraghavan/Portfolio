import { z } from 'zod';
export declare const feedSchema: z.ZodObject<{
    feedTaker: z.ZodObject<{
        name: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>;
    feedType: z.ZodString;
    feedMode: z.ZodString;
    feedSide: z.ZodString;
    feedQuantity: z.ZodCoercedNumber<unknown>;
    feedTime: z.ZodCoercedNumber<unknown>;
    pumpedFeedId: z.ZodString;
}, z.core.$strip>;
export type IFeedBody = z.infer<typeof feedSchema>;
export declare const updateFeedSchema: z.ZodObject<{
    feedId: z.ZodString;
    feedQuantity: z.ZodCoercedNumber<unknown>;
    feedStart: z.ZodString;
    feedEnd: z.ZodString;
}, z.core.$strip>;
export type IUpdateFeedBody = z.infer<typeof updateFeedSchema>;
export declare const medicationSchema: z.ZodObject<{
    careTakenOf: z.ZodObject<{
        name: z.ZodString;
        id: z.ZodString;
    }, z.core.$strip>;
    medicineQuantity: z.ZodString;
    medicineId: z.ZodString;
}, z.core.$strip>;
export type IMedicationBody = z.infer<typeof medicationSchema>;
//# sourceMappingURL=requests.dto.d.ts.map