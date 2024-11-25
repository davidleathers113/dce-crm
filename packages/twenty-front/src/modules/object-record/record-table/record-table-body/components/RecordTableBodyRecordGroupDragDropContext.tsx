import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { ReactNode, useContext } from 'react';
import { useRecoilCallback, useSetRecoilState } from 'recoil';

import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { recordGroupDefinitionsComponentState } from '@/object-record/record-group/states/recordGroupDefinitionsComponentState';
import { RecordTableContext } from '@/object-record/record-table/contexts/RecordTableContext';
import { useComputeNewRowPosition } from '@/object-record/record-table/hooks/useComputeNewRowPosition';
import { isRemoveSortingModalOpenState } from '@/object-record/record-table/states/isRemoveSortingModalOpenState';
import { tableAllRowIdsComponentState } from '@/object-record/record-table/states/tableAllRowIdsComponentState';
import { useRecoilComponentCallbackStateV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentCallbackStateV2';
import { getSnapshotValue } from '@/ui/utilities/state/utils/getSnapshotValue';
import { useGetCurrentView } from '@/views/hooks/useGetCurrentView';
import { isDefined } from '~/utils/isDefined';

export const RecordTableBodyRecordGroupDragDropContext = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { objectNameSingular, recordTableId, objectMetadataItem } =
    useContext(RecordTableContext);

  const { updateOneRecord: updateOneRow } = useUpdateOneRecord({
    objectNameSingular,
  });

  const tableAllRowIdsState = useRecoilComponentCallbackStateV2(
    tableAllRowIdsComponentState,
  );

  const recordGroupDefinitionsState = useRecoilComponentCallbackStateV2(
    recordGroupDefinitionsComponentState,
  );

  const { currentViewWithCombinedFiltersAndSorts } =
    useGetCurrentView(recordTableId);

  const viewSorts = currentViewWithCombinedFiltersAndSorts?.viewSorts || [];

  const setIsRemoveSortingModalOpenState = useSetRecoilState(
    isRemoveSortingModalOpenState,
  );

  const computeNewRowPosition = useComputeNewRowPosition();

  const handleDragEnd = useRecoilCallback(
    ({ snapshot }) =>
      (result: DropResult) => {
        const recordGroupDefinitions = getSnapshotValue(
          snapshot,
          recordGroupDefinitionsState,
        );
        const tableAllRowIds = getSnapshotValue(snapshot, tableAllRowIdsState);

        const recordGroupId = result.destination?.droppableId;

        if (!isDefined(recordGroupId)) {
          throw new Error('Record group id is not defined');
        }

        const recordGroup = recordGroupDefinitions.find(
          (definition) => definition.id === recordGroupId,
        );

        if (!isDefined(recordGroup)) {
          throw new Error('Record group is not defined');
        }

        const fieldMetadata = objectMetadataItem.fields.find(
          (field) => field.id === recordGroup.fieldMetadataId,
        );

        if (!isDefined(fieldMetadata)) {
          throw new Error('Field metadata is not defined');
        }

        if (viewSorts.length > 0) {
          setIsRemoveSortingModalOpenState(true);
          return;
        }

        console.log('DRAP - DROP: ', result, recordGroup);

        const computeResult = computeNewRowPosition(result, tableAllRowIds);

        if (!isDefined(computeResult)) {
          return;
        }

        updateOneRow({
          idToUpdate: computeResult.draggedRecordId,
          updateOneRecordInput: {
            position: computeResult.newPosition,
            [fieldMetadata.name]: recordGroup.value,
          },
        });
      },
    [
      objectMetadataItem,
      computeNewRowPosition,
      recordGroupDefinitionsState,
      setIsRemoveSortingModalOpenState,
      tableAllRowIdsState,
      updateOneRow,
      viewSorts.length,
    ],
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>{children}</DragDropContext>
  );
};
