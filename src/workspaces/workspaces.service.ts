import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspaces } from '../entities/Workspaces';
import { Repository } from 'typeorm';
import { Channels } from '../entities/Channels';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Users } from '../entities/Users';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findById(id: number) {
    return this.workspacesRepository.findByIds([id]);
  }

  async findMyWorkspaces(myId: number) {
    return this.workspacesRepository.find({
      where: {
        WorkspaceMembers: [{ UserId: myId }],
      },
    });
  }

  async createWorkspace(name: string, url: string, myId: number) {
    // 실제 DB에 저장하는게 아니라 entitie 객체를 만들어 줄 뿐이다.
    const workspace = this.workspacesRepository.create({
      name,
      url,
      OwnerId: myId,
    });

    const returned = await this.workspacesRepository.save(workspace);

    const workspaceMember = new WorkspaceMembers();
    workspaceMember.UserId = myId;
    workspaceMember.WorkspaceId = returned.id;

    const channel = new Channels();
    channel.name = '일반';
    channel.WorkspaceId = returned.id;

    const [, channelReturned] = await Promise.all([
      this.workspacesRepository.save(workspaceMember),
      this.channelsRepository.save(channel),
    ]);

    const channelMember = new ChannelMembers();
    await this.channelMembersRepository.save({
      UserId: myId,
      ChannelId: channelReturned.id,
    });
  }

  async getWorkspaceMembers(url: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.WorkspaceMembers', 'members')
      .innerJoin('members.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .getMany(); // 결과를 javascript 로 바꿔줌
  }

  async createWorkspaceMembers(url, email) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },

      join: {
        alias: 'workspace',
        innerJoinAndSelect: {
          channels: 'workspace.Channels',
        },
      },
    });

    /*const workspace = this.workspacesRepository
      .createQueryBuilder('workspace')
      .innerJoinAndSelect(
        'workspace.Channels',
        'channels',
        'workspace.url = :url',
        {
          url,
        },
      )
      .getOne();*/

    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const workspaceMember = new WorkspaceMembers();
    workspaceMember.WorkspaceId = workspace.id;
    workspaceMember.UserId = user.id;
    await this.workspacesRepository.save(workspaceMember);

    const channelMember = new ChannelMembers();
    channelMember.ChannelId = workspace.Channels.find(
      (v) => v.name === '일반',
    ).id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
  }

  async getWorkspaceMember(url: string, id: number) {
    return (
      this.usersRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        //.andWhere() .orWhere() .where('user.id = :id AND user.name = :name', { id, name })
        .innerJoin('user.Workspaces', 'workspaces', 'workspaces.url = :url', {
          url,
        })
        .getOne()
    );
  }
}
