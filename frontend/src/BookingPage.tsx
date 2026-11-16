import { useState } from "react";
import { Text } from "@mantine/core";
import { AvailabilityPicker } from "./AvailabilityPicker";
import type { AvailableSlot } from "./api/types.gen";

export function BookingPage({ meetingTypeId }: { meetingTypeId: string }) {
  const [selection, setSelection] = useState<AvailableSlot | null>(null);
  return (
    <>
      <AvailabilityPicker meetingTypeId={meetingTypeId} onSelectionChange={setSelection} />
      {selection && (
        <Text mt="md" role="status">
          Время выбрано. Запись с именем и email появится на следующем этапе.
        </Text>
      )}
    </>
  );
}
