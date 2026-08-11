export interface Task {
  id: string;
  label: string;
  /** Weeks before the move this belongs to. 0 is moving week. */
  stage: number;
  custom?: boolean;
}

export interface Stage {
  weeks: number;
  title: string;
  description: string;
}

export const STAGES: Stage[] = [
  { weeks: 8, title: "8 weeks out", description: "Decisions that get more expensive the longer you leave them." },
  { weeks: 6, title: "6 weeks out", description: "Book things while there is still choice." },
  { weeks: 4, title: "4 weeks out", description: "Paperwork and the first real packing." },
  { weeks: 2, title: "2 weeks out", description: "Utilities, addresses and the last errands." },
  { weeks: 1, title: "Final week", description: "Pack the house, keep out what you need." },
  { weeks: 0, title: "Moving day", description: "The day itself." },
  { weeks: -1, title: "After the move", description: "The fortnight that follows." },
];

/**
 * The default checklist.
 *
 * Ordered by when each thing has to happen rather than by category, because the
 * failure mode when moving is not forgetting a task — it is doing it too late
 * to matter. Cancelling broadband a week out is fine; booking a mover a week
 * out is not.
 */
export const DEFAULT_TASKS: Omit<Task, "id">[] = [
  { stage: 8, label: "Set a moving budget and decide movers vs. doing it yourself" },
  { stage: 8, label: "Get three quotes from moving companies" },
  { stage: 8, label: "Book time off work for the move" },
  { stage: 8, label: "Start decluttering — sell, donate or bin anything not worth moving" },
  { stage: 8, label: "Check the new place's access: lift, stairs, parking, van restrictions" },

  { stage: 6, label: "Book the mover or hire van, in writing" },
  { stage: 6, label: "Order packing boxes, tape, bubble wrap and marker pens" },
  { stage: 6, label: "Arrange childcare or a pet sitter for moving day" },
  { stage: 6, label: "Book a cleaner for the old place if your lease requires one" },
  { stage: 6, label: "Photograph anything valuable before it is packed" },

  { stage: 4, label: "Give notice to your landlord or confirm the completion date" },
  { stage: 4, label: "Arrange mail redirection with the postal service" },
  { stage: 4, label: "Start packing rooms you barely use" },
  { stage: 4, label: "Label every box by room and contents, not just \"kitchen\"" },
  { stage: 4, label: "Check contents insurance covers the move" },
  { stage: 4, label: "Register children at the new school" },

  { stage: 2, label: "Notify electricity, gas and water — closing and opening reads" },
  { stage: 2, label: "Book broadband installation at the new address" },
  { stage: 2, label: "Update address: bank, employer, doctor, dentist, insurance, licence" },
  { stage: 2, label: "Cancel or transfer local subscriptions — gym, deliveries, papers" },
  { stage: 2, label: "Run down the freezer and store cupboard" },
  { stage: 2, label: "Confirm the moving date and time with the mover" },

  { stage: 1, label: "Pack everything except the essentials box" },
  { stage: 1, label: "Pack an essentials box: kettle, mugs, toilet roll, chargers, tools, medicines" },
  { stage: 1, label: "Defrost the freezer" },
  { stage: 1, label: "Confirm parking for the van at both ends" },
  { stage: 1, label: "Withdraw cash for tips and unexpected costs" },
  { stage: 1, label: "Charge every device and power bank" },

  { stage: 0, label: "Take final meter readings and photograph them" },
  { stage: 0, label: "Walk every room and cupboard before the van leaves" },
  { stage: 0, label: "Keep passports, documents and valuables with you, not in the van" },
  { stage: 0, label: "Hand over keys and get a receipt" },
  { stage: 0, label: "Check the inventory as boxes come off the van" },

  { stage: -1, label: "Take opening meter readings at the new place" },
  { stage: -1, label: "Test smoke and carbon monoxide alarms" },
  { stage: -1, label: "Find the stopcock, fuse box and thermostat" },
  { stage: -1, label: "Register with a local doctor and dentist" },
  { stage: -1, label: "Update your address on the electoral roll" },
  { stage: -1, label: "Report any damage to the mover within their claim window" },
];

/** The date a stage's tasks should be done by, given the moving date. */
export function stageDate(movingDate: string, weeks: number): Date | null {
  const moving = new Date(`${movingDate}T12:00:00`);
  if (Number.isNaN(moving.getTime())) return null;

  const result = new Date(moving);
  result.setDate(result.getDate() - weeks * 7);
  return result;
}
