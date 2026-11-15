import { CareTakenTypes, DiaperTypes, ExcretionTypes, FeedModes, FeedSides, FeedTypes, PumpModes, PumpSides } from "./enums";

export const TOTAL_FEED_TYPES = {
    [CareTakenTypes.Infant]: [
        FeedTypes.BreastMilk,
        FeedTypes.FormulaFeeding,
        FeedTypes.MashedFood,
        FeedTypes.Juices,
        FeedTypes.Water,
        FeedTypes.Drips,
    ],
    [CareTakenTypes.Toddler]: [
        FeedTypes.BreastMilk,
        FeedTypes.FormulaFeeding,
        FeedTypes.NormalFood,
        FeedTypes.MashedFood,
        FeedTypes.Juices,
        FeedTypes.Water,
        FeedTypes.Drips,
    ],
    [CareTakenTypes.Child]: [
        FeedTypes.FormulaFeeding,
        FeedTypes.NormalFood,
        FeedTypes.MashedFood,
        FeedTypes.Juices,
        FeedTypes.Water,
        FeedTypes.Drips,
    ],
    [CareTakenTypes.Spouse]: [FeedTypes.NormalFood, FeedTypes.MashedFood, FeedTypes.Juices, FeedTypes.Water, FeedTypes.Drips],
    [CareTakenTypes.Parent]: [FeedTypes.NormalFood, FeedTypes.MashedFood, FeedTypes.Juices, FeedTypes.Water, FeedTypes.Drips],
    [CareTakenTypes.Friend]: [FeedTypes.NormalFood, FeedTypes.MashedFood, FeedTypes.Juices, FeedTypes.Water, FeedTypes.Drips],
};
export const PUMP_MODE = [PumpModes.ManualPump, PumpModes.ElectricalPump];
export const TOTAL_FEED_MODES = {
    [FeedTypes.BreastMilk]: [FeedModes.PumpedMilk, FeedModes.DirectFeed],
    [FeedTypes.FormulaFeeding]: [FeedModes.FeedingBottle, FeedModes.Spoon, FeedModes.Other],
    [FeedTypes.NormalFood]: [FeedModes.SelfFeeding, FeedModes.OthersFeeding],
    [FeedTypes.MashedFood]: [FeedModes.SelfFeeding, FeedModes.OthersFeeding],
    [FeedTypes.Juices]: [FeedModes.FeedingBottle, FeedModes.Spoon, FeedModes.Glass],
    [FeedTypes.Water]: [FeedModes.FeedingBottle, FeedModes.Spoon, FeedModes.Glass],
    [FeedTypes.Drips]: [],
};
export const PUMP_SIDES = [PumpSides.LeftBreast, PumpSides.RightBreast, PumpSides.Both]
export const TOTAL_FEED_SIDES = {
    [FeedTypes.BreastMilk]: [FeedSides.LeftBreast, FeedSides.RightBreast, FeedSides.Both],
};

export const EXCRETION_TYPES = [ExcretionTypes.Urine, ExcretionTypes.Stools, ExcretionTypes.UrineAndStools];
export const NAPKIN_TYPES = [DiaperTypes.Diaper, DiaperTypes.Others];
export const DIAPER_BRANDS = ['ABC', 'DEF', 'GHI', 'JKL'];
export const CARE_TAKEN_ROLES = [
    'infant',
    'toddler',
    'child',
    'spouse',
    'parent',
    'friend',
  ];