import * as TypeGraphQL from '@nestjs/graphql';
import * as GraphQLScalars from 'graphql-scalars';
import { Prisma } from '@prisma/client';
import { DecimalJSScalar } from '../../scalars';
import { WorkspaceCreateNestedOneWithoutWorkspaceMemberInput } from './WorkspaceCreateNestedOneWithoutWorkspaceMemberInput';

@TypeGraphQL.InputType('WorkspaceMemberCreateWithoutUserInput', {
  isAbstract: true,
})
export class WorkspaceMemberCreateWithoutUserInput {
  @TypeGraphQL.Field((_type) => String, {
    nullable: false,
  })
  id!: string;

  @TypeGraphQL.Field((_type) => Date, {
    nullable: true,
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field((_type) => Date, {
    nullable: true,
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field((_type) => Date, {
    nullable: true,
  })
  deletedAt?: Date | undefined;

  @TypeGraphQL.Field(
    (_type) => WorkspaceCreateNestedOneWithoutWorkspaceMemberInput,
    {
      nullable: false,
    },
  )
  workspace!: WorkspaceCreateNestedOneWithoutWorkspaceMemberInput;
}
