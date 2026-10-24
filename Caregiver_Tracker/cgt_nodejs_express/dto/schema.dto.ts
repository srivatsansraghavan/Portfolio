export interface IUserSchema {
    user_email: string;
    user_fullname: string;
    user_signup_time: string;
    username: string;
}

export interface ICareTaken {
  care_giver: string;
  care_taken_of: string;
  care_taken_name: string;
  care_taken_dob: string;
  care_taken_gender: string;
  care_taken_added_time: string;
  care_last_accessed: boolean;
}

export interface IFeedSchema {
  feed_giver: string;
  feed_taker_name: string;
  feed_taker_id: string;
  feed_taken_type: string;
  feed_taken_mode: string;
  feed_taken_side: string;
  feed_taken_time: number;
  feed_quantity: number;
  feed_start_time: string;
  feed_end_time: string;
  is_pumped_feed: boolean;
  is_feed_given: boolean;
}

export interface IPumpedSchema {
  pumped_by: string;
  pumped_for_name: string;
  pumped_for_id: string;
  pumped_mode: string;
  pumped_side: string;
  pumped_time: number;
  pumped_quantity: number;
  pump_start_time: string;
  pump_end_time: string;
}

export interface IExcSchema {
  care_giver: string;
  care_taken_of_name: string;
  care_taken_of_id: string;
  excretion_type: string;
  napkin_type: string;
  diaper_count: number;
  diaper_brand: string;
  excretion_time: Date;
}

export interface IMedicationSchema {
  care_giver: string;
  care_taken_of_name: string;
  care_taken_of_id: string;
  medicine_name: string;
  medicine_form: string;
  medicine_quantity: string;
  medicine_id: string;
  medication_time: string;
}

export interface IInventorySchema {
  care_giver: string;
  care_taken_of_name: string;
  care_taken_of_id: string;
  inventory_type: string;
  inventory_brand: string;
  inventory_form: string;
  inventory_total: number;
  inventory_used: number;
  added_time: string;
}