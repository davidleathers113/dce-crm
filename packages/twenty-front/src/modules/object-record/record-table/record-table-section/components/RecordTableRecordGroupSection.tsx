import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useCallback } from 'react';
import { IconChevronUp, Tag } from 'twenty-ui';

import { useCurrentRecordGroupId } from '@/object-record/record-group/hooks/useCurrentRecordGroupId';
import { recordGroupDefinitionComponentFamilySelector } from '@/object-record/record-group/states/selectors/recordGroupDefinitionComponentFamilySelector';
import { RecordGroupDefinitionType } from '@/object-record/record-group/types/RecordGroupDefinition';
import { isRecordGroupTableSectionToggledComponentState } from '@/object-record/record-table/record-table-section/states/isRecordGroupTableSectionToggledComponentState';
import { numberOfTableRowIdsByGroupComponentFamilySelector } from '@/object-record/record-table/states/selectors/numberOfTableRowIdsByGroupComponentFamilySelector';
import { numberOfvisibleTableColumnsComponentSelector } from '@/object-record/record-table/states/selectors/numberOfVisibleTableColumnComponentSelector';
import { useRecoilComponentFamilyStateV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentFamilyStateV2';
import { useRecoilComponentFamilyValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentFamilyValueV2';
import { useRecoilComponentValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValueV2';

const StyledContainer = styled.tr`
  cursor: pointer;
`;

const StyledChevronContainer = styled.td`
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  color: ${({ theme }) => theme.font.color.secondary};
  text-align: center;
  vertical-align: middle;
`;

const StyledTotalRow = styled.span`
  color: ${({ theme }) => theme.font.color.tertiary};
  margin-left: ${({ theme }) => theme.spacing(2)};
  text-align: center;
  vertical-align: middle;
`;

const StyledRecordGroupSection = styled.td`
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
  padding-bottom: 6px;
  padding-top: 6px;
`;

const StyledEmptyTd = styled.td`
  border-bottom: 1px solid ${({ theme }) => theme.border.color.light};
`;

export const RecordTableRecordGroupSection = () => {
  const theme = useTheme();

  const currentRecordGroupId = useCurrentRecordGroupId();

  const numberOfVisibleColumns = useRecoilComponentValueV2(
    numberOfvisibleTableColumnsComponentSelector,
  );

  const numberOfRows = useRecoilComponentFamilyValueV2(
    numberOfTableRowIdsByGroupComponentFamilySelector,
    currentRecordGroupId,
  );

  const [
    isRecordGroupTableSectionToggled,
    setIsRecordGroupTableSectionToggled,
  ] = useRecoilComponentFamilyStateV2(
    isRecordGroupTableSectionToggledComponentState,
    currentRecordGroupId,
  );

  const recordGroup = useRecoilComponentFamilyValueV2(
    recordGroupDefinitionComponentFamilySelector,
    currentRecordGroupId,
  );

  const handleDropdownToggle = useCallback(() => {
    setIsRecordGroupTableSectionToggled((prevState) => !prevState);
  }, [setIsRecordGroupTableSectionToggled]);

  return (
    <StyledContainer onClick={handleDropdownToggle}>
      <td></td>
      <StyledChevronContainer>
        <motion.span
          animate={{ rotate: isRecordGroupTableSectionToggled ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            display: 'inline-block',
          }}
        >
          <IconChevronUp size={theme.icon.size.md} />
        </motion.span>
      </StyledChevronContainer>
      <StyledRecordGroupSection colSpan={numberOfVisibleColumns}>
        <Tag
          variant={
            recordGroup.type !== RecordGroupDefinitionType.NoValue
              ? 'solid'
              : 'outline'
          }
          color={
            recordGroup.type !== RecordGroupDefinitionType.NoValue
              ? recordGroup.color
              : 'transparent'
          }
          text={recordGroup.title}
          weight="medium"
        />
        <StyledTotalRow>{numberOfRows}</StyledTotalRow>
      </StyledRecordGroupSection>
      <StyledEmptyTd></StyledEmptyTd>
      <StyledEmptyTd></StyledEmptyTd>
    </StyledContainer>
  );
};
