import { useCurrentRecordGroupId } from '@/object-record/record-group/hooks/useCurrentRecordGroupId';
import { RecordTableRow } from '@/object-record/record-table/record-table-row/components/RecordTableRow';
import { isRecordGroupTableSectionToggledComponentState } from '@/object-record/record-table/record-table-section/states/isRecordGroupTableSectionToggledComponentState';
import { tableAllRowIdsComponentState } from '@/object-record/record-table/states/tableAllRowIdsComponentState';
import { tableRowIdsByGroupComponentFamilyState } from '@/object-record/record-table/states/tableRowIdsByGroupComponentFamilyState';
import { useRecoilComponentFamilyValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentFamilyValueV2';
import { useRecoilComponentValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValueV2';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import { isDefined } from '~/utils/isDefined';

const MotionRecordTableRow = motion(RecordTableRow);

export const RecordTableRecordGroupRows = () => {
  const currentRecordGroupId = useCurrentRecordGroupId();

  const allRowIds = useRecoilComponentValueV2(tableAllRowIdsComponentState);

  const recordGroupRowIds = useRecoilComponentFamilyValueV2(
    tableRowIdsByGroupComponentFamilyState,
    currentRecordGroupId,
  );

  const isRecordGroupTableSectionToggled = useRecoilComponentFamilyValueV2(
    isRecordGroupTableSectionToggledComponentState,
    currentRecordGroupId,
  );

  const rowIndexMap = useMemo(
    () => new Map(allRowIds.map((id, index) => [id, index])),
    [allRowIds],
  );

  // TODO: Animation is not working, find a way to make it works
  const variants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: 'auto', opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isRecordGroupTableSectionToggled &&
        recordGroupRowIds.map((recordId) => {
          const rowIndex = rowIndexMap.get(recordId);

          if (!isDefined(rowIndex)) {
            return null;
          }

          return (
            <MotionRecordTableRow
              key={recordId}
              recordId={recordId}
              rowIndex={rowIndex}
              isPendingRow={!isRecordGroupTableSectionToggled}
              variants={variants}
            />
          );
        })}
    </AnimatePresence>
  );
};
