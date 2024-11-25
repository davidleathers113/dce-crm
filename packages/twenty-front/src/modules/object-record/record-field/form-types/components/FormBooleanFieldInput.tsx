import { FormFieldInputBase } from '@/object-record/record-field/form-types/components/FormFieldInputBase';
import { BooleanInput } from '@/ui/field/input/components/BooleanInput';
import styled from '@emotion/styled';
import { useState } from 'react';

const StyledBooleanInputContainer = styled.div`
  padding-inline: ${({ theme }) => theme.spacing(2)};
`;

type FormBooleanFieldInputProps = {
  label?: string;
  defaultValue: boolean | string | undefined;
  onPersist: (value: boolean | null | string) => void;
  readonly?: boolean;
};

export const FormBooleanFieldInput = ({
  label,
  defaultValue,
  onPersist,
  readonly,
}: FormBooleanFieldInputProps) => {
  const [draftValue, setDraftValue] = useState(defaultValue ?? false);

  const handleChange = (newValue: boolean) => {
    setDraftValue(newValue);

    onPersist(newValue);
  };

  return (
    <FormFieldInputBase
      label={label}
      Input={
        <StyledBooleanInputContainer>
          <BooleanInput
            value={draftValue as boolean}
            readonly={readonly}
            onToggle={(newValue) => {
              handleChange(newValue);
            }}
          />
        </StyledBooleanInputContainer>
      }
    />
  );
};