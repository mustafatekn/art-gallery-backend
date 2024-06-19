import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Post } from 'src/post/schemas/post.schema';
import { CreatePostDto } from './dtos/create-post.dto';
import { UserToken } from 'src/auth/types/user-token';
import { generateUrlFromTitle } from 'utils/postUtils';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async getPostByUrl(url: string) {
    const post = await this.postModel.findOne({ url }).exec();
    if (!post)
      throw new NotFoundException(`Post with url ${url} doesn't exist`);
    return post;
  }

  getPosts() {
    return this.postModel.find().exec();
  }

  deletePost(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException(`Post id ${id} is not valid`);
    return this.postModel.findByIdAndDelete(id).exec();
  }

  createPost(createPostDto: CreatePostDto, user: UserToken) {
    const post = new this.postModel({
      ...createPostDto,
      url: generateUrlFromTitle(createPostDto.title),
      userId: user.id,
    });
    return post.save();
  }
}
