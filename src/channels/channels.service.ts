import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelChats } from '../entities/ChannelChats';
import { MoreThan, Repository } from 'typeorm';
import { Channels } from '../entities/Channels';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(ChannelChats)
    private channelChatsRepository: Repository<ChannelChats>,
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
  ) {}

  async getWorkspaceChannelChats(
    url: string,
    name: string,
    perPage: number,
    page: number,
  ) {
    return this.channelChatsRepository
      .createQueryBuilder('channelChats')
      .innerJoin('channelChats.Channel', 'channel', 'channel.name = :name', {
        name,
      })
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .innerJoinAndSelect('channelChats.User', 'user')
      .orderBy('channelChats.createdAt', 'DESC')
      .take(perPage) // limit
      .skip(perPage * (page - 1))
      .getMany();
  }

  async getChannelUnreadCount(url, name, after) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();

    return this.channelChatsRepository.count({
      // COUNT(*)
      where: {
        ChannelId: channel.id,
        createdAt: MoreThan(new Date(after)), // createdAt > "2021-08-29"
      },
    });
  }

  async postChat({ url, content, name, myId }) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();

    if (!channel) {
      throw new NotFoundException('채널이 존재하지 않습니다');
    }

    const chats = new ChannelChats();
    chats.content = content;
    chats.UserId = myId;
    chats.ChannelId = channel.id;
    const saveChat = await this.channelChatsRepository.save(chats);
    const chatWithUser = await this.channelChatsRepository.findOne({
      where: { id: saveChat.id },
      relations: ['User', 'Channel'],
    });

    // socket.io로 워크스페이스 + 채널에 전송
  }
}
