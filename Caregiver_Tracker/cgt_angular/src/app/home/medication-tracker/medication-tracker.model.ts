export interface trackedMedicationData {
    id: string;
    medicineName: string;
    medicineForm: string;
    medicineQuantity: number;
    medicationDate: string;
    medicationTime: string;
}

export interface medicationData {
    _id: object;
    medicine_name: string;
    medicine_form: string;
    medicine_quantity: number;
    medication_time: string;
}

export type MedicationGroupedBydate = Record<string, (trackedMedicationData)[]>;