import * as TypeGraphQL from '@nestjs/graphql';
import * as GraphQLScalars from 'graphql-scalars';
import { Prisma } from '@prisma/client';
import { DecimalJSScalar } from '../../scalars';
import { CompanyUpdateManyWithoutWorkspaceNestedInput } from './CompanyUpdateManyWithoutWorkspaceNestedInput';
import { DateTimeFieldUpdateOperationsInput } from './DateTimeFieldUpdateOperationsInput';
import { NullableDateTimeFieldUpdateOperationsInput } from './NullableDateTimeFieldUpdateOperationsInput';
import { PersonUpdateManyWithoutWorkspaceNestedInput } from './PersonUpdateManyWithoutWorkspaceNestedInput';
import { StringFieldUpdateOperationsInput } from './StringFieldUpdateOperationsInput';

@TypeGraphQL.InputType('WorkspaceUpdateWithoutWorkspaceMemberInput', {
  isAbstract: true,
})
export class WorkspaceUpdateWithoutWorkspaceMemberInput {
  @TypeGraphQL.Field((_type) => StringFieldUpdateOperationsInput, {
    nullable: true,
  })
  id?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field((_type) => DateTimeFieldUpdateOperationsInput, {
    nullable: true,
  })
  createdAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field((_type) => DateTimeFieldUpdateOperationsInput, {
    nullable: true,
  })
  updatedAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field((_type) => NullableDateTimeFieldUpdateOperationsInput, {
    nullable: true,
  })
  deletedAt?: NullableDateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field((_type) => StringFieldUpdateOperationsInput, {
    nullable: true,
  })
  domainName?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field((_type) => StringFieldUpdateOperationsInput, {
    nullable: true,
  })
  displayName?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field((_type) => CompanyUpdateManyWithoutWorkspaceNestedInput, {
    nullable: true,
  })
  companies?: CompanyUpdateManyWithoutWorkspaceNestedInput | undefined;

  @TypeGraphQL.Field((_type) => PersonUpdateManyWithoutWorkspaceNestedInput, {
    nullable: true,
  })
  people?: PersonUpdateManyWithoutWorkspaceNestedInput | undefined;
}
