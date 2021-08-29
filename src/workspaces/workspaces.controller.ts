import { Controller, Delete, Get, Post } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { User } from '../common/decorators/user.decorator';
import { Users } from '../entities/Users';

@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Get()
  getMyWorkspaces(@User() user: Users) {
    return this.workspacesService.findMyWorkspaces(user.id);
  }

  @Post()
  createWorkspace() {}

  @Get(':url/members')
  GetAllMembersFromWorkspace() {}

  @Post(':url/members')
  inviteMembersToWorkspace() {}

  @Delete(':url/members/:id')
  kickMemberFromWorkspace() {}

  @Get(':url/members/:id')
  getMemberInfoInWorkspace() {}
}
