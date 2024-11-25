import { RecordGroupContext } from '@/object-record/record-group/states/context/RecordGroupContext';
import { visibleRecordGroupIdsComponentSelector } from '@/object-record/record-group/states/selectors/visibleRecordGroupIdsComponentSelector';
import { RecordTableRecordGroupRows } from '@/object-record/record-table/components/RecordTableRecordGroupRows';
import { RecordTableBodyDroppable } from '@/object-record/record-table/record-table-body/components/RecordTableBodyDroppable';
import { RecordTableBodyLoading } from '@/object-record/record-table/record-table-body/components/RecordTableBodyLoading';
import { RecordTableBodyRecordGroupDragDropContext } from '@/object-record/record-table/record-table-body/components/RecordTableBodyRecordGroupDragDropContext';
import { RecordTablePendingRow } from '@/object-record/record-table/record-table-row/components/RecordTablePendingRow';
import { RecordTableRecordGroupSection } from '@/object-record/record-table/record-table-section/components/RecordTableRecordGroupSection';
import { isRecordTableInitialLoadingComponentState } from '@/object-record/record-table/states/isRecordTableInitialLoadingComponentState';
import { tableAllRowIdsComponentState } from '@/object-record/record-table/states/tableAllRowIdsComponentState';
import { useRecoilComponentValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValueV2';

export const RecordTableRecordGroupsBody = () => {
  const tableAllRowIds = useRecoilComponentValueV2(
    tableAllRowIdsComponentState,
  );

  const isRecordTableInitialLoading = useRecoilComponentValueV2(
    isRecordTableInitialLoadingComponentState,
  );

  const visibleRecordGroupIds = useRecoilComponentValueV2(
    visibleRecordGroupIdsComponentSelector,
  );

  if (isRecordTableInitialLoading && tableAllRowIds.length === 0) {
    return <RecordTableBodyLoading />;
  }

  return (
    <RecordTableBodyRecordGroupDragDropContext>
      {/** */}
      <RecordTableBodyDroppable isDropDisabled>
        <RecordTablePendingRow />
      </RecordTableBodyDroppable>
      {visibleRecordGroupIds.map((recordGroupId) => (
        <RecordGroupContext.Provider
          key={recordGroupId}
          value={{ recordGroupId }}
        >
          <RecordTableBodyDroppable recordGroupId={recordGroupId}>
            <RecordTableRecordGroupSection />
            <RecordTableRecordGroupRows />
          </RecordTableBodyDroppable>
        </RecordGroupContext.Provider>
      ))}
    </RecordTableBodyRecordGroupDragDropContext>
  );
};
